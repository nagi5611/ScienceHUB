/**
 * フレックスリスト用のスライド並び替え
 */

/**
 * @param {HTMLElement} list
 * @param {{ itemSelector?: string, onReorder: (ids: number[]) => void }} options
 */
export function bindSortableList(list, options) {
  const itemSelector = options.itemSelector ?? ".uv-img-item";
  const placeholder = document.createElement("li");
  placeholder.className = "uv-sort-placeholder";
  placeholder.setAttribute("aria-hidden", "true");

  /** @type {{ id: number, el: HTMLElement, float: HTMLElement, pointerId: number } | null} */
  let drag = null;

  function getItems() {
    return [...list.querySelectorAll(itemSelector)].filter(
      (el) => !el.classList.contains("uv-sort-placeholder")
    );
  }

  /** ポインタ位置に最も近い挿入位置を求める */
  function findInsertBefore(x, y) {
    const items = getItems().filter((el) => el !== drag?.el);
    let best = null;
    let bestScore = Infinity;

    for (const item of items) {
      const r = item.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const score = (x - cx) ** 2 + (y - cy) ** 2;
      if (score < bestScore) {
        bestScore = score;
        best = item;
      }
    }

    if (!best) return null;

    const r = best.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const insertAfter =
      y > cy + r.height * 0.15 ||
      (Math.abs(y - cy) <= r.height * 0.15 && x > cx);

    return insertAfter ? best.nextElementSibling : best;
  }

  function placePlaceholder(x, y) {
    const before = findInsertBefore(x, y);
    if (before) {
      if (placeholder.nextElementSibling !== before) {
        list.insertBefore(placeholder, before);
      }
    } else if (placeholder.parentElement !== list || placeholder !== list.lastElementChild) {
      list.appendChild(placeholder);
    }
  }

  function finishDrag() {
    if (!drag) return;

    const ids = [];
    for (const node of list.children) {
      if (node.classList.contains("uv-sort-placeholder")) {
        ids.push(drag.id);
      } else if (node.matches(itemSelector)) {
        ids.push(Number(node.dataset.id));
      }
    }

    list.insertBefore(drag.el, placeholder);
    drag.float.remove();
    drag.el.classList.remove("is-dragging");
    placeholder.remove();
    drag = null;
    options.onReorder(ids);
  }

  list.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(itemSelector);
    if (!el || e.button !== 0) return;
    if (e.target.closest(".uv-img-item-remove")) return;

    const id = Number(el.dataset.id);
    if (!id) return;

    const rect = el.getBoundingClientRect();
    const float = el.cloneNode(true);
    float.classList.add("uv-img-item--float");
    float.classList.remove("is-dragging");
    float.style.width = `${rect.width}px`;
    float.style.left = `${rect.left}px`;
    float.style.top = `${rect.top}px`;
    document.body.appendChild(float);

    el.classList.add("is-dragging");
    list.insertBefore(placeholder, el);
    el.remove();

    drag = {
      id,
      el,
      float,
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };

    list.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  list.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.pointerId) return;

    drag.float.style.left = `${e.clientX - drag.offsetX}px`;
    drag.float.style.top = `${e.clientY - drag.offsetY}px`;
    placePlaceholder(e.clientX, e.clientY);
  });

  list.addEventListener("pointerup", (e) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    list.releasePointerCapture(e.pointerId);
    finishDrag();
  });

  list.addEventListener("pointercancel", (e) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    finishDrag();
  });
}
