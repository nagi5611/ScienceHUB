// functions/lib/simulation/openfoam-zip-extract.ts

const MAX_EXTRACT_BYTES = 64 * 1024;
const MAX_TOTAL_CHARS = 20_000;

const REVIEW_PATH_PATTERNS = [
  /(^|\/)system\/controlDict$/i,
  /(^|\/)system\/fvSchemes$/i,
  /(^|\/)system\/fvSolution$/i,
  /(^|\/)system\/decomposeParDict$/i,
  /(^|\/)constant\/transportProperties$/i,
  /(^|\/)constant\/turbulenceProperties$/i,
  /(^|\/)Allrun$/i,
];

interface ZipEntry {
  name: string;
  compression: number;
  compressedSize: number;
  uncompressedSize: number;
  dataOffset: number;
}

/** Normalizes ZIP entry path for matching. */
function normalizeZipPath(name: string): string {
  return name.replace(/\\/g, "/").replace(/^\/+/, "");
}

/** Lists local file headers in a ZIP (best-effort, no central directory required). */
function listZipEntries(buffer: ArrayBuffer): ZipEntry[] {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const entries: ZipEntry[] = [];
  let offset = 0;

  while (offset + 30 <= bytes.length) {
    if (
      view.getUint32(offset, true) !== 0x04034b50
    ) {
      break;
    }
    const compression = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const uncompressedSize = view.getUint32(offset + 22, true);
    const nameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);
    const nameStart = offset + 30;
    const nameEnd = nameStart + nameLen;
    if (nameEnd > bytes.length) break;

    const name = new TextDecoder().decode(bytes.subarray(nameStart, nameEnd));
    const dataOffset = nameEnd + extraLen;
    entries.push({
      name: normalizeZipPath(name),
      compression,
      compressedSize,
      uncompressedSize,
      dataOffset,
    });

    offset = dataOffset + compressedSize;
    if (name.endsWith("/") && compressedSize === 0) continue;
  }

  return entries;
}

/** Decompresses a single ZIP entry payload (stored or deflate). */
async function decompressEntry(
  bytes: Uint8Array,
  entry: ZipEntry
): Promise<Uint8Array | null> {
  const slice = bytes.subarray(entry.dataOffset, entry.dataOffset + entry.compressedSize);
  if (entry.compression === 0) {
    return slice;
  }
  if (entry.compression === 8) {
    try {
      const ds = new DecompressionStream("deflate-raw");
      const writer = ds.writable.getWriter();
      await writer.write(slice);
      await writer.close();
      const out = await new Response(ds.readable).arrayBuffer();
      return new Uint8Array(out);
    } catch {
      return null;
    }
  }
  return null;
}

/** Extracts key OpenFOAM dictionary text from a case ZIP for AI primary review. */
export async function extractOpenfoamTextForReview(buffer: ArrayBuffer): Promise<string> {
  const entries = listZipEntries(buffer);
  if (!entries.length) {
    return "（ZIP 内のファイル一覧を読み取れませんでした）";
  }

  const bytes = new Uint8Array(buffer);
  const parts: string[] = [];
  let totalChars = 0;

  for (const entry of entries) {
    if (entry.name.endsWith("/")) continue;
    const matches = REVIEW_PATH_PATTERNS.some((re) => re.test(entry.name));
    if (!matches) continue;
    if (entry.uncompressedSize > MAX_EXTRACT_BYTES) continue;

    const data = await decompressEntry(bytes, entry);
    if (!data) {
      parts.push(`### ${entry.name}\n（展開できませんでした: compression=${entry.compression}）`);
      continue;
    }

    const text = new TextDecoder("utf-8", { fatal: false }).decode(data).trim();
    if (!text) continue;

    const chunk = `### ${entry.name}\n${text}`;
    if (totalChars + chunk.length > MAX_TOTAL_CHARS) {
      parts.push(chunk.slice(0, MAX_TOTAL_CHARS - totalChars));
      break;
    }
    parts.push(chunk);
    totalChars += chunk.length;
  }

  if (parts.length) {
    return parts.join("\n\n");
  }

  const names = entries
    .filter((e) => !e.name.endsWith("/"))
    .map((e) => e.name)
    .slice(0, 80);
  return `OpenFOAM ケース ZIP（${names.length} ファイル）:\n${names.join("\n")}\n\n（system/controlDict 等の辞書ファイルを展開できませんでした。ZIP は deflate または stored 形式で、ケースルート直下に system/ を含めてください）`;
}
