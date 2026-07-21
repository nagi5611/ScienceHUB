// functions/lib/simulation/simulator-capabilities.ts

export interface SimulatorCapabilities {
  can_record_result_video: boolean;
  nozzle_sizes_mm: string[];
}

export const DEFAULT_PRINTER_CAPABILITIES: SimulatorCapabilities = {
  can_record_result_video: false,
  nozzle_sizes_mm: ['0.4'],
};

/** Parses stored JSON into validated simulator capabilities. */
export function parseSimulatorCapabilities(raw: string | null | undefined): SimulatorCapabilities {
  if (!raw?.trim()) return { ...DEFAULT_PRINTER_CAPABILITIES };

  try {
    const parsed = JSON.parse(raw) as Partial<SimulatorCapabilities>;
    return normalizeSimulatorCapabilities(parsed);
  } catch {
    return { ...DEFAULT_PRINTER_CAPABILITIES };
  }
}

/** Normalizes partial capability input. */
export function normalizeSimulatorCapabilities(
  input: Partial<SimulatorCapabilities> | null | undefined
): SimulatorCapabilities {
  const nozzleSizes = Array.isArray(input?.nozzle_sizes_mm)
    ? input.nozzle_sizes_mm.map((v) => String(v).trim()).filter(Boolean)
    : [];

  return {
    can_record_result_video: Boolean(input?.can_record_result_video),
    nozzle_sizes_mm: nozzleSizes.length ? dedupeNozzleSizes(nozzleSizes) : ['0.4'],
  };
}

/** Validates capability payload from API. Returns error message or null. */
export function validateSimulatorCapabilitiesInput(
  input: unknown
): { capabilities: SimulatorCapabilities } | { error: string } {
  if (!input || typeof input !== 'object') {
    return { error: 'capabilities の形式が不正です' };
  }

  const body = input as Partial<SimulatorCapabilities>;
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
      can_record_result_video: Boolean(body.can_record_result_video),
      nozzle_sizes_mm: dedupeNozzleSizes(normalizedSizes),
    },
  };
}

/** Serializes capabilities for database storage. */
export function serializeSimulatorCapabilities(capabilities: SimulatorCapabilities): string {
  return JSON.stringify(normalizeSimulatorCapabilities(capabilities));
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
