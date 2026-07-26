// functions/lib/aws/ec2.ts
import { AwsClient } from "aws4fetch";

export interface AwsEc2Env {
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
}

export interface RunEc2InstanceInput {
  imageId: string;
  instanceType: string;
  subnetId: string;
  securityGroupId: string;
  userData: string;
  jobId: string;
  maxRuntimeHours: number;
}

export interface Ec2InstanceInfo {
  instanceId: string;
  state: string;
  launchTime: string | null;
}

const EC2_API_VERSION = "2016-11-15";

/** Returns whether AWS EC2 credentials are configured. */
export function isAwsEc2Configured(env: AwsEc2Env): boolean {
  return Boolean(env.AWS_ACCESS_KEY_ID?.trim() && env.AWS_SECRET_ACCESS_KEY?.trim());
}

function getAwsRegion(env: AwsEc2Env): string {
  return env.AWS_REGION?.trim() || "ap-northeast-1";
}

function createEc2Client(env: AwsEc2Env): AwsClient {
  return new AwsClient({
    accessKeyId: env.AWS_ACCESS_KEY_ID!.trim(),
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!.trim(),
    region: getAwsRegion(env),
    service: "ec2",
  });
}

function ec2Endpoint(env: AwsEc2Env): string {
  return `https://ec2.${getAwsRegion(env)}.amazonaws.com/`;
}

/** Encodes user-data for EC2 RunInstances. */
export function encodeEc2UserData(script: string): string {
  const bytes = new TextEncoder().encode(script);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/** Extracts a single XML tag value from EC2 API responses. */
function readXmlTag(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return match?.[1] ?? null;
}

const EC2_IMAGE_STATES = new Set(["pending", "available", "failed", "invalid", "transient", "deleted"]);

/** Returns the outermost EC2 Query API <item> block containing a marker string. */
function extractEc2XmlItemBlock(xml: string, marker: string): string | null {
  const markerPos = xml.indexOf(marker);
  if (markerPos === -1) return null;

  let start = -1;
  let depth = 0;
  for (let i = markerPos; i >= 0; i--) {
    if (xml.startsWith("</item>", i)) depth += 1;
    else if (xml.startsWith("<item>", i)) {
      if (depth === 0) {
        start = i;
        break;
      }
      depth -= 1;
    }
  }
  if (start === -1) return null;

  depth = 0;
  for (let i = start; i < xml.length; i++) {
    if (xml.startsWith("<item>", i)) depth += 1;
    else if (xml.startsWith("</item>", i)) {
      depth -= 1;
      if (depth === 0) {
        return xml.slice(start, i + "</item>".length);
      }
    }
  }
  return null;
}

/** Reads AMI state from a DescribeImages item XML block. */
function readEc2ImageState(itemXml: string): string {
  const imageStateValue = readXmlTag(itemXml, "imageState");
  if (imageStateValue && EC2_IMAGE_STATES.has(imageStateValue)) {
    return imageStateValue;
  }

  const imageStateMatch = itemXml.match(
    /<imageState>[\s\S]*?<name>([^<]+)<\/name>[\s\S]*?<\/imageState>/
  );
  if (imageStateMatch?.[1] && EC2_IMAGE_STATES.has(imageStateMatch[1])) {
    return imageStateMatch[1];
  }

  for (const match of itemXml.matchAll(/<state>([^<]+)<\/state>/g)) {
    const value = match[1];
    if (value && EC2_IMAGE_STATES.has(value)) {
      return value;
    }
  }

  return readXmlTag(itemXml, "state") ?? "unknown";
}

/** Sends a signed EC2 Query API request. */
async function ec2Request(env: AwsEc2Env, params: Record<string, string>): Promise<string> {
  const body = new URLSearchParams({
    Version: EC2_API_VERSION,
    ...params,
  });

  const client = createEc2Client(env);
  const signed = await client.sign(
    new Request(ec2Endpoint(env), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
      body,
    })
  );

  const response = await fetch(signed);
  const text = await response.text();
  if (!response.ok) {
    const message = readXmlTag(text, "Message") ?? text.slice(0, 300);
    throw new Error(`AWS EC2 API エラー: ${message}`);
  }
  return text;
}

/** Launches a single EC2 instance for an FDS job. */
export async function runEc2Instance(env: AwsEc2Env, input: RunEc2InstanceInput): Promise<string> {
  const params: Record<string, string> = {
    Action: "RunInstances",
    ImageId: input.imageId,
    InstanceType: input.instanceType,
    MinCount: "1",
    MaxCount: "1",
    SubnetId: input.subnetId,
    "SecurityGroupId.1": input.securityGroupId,
    UserData: encodeEc2UserData(input.userData),
    "InstanceInitiatedShutdownBehavior": "terminate",
    "TagSpecification.1.ResourceType": "instance",
    "TagSpecification.1.Tag.1.Key": "sciencehub-fds-job",
    "TagSpecification.1.Tag.1.Value": input.jobId,
    "TagSpecification.1.Tag.2.Key": "sciencehub-component",
    "TagSpecification.1.Tag.2.Value": "fds-test",
    "TagSpecification.1.Tag.3.Key": "sciencehub-max-runtime-hours",
    "TagSpecification.1.Tag.3.Value": String(input.maxRuntimeHours),
  };

  const xml = await ec2Request(env, params);
  const instanceId = readXmlTag(xml, "instanceId");
  if (!instanceId) {
    throw new Error("EC2 インスタンス ID を取得できませんでした");
  }
  return instanceId;
}

/** Describes an AMI by ID (image state: pending | available | failed). */
export async function describeEc2Image(
  env: AwsEc2Env,
  imageId: string
): Promise<{ imageId: string; state: string; stateReason: string | null } | null> {
  const xml = await ec2Request(env, {
    Action: "DescribeImages",
    "ImageId.1": imageId,
  });

  const item = extractEc2XmlItemBlock(xml, `<imageId>${imageId}</imageId>`);
  if (!item) return null;

  const state = readEc2ImageState(item);
  const reasonMatch = item.match(/<stateReason>[\s\S]*?<message>([^<]*)<\/message>/);
  return {
    imageId,
    state,
    stateReason: reasonMatch?.[1]?.trim() || null,
  };
}

const AMI_WAIT_INTERVAL_MS = 5000;

/** Thrown when RunInstances cannot proceed because the AMI is not yet available. */
export class Ec2AmiNotReadyError extends Error {
  readonly code = "AMI_NOT_READY" as const;
  readonly amiId: string;
  readonly amiState: string;

  constructor(amiId: string, amiState: string) {
    super(
      `AMI '${amiId}' はまだ ${amiState} です。EC2 コンソールで「利用可能」になるまで待ってから再実行してください（通常 2〜10 分）。`
    );
    this.name = "Ec2AmiNotReadyError";
    this.amiId = amiId;
    this.amiState = amiState;
  }
}

/** Waits until an AMI is available or throws. */
export async function waitForEc2AmiAvailable(
  env: AwsEc2Env,
  imageId: string,
  options: {
    maxWaitMs?: number;
    onStatus?: (state: string) => void;
  } = {}
): Promise<void> {
  const maxWaitMs = options.maxWaitMs ?? 20_000;
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const image = await describeEc2Image(env, imageId);
    const state = image?.state ?? "unknown";
    options.onStatus?.(state);

    if (state === "available") {
      return;
    }
    if (state === "failed" || state === "invalid") {
      throw new Error(`AMI '${imageId}' は ${state} のため使用できません。AMI を作り直してください。`);
    }

    const remaining = deadline - Date.now();
    if (remaining <= 0) break;
    await new Promise((resolve) => setTimeout(resolve, Math.min(AMI_WAIT_INTERVAL_MS, remaining)));
  }

  const final = await describeEc2Image(env, imageId);
  const finalState = final?.state ?? "unknown";
  if (finalState !== "available") {
    throw new Ec2AmiNotReadyError(imageId, finalState);
  }
}

/** Describes an EC2 instance by ID. */
export async function describeEc2Instance(
  env: AwsEc2Env,
  instanceId: string
): Promise<Ec2InstanceInfo | null> {
  const xml = await ec2Request(env, {
    Action: "DescribeInstances",
    "InstanceId.1": instanceId,
  });

  const item = extractEc2XmlItemBlock(xml, `<instanceId>${instanceId}</instanceId>`);
  if (!item) return null;

  const stateMatch = item.match(/<instanceState>[\s\S]*?<name>([^<]+)<\/name>[\s\S]*?<\/instanceState>/);
  return {
    instanceId,
    state: stateMatch?.[1] ?? "unknown",
    launchTime: readXmlTag(item, "launchTime"),
  };
}

/** Terminates an EC2 instance. */
export async function terminateEc2Instance(env: AwsEc2Env, instanceId: string): Promise<void> {
  await ec2Request(env, {
    Action: "TerminateInstances",
    "InstanceId.1": instanceId,
  });
}
