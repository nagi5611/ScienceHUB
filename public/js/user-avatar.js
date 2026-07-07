/**
 * ユーザーアバター表示ヘルパー
 */

const AVATAR_COLORS = ["#F38020", "#2C7CB0", "#7C3AED", "#059669", "#E31837"];

/** HTML エスケープ */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 表示名からイニシャルを生成 */
export function avatarInitials(name) {
  const parts = String(name || "?").trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return String(name || "?").slice(0, 2).toUpperCase();
}

/** 名前からアバター背景色を決定 */
export function avatarColor(name) {
  let hash = 0;
  for (const ch of String(name || "")) {
    hash = (hash + ch.charCodeAt(0)) % 1000;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/**
 * アバター URL（API から avatar_url が返る前提）
 * @param {{ avatar_url?: string | null }} user
 * @returns {string | null}
 */
export function getUserAvatarUrl(user) {
  const url = user?.avatar_url;
  return url && typeof url === "string" ? url : null;
}

/**
 * アバター HTML（画像 + フォールバックイニシャル）
 * @param {{ id?: string, display_name?: string, username?: string, avatar_url?: string | null }} user
 * @param {{ className?: string, imgClass?: string }} [options]
 */
export function avatarHtml(user, options = {}) {
  const className = options.className ?? "user-avatar";
  const imgClass = options.imgClass ?? `${className}-img`;
  const name = user?.display_name || user?.username || "?";
  const color = avatarColor(name);
  const init = escapeHtml(avatarInitials(name));
  const url = getUserAvatarUrl(user);

  if (url) {
    return `<div class="${className} ${className}--photo" style="--avatar-fallback:${color}" data-user-id="${escapeHtml(user?.id ?? "")}">
      <img class="${imgClass}" src="${escapeHtml(url)}" alt="" loading="lazy">
      <span class="${className}-fallback" hidden>${init}</span>
    </div>`;
  }

  return `<div class="${className}" style="background:${color}">${init}</div>`;
}

/**
 * DOM 要素にアバターを適用（ダッシュボード用）
 * @param {HTMLElement} container
 * @param {{ display_name?: string, username?: string, avatar_url?: string | null }} user
 * @param {{ imgClass?: string, initialsClass?: string }} [options]
 */
export function applyAvatarToElement(container, user, options = {}) {
  if (!container) return;

  const imgClass = options.imgClass ?? "";
  const initialsClass = options.initialsClass ?? "";
  const name = user?.display_name || user?.username || "?";
  const url = getUserAvatarUrl(user);
  const init = avatarInitials(name);
  const color = avatarColor(name);

  container.innerHTML = "";
  container.hidden = false;

  if (url) {
    container.classList.remove(initialsClass);
    const img = document.createElement("img");
    img.src = url;
    img.alt = "";
    if (imgClass) img.className = imgClass;
    img.addEventListener("error", () => {
      container.textContent = init;
      container.classList.add(initialsClass);
      container.style.background = color;
    });
    img.addEventListener("load", () => {
      container.classList.remove(initialsClass);
      container.style.background = "";
    });
    container.appendChild(img);
    return;
  }

  container.textContent = init;
  container.classList.add(initialsClass);
  container.style.background = color;
}

/** img 読み込み失敗時にイニシャルへ切り替え（一覧用・イベント委譲） */
export function bindAvatarFallback(root) {
  root?.addEventListener(
    "error",
    (event) => {
      const img = event.target;
      if (!(img instanceof HTMLImageElement)) return;
      if (!img.classList.contains("user-avatar-img") && !img.classList.contains("cf-avatar-img")) {
        return;
      }

      const wrap = img.closest(".user-avatar--photo, .cf-avatar--photo");
      if (!wrap) return;

      img.remove();
      wrap.classList.remove("user-avatar--photo", "cf-avatar--photo");
      const fallback = wrap.querySelector(".user-avatar-fallback, .cf-avatar-fallback");
      if (fallback) {
        fallback.hidden = false;
        wrap.style.background = wrap.style.getPropertyValue("--avatar-fallback") || avatarColor(fallback.textContent);
        return;
      }
      wrap.textContent = avatarInitials(wrap.dataset.displayName ?? "?");
    },
    true
  );
}
