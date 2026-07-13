// functions/lib/3dprint/printer-capabilities.ts

export interface PrinterCapabilities {
  can_record_print_video: boolean;
  nozzle_sizes_mm: string[];
}

export const DEFAULT_PRINTER_CAPABILITIES: PrinterCapabilities = {
  can_record_print_video: false,
  nozzle_sizes_mm: ['0.4'],
};

/** Parses stored JSON into validated printer capabilities. */
export function parsePrinterCapabilities(raw: string | null | undefined): PrinterCapabilities {
  if (!raw?.trim()) return { ...DEFAULT_PRINTER_CAPABILITIES };

  try {
    const parsed = JSON.parse(raw) as Partial<PrinterCapabilities>;
    return normalizePrinterCapabilities(parsed);
  } catch {
    return { ...DEFAULT_PRINTER_CAPABILITIES };
  }
}

/** Normalizes partial capability input. */
export function normalizePrinterCapabilities(
  input: Partial<PrinterCapabilities> | null | undefined
): PrinterCapabilities {
  const nozzleSizes = Array.isArray(input?.nozzle_sizes_mm)
    ? input.nozzle_sizes_mm.map((v) => String(v).trim()).filter(Boolean)
    : [];

  return {
    can_record_print_video: Boolean(input?.can_record_print_video),
    nozzle_sizes_mm: nozzleSizes.length ? dedupeNozzleSizes(nozzleSizes) : ['0.4'],
  };
}

/** Validates capability payload from API. Returns error message or null. */
export function validatePrinterCapabilitiesInput(
  input: unknown
): { capabilities: PrinterCapabilities } | { error: string } {
  if (!input || typeof input !== 'object') {
    return { error: 'capabilities の形式が不正です' };
  }

  const body = input as Partial<PrinterCapabilities>;
  const nozzleSizes = body.nozzle_sizes_mm;

  if (!Array.isArray(nozzleSizes)) {
    return { error: 'ノズル径は配列で指定してください' };
  }

  if (nozzleSizes.length === 0) {
    return { error: 'ノズル径を1つ以上入力してください' };
  }

  if (nozzleSizes.length > 8) {
    return { error: 'ノズル径は8個まで登録できます' };
  }

  const normalizedSizes: string[] = [];
  for (const size of nozzleSizes) {
    const text = String(size).trim().replace(/mm$/i, '');
    if (!/^\d+(\.\d+)?$/.test(text)) {
      return { error: `ノズル径の形式が不正です: ${size}` };
    }
    const value = Number(text);
    if (value <= 0 || value > 3) {
      return { error: `ノズル径は 0 より大きく 3mm 以下で入力してください: ${size}` };
    }
    normalizedSizes.push(formatNozzleSize(value));
  }

  return {
    capabilities: {
      can_record_print_video: Boolean(body.can_record_print_video),
      nozzle_sizes_mm: dedupeNozzleSizes(normalizedSizes),
    },
  };
}

/** Serializes capabilities for database storage. */
export function serializePrinterCapabilities(capabilities: PrinterCapabilities): string {
  return JSON.stringify(normalizePrinterCapabilities(capabilities));
}

/** Formats a nozzle size for display/storage. */
function formatNozzleSize(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
}

/** Removes duplicate nozzle sizes while preserving order. */
function dedupeNozzleSizes(sizes: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const size of sizes) {
    const normalized = formatNozzleSize(Number(size));
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}
