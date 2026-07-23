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

/** Describes an EC2 instance by ID. */
export async function describeEc2Instance(
  env: AwsEc2Env,
  instanceId: string
): Promise<Ec2InstanceInfo | null> {
  const xml = await ec2Request(env, {
    Action: "DescribeInstances",
    "InstanceId.1": instanceId,
  });

  const itemMatch = xml.match(
    new RegExp(
      `<item>[\\s\\S]*?<instanceId>${instanceId}</instanceId>[\\s\\S]*?</item>`
    )
  );
  if (!itemMatch) return null;

  const item = itemMatch[0];
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
