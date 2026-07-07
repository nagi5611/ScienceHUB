/**
 * ScienceHUB — 共通アイコン（ストローク SVG）
 * サイトのロゴと同じ線画スタイルで統一
 */

const STROKE = 'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

/** アイコン名 → SVG 内部パス */
const ICONS = {
  app: `<rect x="3" y="3" width="7" height="7" rx="1.5" ${STROKE}/><rect x="14" y="3" width="7" height="7" rx="1.5" ${STROKE}/><rect x="3" y="14" width="7" height="7" rx="1.5" ${STROKE}/><rect x="14" y="14" width="7" height="7" rx="1.5" ${STROKE}/>`,
  image: `<rect x="3" y="5" width="18" height="14" rx="2" ${STROKE}/><circle cx="8.5" cy="10" r="1.5" ${STROKE}/><path d="M3 16l5-4 4 3 3-2 6 5" ${STROKE}/>`,
  layout: `<path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" ${STROKE}/><rect x="7" y="7" width="10" height="10" rx="1" ${STROKE}/>`,
  users: `<circle cx="9" cy="8" r="3" ${STROKE}/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" ${STROKE}/><circle cx="17" cy="9" r="2.5" ${STROKE}/><path d="M15 20c.3-2.2 1.8-3.5 4-3.5" ${STROKE}/>`,
  shield: `<path d="M12 3 5 6v5.5c0 4.2 3 8.1 7 9.5 4-1.4 7-5.3 7-9.5V6l-7-3z" ${STROKE}/>`,
  folder: `<path d="M4 7h6l2 2h8v10H4V7z" ${STROKE}/>`,
  user: `<circle cx="12" cy="8" r="3.5" ${STROKE}/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" ${STROKE}/>`,
  edit: `<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" ${STROKE}/>`,
  search: `<circle cx="11" cy="11" r="6" ${STROKE}/><path d="M16 16l5 5" ${STROKE}/>`,
  bell: `<path d="M12 4a4 4 0 0 0-4 4v2.5L6 13.5V15h12v-1.5l-2-3V8a4 4 0 0 0-4-4z" ${STROKE}/><path d="M10 17a2 2 0 0 0 4 0" ${STROKE}/>`,
  calendar: `<rect x="3" y="5" width="18" height="16" rx="2" ${STROKE}/><path d="M3 10h18M8 3v4M16 3v4" ${STROKE}/>`,
};

const SLUG_ICON = {
  "image-editor": "image",
  uvcreator: "layout",
  "shift-management": "calendar",
};

const EMOJI_ICON = {
  "📦": "app",
  "🖼": "image",
  "📐": "layout",
  "📅": "calendar",
  "👥": "users",
  "🛡": "shield",
  "🛡️": "shield",
  "📁": "folder",
  "👤": "user",
};

/** 指定アイコンの SVG 文字列を返す */
export function iconHtml(name, className = "hub-icon") {
  const inner = ICONS[name] ?? ICONS.app;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}

/** アプリ用アイコン（スラッグ優先、次に絵文字、なければ汎用） */
export function appIconHtml(app = {}, className = "hub-icon") {
  const slug = app.slug ?? "";
  const emoji = app.icon_emoji ?? "";
  const name = SLUG_ICON[slug] ?? EMOJI_ICON[emoji] ?? "app";
  return iconHtml(name, className);
}

/** data-icon 属性を持つ要素にアイコンを挿入 */
export function hydrateIconElements(root = document) {
  root.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.dataset.icon;
    if (!name) return;
    const extra = el.dataset.iconClass ?? "";
    const className = extra ? `hub-icon ${extra}` : "hub-icon";
    el.innerHTML = iconHtml(name, className);
  });
}
