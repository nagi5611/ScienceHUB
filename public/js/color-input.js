/**
 * 管理パネル用 — #RRGGBB 形式の色入力
 */

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

/** 入力値を #RRGGBB に正規化（無効なら null） */
export function normalizeHexColor(value) {
  if (typeof value !== "string") return null;
  let v = value.trim();
  if (!v) return null;
  if (!v.startsWith("#")) v = `#${v}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(v)) {
    v = `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return HEX_RE.test(v) ? v.toUpperCase() : null;
}

/** 色入力の値を取得 */
export function readColorValue(input) {
  if (!input) return null;
  return normalizeHexColor(input.value);
}

/** 色入力とプレビューを更新 */
export function setColorInput(input, hex) {
  if (!input) return;
  const field = input.closest("[data-color-field]");
  const fallback = normalizeHexColor(field?.dataset.default ?? "#F38020") ?? "#F38020";
  input.value = normalizeHexColor(hex) ?? fallback;
  updateColorSwatch(input);
}

function updateColorSwatch(input) {
  const field = input.closest("[data-color-field]");
  const swatch = field?.querySelector(".cf-color-swatch");
  if (!swatch) return;

  const hex = normalizeHexColor(input.value);
  const invalid = input.value.trim() !== "" && !hex;

  swatch.style.backgroundColor = hex ?? "transparent";
  swatch.classList.toggle("is-invalid", invalid);
  input.classList.toggle("is-invalid", invalid);
}

/** ページ内の色入力を初期化 */
export function initColorFields(root = document) {
  root.querySelectorAll("[data-color-field]").forEach((field) => {
    const input = field.querySelector(".cf-color-hex");
    if (!input || input.dataset.colorBound === "1") return;
    input.dataset.colorBound = "1";

    input.addEventListener("input", () => updateColorSwatch(input));
    input.addEventListener("blur", () => {
      const hex = normalizeHexColor(input.value);
      if (hex) {
        input.value = hex;
      } else if (!input.value.trim()) {
        const def = normalizeHexColor(field.dataset.default);
        if (def) input.value = def;
      }
      updateColorSwatch(input);
    });

    updateColorSwatch(input);
  });
}
