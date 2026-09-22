/** Full-screen status overlay for contest STL upload / print reservation (労働画面風). */

/**
 * @param {boolean} visible
 * @param {string} [message]
 * @param {string} [hint]
 */
export function setPrintFlowOverlay(visible, message = '処理中…', hint = '') {
  const overlay = document.getElementById('print-flow-overlay');
  const textEl = document.getElementById('print-flow-overlay-text');
  const hintEl = document.getElementById('print-flow-overlay-hint');
  if (!overlay) return;
  overlay.classList.toggle('hidden', !visible);
  overlay.setAttribute('aria-hidden', visible ? 'false' : 'true');
  if (textEl && message) textEl.textContent = message;
  if (hintEl) {
    hintEl.textContent = hint;
    hintEl.classList.toggle('hidden', !hint);
  }
}
