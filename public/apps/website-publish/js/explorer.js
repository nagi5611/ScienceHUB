/**
 * ウェブサイト公開 — エクスプローラー UI
 */

/** エクスプローラーを初期化 */
export function createExplorer(options) {
  const {
    elements,
    onUploadFiles,
    onDeletePaths,
    onContextMenu,
    formatBytes,
    escapeHtml,
  } = options;

  /** @type {Array<{ path: string; size: number; updated: number | null }>} */
  let allFiles = [];
  let currentDir = "";
  /** @type {Set<string>} */
  let selected = new Set();

  function joinDir(base, segment) {
    if (!base) return segment;
    if (!segment) return base;
    return `${base}/${segment}`;
  }

  function buildListing() {
    const folders = new Set();
    const files = [];
    const prefix = currentDir ? `${currentDir}/` : "";

    for (const file of allFiles) {
      if (currentDir && !file.path.startsWith(prefix)) continue;
      const rest = currentDir ? file.path.slice(prefix.length) : file.path;
      if (!rest) continue;
      const slash = rest.indexOf("/");
      if (slash >= 0) {
        folders.add(rest.slice(0, slash));
      } else {
        files.push({ ...file, name: rest });
      }
    }

    return {
      folders: [...folders].sort((a, b) => a.localeCompare(b)),
      files: files.sort((a, b) => a.name.localeCompare(b.name)),
    };
  }

  function renderBreadcrumb() {
    const el = elements.breadcrumb;
    if (!el) return;

    const crumbs = [{ label: "ルート", dir: "" }];
    if (currentDir) {
      const parts = currentDir.split("/");
      let acc = "";
      for (const part of parts) {
        acc = joinDir(acc, part);
        crumbs.push({ label: part, dir: acc });
      }
    }

    el.innerHTML = crumbs
      .map((c, idx) => {
        const isLast = idx === crumbs.length - 1;
        return `<button type="button" class="wsp-crumb${isLast ? " is-current" : ""}" data-dir="${escapeHtml(c.dir)}">${escapeHtml(c.label)}</button>`;
      })
      .join('<span class="wsp-crumb-sep">/</span>');

    el.querySelectorAll(".wsp-crumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentDir = btn.dataset.dir ?? "";
        selected.clear();
        render();
      });
    });
  }

  function renderTable() {
    const { folders, files } = buildListing();
    const tbody = elements.fileList;
    const empty = elements.fileEmpty;
    const table = elements.fileTable;

    if (!tbody) return;

    tbody.replaceChildren();
    const total = folders.length + files.length;
    if (empty) empty.hidden = total > 0;
    if (table) table.hidden = total === 0;

    for (const name of folders) {
      const fullPath = joinDir(currentDir, name);
      const tr = document.createElement("tr");
      tr.className = "wsp-explorer-row wsp-explorer-row--folder";
      tr.dataset.path = fullPath;
      tr.dataset.type = "folder";
      tr.innerHTML = `
        <td><input type="checkbox" class="wsp-row-check" aria-label="${escapeHtml(name)} を選択"></td>
        <td class="wsp-explorer-name"><span class="wsp-icon" aria-hidden="true">📁</span>${escapeHtml(name)}</td>
        <td>—</td>
        <td>—</td>
      `;
      bindRow(tr, fullPath, "folder");
      tbody.appendChild(tr);
    }

    for (const file of files) {
      const tr = document.createElement("tr");
      tr.className = "wsp-explorer-row";
      tr.dataset.path = file.path;
      tr.dataset.type = "file";
      const updated = file.updated
        ? new Date(file.updated).toLocaleString("ja-JP")
        : "—";
      tr.innerHTML = `
        <td><input type="checkbox" class="wsp-row-check" aria-label="${escapeHtml(file.name)} を選択"></td>
        <td class="wsp-explorer-name"><span class="wsp-icon" aria-hidden="true">📄</span>${escapeHtml(file.name)}</td>
        <td>${formatBytes(file.size)}</td>
        <td>${escapeHtml(updated)}</td>
      `;
      bindRow(tr, file.path, "file");
      tbody.appendChild(tr);
    }

    updateDeleteButton();
  }

  function bindRow(tr, path, type) {
    const checkbox = tr.querySelector(".wsp-row-check");
    if (selected.has(path)) {
      tr.classList.add("is-selected");
      if (checkbox instanceof HTMLInputElement) checkbox.checked = true;
    }

    checkbox?.addEventListener("change", (e) => {
      const checked = e.target instanceof HTMLInputElement && e.target.checked;
      if (checked) selected.add(path);
      else selected.delete(path);
      tr.classList.toggle("is-selected", checked);
      updateDeleteButton();
    });

    tr.addEventListener("dblclick", () => {
      if (type === "folder") {
        currentDir = path;
        selected.clear();
        render();
      }
    });

    tr.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (!onContextMenu) return;
      const name = type === "folder" ? path.split("/").pop() ?? path : path.split("/").pop() ?? path;
      if (selected.size > 1 && selected.has(path)) {
        onContextMenu(e.clientX, e.clientY, {
          kind: "multi",
          count: selected.size,
          paths: [...selected],
        });
      } else {
        selected.clear();
        selected.add(path);
        tr.classList.add("is-selected");
        if (checkbox instanceof HTMLInputElement) checkbox.checked = true;
        updateDeleteButton();
        onContextMenu(e.clientX, e.clientY, {
          kind: type,
          path,
          name,
        });
      }
    });
  }

  function updateDeleteButton() {
    if (elements.deleteBtn) {
      elements.deleteBtn.disabled = selected.size === 0;
      elements.deleteBtn.textContent =
        selected.size > 0 ? `削除 (${selected.size})` : "削除";
    }
  }

  function render() {
    renderBreadcrumb();
    renderTable();
    if (elements.currentDirLabel) {
      elements.currentDirLabel.textContent = currentDir
        ? `/${currentDir}`
        : "/";
    }
  }

  function setFiles(files) {
    allFiles = files;
    render();
  }

  function resetDir() {
    currentDir = "";
    selected.clear();
    render();
  }

  async function handleUpload(fileList, baseDir = currentDir) {
    const files = [...fileList];
    if (files.length === 0) return;
    await onUploadFiles(files, baseDir);
  }

  if (elements.dropZone) {
    elements.dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      elements.dropZone.classList.add("is-dragover");
    });
    elements.dropZone.addEventListener("dragleave", () => {
      elements.dropZone.classList.remove("is-dragover");
    });
    elements.dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      elements.dropZone.classList.remove("is-dragover");
      const dt = e.dataTransfer;
      if (!dt?.files?.length) return;
      handleUpload(dt.files).catch(() => undefined);
    });
  }

  if (elements.uploadBtn) {
    elements.uploadBtn.addEventListener("click", () => {
      elements.fileInput?.click();
    });
  }

  if (elements.folderInput) {
    elements.folderBtn?.addEventListener("click", () => {
      elements.folderInput.click();
    });
    elements.folderInput.addEventListener("change", () => {
      const files = elements.folderInput.files;
      if (!files?.length) return;
      handleUpload(files, currentDir).finally(() => {
        elements.folderInput.value = "";
      });
    });
  }

  if (elements.fileInput) {
    elements.fileInput.addEventListener("change", () => {
      const files = elements.fileInput.files;
      if (!files?.length) return;
      handleUpload(files, currentDir).finally(() => {
        elements.fileInput.value = "";
      });
    });
  }

  if (elements.deleteBtn) {
    elements.deleteBtn.addEventListener("click", async () => {
      if (selected.size === 0) return;
      const paths = [...selected];
      const filePaths = paths.filter((p) =>
        allFiles.some((f) => f.path === p)
      );
      const folderPrefixes = paths.filter((p) => !filePaths.includes(p));

      const toDelete = [...filePaths];
      for (const folder of folderPrefixes) {
        const prefix = `${folder}/`;
        for (const f of allFiles) {
          if (f.path.startsWith(prefix) || f.path === folder) {
            toDelete.push(f.path);
          }
        }
      }

      if (toDelete.length === 0) return;

      await onDeletePaths(toDelete);
      selected.clear();
      render();
    });
  }

  return {
    setFiles,
    resetDir,
    navigateToDir(dir) {
      currentDir = dir;
      selected.clear();
      render();
    },
    getCurrentDir: () => currentDir,
    render,
  };
}
