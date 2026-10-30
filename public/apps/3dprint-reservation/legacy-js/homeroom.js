// src/js/homeroom.js

/** All valid homeroom codes. */
export const HOMEROOMS = (() => {
  const list = [];
  for (let grade = 1; grade <= 3; grade++) {
    for (let num = 1; num <= 9; num++) {
      list.push(`${grade}0${num}`);
    }
  }
  return list;
})();

/** Filters homerooms by typed prefix. */
export function filterHomerooms(query) {
  const q = query.trim();
  if (!q) return [...HOMEROOMS];
  return HOMEROOMS.filter((h) => h.startsWith(q));
}

/** Wires combobox behaviour for homeroom input. */
export function setupHomeroomCombobox(inputId, listId, gradeSelectId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  const gradeSelect = gradeSelectId ? document.getElementById(gradeSelectId) : null;

  const renderList = (items) => {
    if (!items.length) {
      list.classList.add('hidden');
      list.innerHTML = '';
      return;
    }
    list.innerHTML = items
      .map((h) => `<li><button type="button" data-value="${h}">${h}</button></li>`)
      .join('');
    list.classList.remove('hidden');
    list.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selectHomeroom(btn.dataset.value);
      });
    });
  };

  const selectHomeroom = (value) => {
    input.value = value;
    list.classList.add('hidden');
  };

  input.addEventListener('input', () => {
    renderList(filterHomerooms(input.value));
  });

  input.addEventListener('focus', () => {
    renderList(filterHomerooms(input.value));
  });

  input.addEventListener('blur', () => {
    setTimeout(() => list.classList.add('hidden'), 150);
  });

  return {
    getValue: () => input.value.trim(),
    isValid: () => HOMEROOMS.includes(input.value.trim()),
  };
}
