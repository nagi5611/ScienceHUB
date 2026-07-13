// public/apps/3dprint-reservation/js/printer-capabilities.js

/** Formats waiting count label for printer picker. */
export function formatPrinterWaitingLabel(count, { dateScoped = false } = {}) {
  const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0;
  const prefix = dateScoped ? 'この日の予約待ち' : '予約待ち';
  if (safeCount === 0) return `${prefix}なし`;
  return `${prefix} ${safeCount}件`;
}

/** Builds waiting count badge HTML. */
export function buildPrinterWaitingBadge(count, { escapeHtml, dateScoped = false } = {}) {
  const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0;
  const label = formatPrinterWaitingLabel(safeCount, { dateScoped });
  const className =
    safeCount === 0
      ? 'printer-waiting-badge printer-waiting-badge-empty'
      : 'printer-waiting-badge printer-waiting-badge-busy';
  return `<span class="${className}">${escapeHtml(label)}</span>`;
}

/** Returns default capabilities when API data is missing. */
export function defaultPrinterCapabilities() {
  return {
    can_record_print_video: false,
    nozzle_sizes_mm: ['0.4'],
  };
}

/** Normalizes capability object from API. */
export function normalizePrinterCapabilities(capabilities) {
  if (!capabilities || typeof capabilities !== 'object') {
    return defaultPrinterCapabilities();
  }

  const sizes = Array.isArray(capabilities.nozzle_sizes_mm)
    ? capabilities.nozzle_sizes_mm.map((v) => String(v).trim()).filter(Boolean)
    : [];

  return {
    can_record_print_video: Boolean(capabilities.can_record_print_video),
    nozzle_sizes_mm: sizes.length ? sizes : ['0.4'],
  };
}

/** Formats nozzle sizes for display. */
export function formatNozzleSizes(sizes) {
  const list = Array.isArray(sizes) ? sizes : [];
  if (!list.length) return '—';
  return list.map((size) => `${size}mm`).join(' / ');
}

/** Builds compact capability badges HTML. */
export function buildPrinterCapabilityBadges(capabilities, { escapeHtml }) {
  const caps = normalizePrinterCapabilities(capabilities);
  const badges = [];

  badges.push(
    `<span class="printer-cap-badge">ノズル ${escapeHtml(formatNozzleSizes(caps.nozzle_sizes_mm))}</span>`
  );

  if (caps.can_record_print_video) {
    badges.push('<span class="printer-cap-badge printer-cap-badge-accent">動画撮影可</span>');
  }

  return `<div class="printer-cap-badges">${badges.join('')}</div>`;
}

/** Parses comma-separated nozzle input into an array. */
export function parseNozzleSizesInput(value) {
  return String(value ?? '')
    .split(/[,、\s]+/)
    .map((part) => part.trim().replace(/mm$/i, ''))
    .filter(Boolean);
}

/** Joins nozzle sizes for form input. */
export function nozzleSizesToInputValue(sizes) {
  return (Array.isArray(sizes) ? sizes : []).join(', ');
}
