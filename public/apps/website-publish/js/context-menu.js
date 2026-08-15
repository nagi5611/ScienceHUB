/**
 * ウェブサイト公開 — コンテキストメニュー
 */

/** コンテキストメニューを表示 */
export function showContextMenu(options) {
  const {
    menu,
    titleEl,
    itemsEl,
    clientX,
    clientY,
    title,
    actions,
    escapeHtml,
    onAction,
  } = options;

  titleEl.textContent = title;
  itemsEl.innerHTML = actions
    .map((action) => {
      if (action.id === "sep") {
        return '<div class="wsp-context-menu-sep" role="separator"></div>';
      }
      const danger = action.danger ? " is-danger" : "";
      return `<button type="button" class="wsp-context-menu-item${danger}" data-action="${action.id}" role="menuitem">${escapeHtml(action.label)}</button>`;
    })
    .join("");

  menu.hidden = false;
  menu.style.visibility = "hidden";
  menu.style.left = "0px";
  menu.style.top = "0px";

  const rect = menu.getBoundingClientRect();
  const padding = 8;
  let left = clientX;
  let top = clientY;
  if (left + rect.width > window.innerWidth - padding) {
    left = window.innerWidth - rect.width - padding;
  }
  if (top + rect.height > window.innerHeight - padding) {
    top = window.innerHeight - rect.height - padding;
  }
  menu.style.left = `${Math.max(padding, left)}px`;
  menu.style.top = `${Math.max(padding, top)}px`;
  menu.style.visibility = "";

  itemsEl.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      onAction(btn.dataset.action);
      hideContextMenu(menu);
    });
  });
}

/** コンテキストメニューを非表示 */
export function hideContextMenu(menu) {
  if (menu) menu.hidden = true;
}
