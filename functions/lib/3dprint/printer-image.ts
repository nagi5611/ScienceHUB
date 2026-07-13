// functions/lib/3dprint/printer-image.ts

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

/** Validates printer image metadata. */
export function validatePrinterImage(filename: string, size: number): string | null {
  if (!getImageExtension(filename)) {
    return '画像は PNG / JPEG / WebP / GIF のみアップロードできます';
  }
  if (size <= 0 || size > MAX_IMAGE_SIZE) {
    return `画像サイズは1バイト以上${MAX_IMAGE_SIZE / (1024 * 1024)}MB以下である必要があります`;
  }
  return null;
}

/** Returns Content-Type for a printer image. */
export function getImageContentType(filename: string): string {
  const ext = getImageExtension(filename);
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

/** Generates a unique R2 key for a printer image. */
export function generatePrinterImageR2Key(printerId: string, filename: string): string {
  return `3dprint/printers/${printerId}/${crypto.randomUUID()}${getImageExtension(filename)}`;
}

/** Uploads a printer image to R2. */
export async function uploadPrinterImage(
  bucket: R2Bucket,
  printerId: string,
  filename: string,
  body: ArrayBuffer
): Promise<string> {
  const validationError = validatePrinterImage(filename, body.byteLength);
  if (validationError) throw new Error(validationError);

  const r2Key = generatePrinterImageR2Key(printerId, filename);
  await bucket.put(r2Key, body, {
    httpMetadata: { contentType: getImageContentType(filename) },
  });
  return r2Key;
}

/** Streams a printer image from R2. */
export async function streamPrinterImage(
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
