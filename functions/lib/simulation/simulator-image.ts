// functions/lib/simulation/simulator-image.ts

const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'] as const;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

/** Returns the image extension in lowercase. */
export function getImageExtension(filename: string): string {
  const lower = filename.toLowerCase();
  for (const ext of ALLOWED_IMAGE_EXTENSIONS) {
    if (lower.endsWith(ext)) return ext;
  }
  return '';
}

/** Validates simulator image metadata. */
export function validateSimulatorImage(filename: string, size: number): string | null {
  if (!getImageExtension(filename)) {
    return '画像は PNG / JPEG / WebP / GIF のみアップロードできます';
  }
  if (size <= 0 || size > MAX_IMAGE_SIZE) {
    return `画像サイズは1バイト以上${MAX_IMAGE_SIZE / (1024 * 1024)}MB以下である必要があります`;
  }
  return null;
}

/** Returns Content-Type for a simulator image. */
export function getImageContentType(filename: string): string {
  const ext = getImageExtension(filename);
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

/** Generates a unique R2 key for a simulator image. */
export function generateSimulatorImageR2Key(simulatorId: string, filename: string): string {
  return `simulation/simulators/${simulatorId}/${crypto.randomUUID()}${getImageExtension(filename)}`;
}

/** Uploads a simulator image to R2. */
export async function uploadSimulatorImage(
  bucket: R2Bucket,
  simulatorId: string,
  filename: string,
  body: ArrayBuffer
): Promise<string> {
  const validationError = validateSimulatorImage(filename, body.byteLength);
  if (validationError) throw new Error(validationError);

  const r2Key = generateSimulatorImageR2Key(simulatorId, filename);
  await bucket.put(r2Key, body, {
    httpMetadata: { contentType: getImageContentType(filename) },
  });
  return r2Key;
}

/** Streams a simulator image from R2. */
export async function streamSimulatorImage(
  bucket: R2Bucket,
  r2Key: string,
  filename: string
): Promise<Response> {
  const obj = await bucket.get(r2Key);
  if (!obj) throw new Error('画像が見つかりません');

  return new Response(obj.body, {
    headers: {
      'Content-Type': getImageContentType(filename),
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
