// 質問・Q&A ページ — API 接続
(() => {
  'use strict';
  const API = '/api/3dprintmanual/qa';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = d => d.replace(/^\d{4}-0?(\d+)-0?(\d+)$/, '$1/$2');
  const STAFF_ROLES = ['担当者'];
  const EXT_KIND = {
    '.jpg': 'image', '.jpeg': 'image', '.png': 'image', '.webp': 'image', '.gif': 'image',
    '.mp4': 'video', '.webm': 'video', '.mov': 'video',
  };

  const state = {
    cat: 'all',
    status: 'all',
    machine: 'all',
    q: '',
    open: new Set(),
    items: [],
    details: new Map(),
    searchIds: null,
    userId: null,
    loading: false,
    formMachine: 'both',
    pendingFiles: [],
    pendingKeys: [],
    formSubmitting: false,
  };

  function extOf(name) {
    const base = String(name || '').split(/[/\\]/).pop() || '';
    const dot = base.lastIndexOf('.');
    return dot < 0 ? '' : base.slice(dot).toLowerCase();
  }

  /** contentType と拡張子から image / video / file を判定 */
  function inferMediaKind(contentType, filename) {
    const ct = (contentType || '').toLowerCase();
    if (ct.startsWith('image/')) return 'image';
    if (ct.startsWith('video/')) return 'video';
    const ext = extOf(filename);
    if (EXT_KIND[ext] === 'image') return 'image';
    if (EXT_KIND[ext] === 'video') return 'video';
    return 'file';
  }

  /** 添付1件の HTML（詳細・フォーム共通） */
  function renderAttachmentItem(opts) {
    const { url, filename, contentType, removeIndex } = opts;
    const kind = inferMediaKind(contentType, filename);
    const name = filename || 'file';
    const rm = removeIndex != null
      ? `<button type="button" data-rm-file="${removeIndex}" aria-label="削除">×</button>`
      : '';
    const cap = `<span class="qa-attach-cap">${esc(name)}</span>`;
    if (kind === 'image' && url) {
      return `<div class="qa-attach-preview">${rm}<img src="${esc(url)}" alt="${esc(name)}" loading="lazy">${cap}</div>`;
    }
    if (kind === 'video' && url) {
      const src = esc(url) + (url.includes('#') ? '' : '#t=0.1');
      return `<div class="qa-attach-preview qa-attach-preview--video">${rm}<video src="${src}" controls playsinline preload="metadata"></video>${cap}</div>`;
    }
    if (url) {
      return `<div class="qa-attach-preview qa-attach-preview--file">${rm}<a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)}</a></div>`;
    }
    return `<div class="qa-attach-preview qa-attach-preview--file">${rm}<span class="qa-attach-cap">${esc(name)}</span></div>`;
  }

  async function api(path, options = {}) {
    const res = await fetch(`${API}${path}`, { credentials: 'same-origin', ...options });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.error || data.userMessage || data.message || '通信に失敗しました';
      throw new Error(msg);
    }
    return data;
  }

  async function loadMe() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        state.userId = data.user?.id || data.id || null;
      }
    } catch { /* ignore */ }
  }

  async function loadQaAdminLink() {
    const link = $('#qa-admin-link');
    if (!link) return;
    try {
      const res = await fetch('/api/apps/3dprintmanual-qa-admin/access', { credentials: 'same-origin' });
      if (res.ok) link.hidden = false;
    } catch { /* ignore */ }
  }

  function queryParams() {
    const p = new URLSearchParams();
    if (state.cat !== 'all') p.set('cat', state.cat);
    if (state.machine !== 'all') p.set('machine', state.machine);
    if (state.status !== 'all') p.set('status', state.status);
    return p.toString();
  }

  async function refreshList() {
    state.loading = true;
    try {
      if (state.q.trim()) {
        const data = await api('/questions/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: state.q.trim() }),
        });
        state.items = data.items || [];
        state.searchIds = data.ids || null;
      } else {
        const qs = queryParams();
        const data = await api(`/questions${qs ? `?${qs}` : ''}`);
        state.items = data.items || [];
        state.searchIds = null;
      }
    } catch (e) {
      showToast(esc(e.message));
      state.items = [];
    } finally {
      state.loading = false;
      renderList();
      renderCats();
    }
  }

  async function loadDetail(id) {
    if (state.details.has(id)) return state.details.get(id);
    const data = await api(`/questions/${encodeURIComponent(id)}`);
    state.details.set(id, data.item);
    return data.item;
  }

  function attachHtml(attachments) {
    if (!attachments?.length) return '';
    return `<div class="qa-attach">${attachments.map(a => renderAttachmentItem({
      url: a.url,
      filename: a.filename,
      contentType: a.contentType,
    })).join('')}</div>`;
  }

  function catLinks() {
    const count = id => state.items.filter(x => id === 'all' || x.cat === id).length;
    const rows = [{ id: 'all', no: '', title: 'すべての質問' }, ...QA_CATS];
    return rows.map(c =>
      `<a href="#" data-cat="${c.id}" class="${state.cat === c.id ? 'on' : ''}">` +
      `<span class="num${c.id === 'all' ? ' all' : ''}">${c.id === 'all' ? '全' : +c.no}</span>${esc(c.title)}` +
      `<b class="cat-n num">${count(c.id)}</b></a>`).join('');
  }

  function renderCats() {
    $('#cat-links').innerHTML = catLinks();
    $('#toc-sheet-list').innerHTML = catLinks();
  }

  function itemHtml(x) {
    const detail = state.details.get(x.id);
    const cat = QA_CATS.find(c => c.id === x.cat);
    const open = state.open.has(x.id);
    const answers = detail?.answers || [];
    const attachments = detail?.attachments || [];
    const canReply = detail && state.userId && detail.userId === state.userId;

    const ans = answers.length
      ? `<div class="qa-ans">${answers.map(a => {
          const staff = STAFF_ROLES.includes(a.role);
          return `<div class="qa-r${staff ? ' staff' : ''}">
            <div class="qa-av">${esc(staff ? '担' : '質')}</div>
            <div><div class="qa-r-h"><b>${esc(a.by)}</b><span>${esc(a.role)}</span><span class="num">${fmt(a.date)}</span></div><p>${esc(a.text)}</p></div>
          </div>`;
        }).join('')}</div>`
      : `<div class="qa-empty-a">まだ回答はありません。担当者が確認しています。</div>`;

    return `<article class="card qa-i${open ? ' open' : ''}" data-id="${esc(x.id)}" id="q-${esc(x.id)}">
      <button type="button" class="qa-q" aria-expanded="${open}">
        <span class="qa-st ${x.status}">${x.status === 'answered' ? '回答済み' : '未回答'}</span>
        <span class="qa-t">${esc(x.title)}</span>
        <span class="qa-meta">
          ${x.resolved ? '<span class="pin">解決済み</span>' : ''}
          ${x.pinned ? '<span class="pin">よくある質問</span>' : ''}
          <span>${cat ? cat.no + ' ' + esc(cat.title) : ''}</span>
          <span>${esc(QA_MACHINES[x.machine] || x.machine)}</span>
          <span class="num">回答 ${x.answerCount ?? answers.length}</span>
          <span class="num">${fmt(x.date)}</span>
        </span>
        <em>+</em>
      </button>
      <div class="qa-a"${open ? '' : ' hidden'}>
        <p class="qa-body">${esc(detail?.body ?? x.body)}</p>
        ${attachHtml(attachments)}
        ${open ? ans : ''}
        ${open && canReply ? `<div class="qa-reply">
          <textarea rows="1" placeholder="お礼や追加の質問を書く" data-reply-body></textarea>
          <button type="button" class="btn btn-secondary" data-reply="${esc(x.id)}">送信</button>
        </div>` : ''}
        ${cat ? `<a class="qa-guide" href="../index.html#${cat.id}">ガイドの「${esc(cat.title)}」を見る →</a>` : ''}
      </div>
    </article>`;
  }

  function renderList() {
    const list = state.items;
    const cat = QA_CATS.find(c => c.id === state.cat);
    $('#qa-heading').textContent = cat ? `${cat.no} ${cat.title}` : 'すべての質問';
    $('#qa-count').textContent = state.loading ? '読み込み中…' : `${list.length}件`;
    $('#qa-list').innerHTML = list.length ? list.map(itemHtml).join('') :
      `<div class="card qa-none"><b>該当する質問が見つかりませんでした</b>キーワードや絞り込みを変えるか、新しく質問してください。<br><button type="button" class="btn btn-primary" data-ask>質問する</button></div>`;
  }

  const toast = $('#page-toast'); let hideT;
  function showToast(msg, isHtml = true) {
    toast.innerHTML = isHtml ? msg : esc(msg);
    toast.classList.add('show');
    clearTimeout(hideT); hideT = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  const sheet = $('#toc-sheet'), tab = $('#toc-pill'), hdr = $('.site-header');
  const syncH = () => document.documentElement.style.setProperty('--hdr-h', hdr.getBoundingClientRect().height + 'px');
  syncH(); window.addEventListener('resize', syncH);
  const setSheet = on => {
    sheet.classList.toggle('open', on);
    tab.setAttribute('aria-expanded', on);
    document.body.style.overflow = on ? 'hidden' : '';
  };
  tab.addEventListener('click', () => setSheet(!sheet.classList.contains('open')));
  window.matchMedia('(min-width:1001px)').addEventListener('change', e => { if (e.matches) setSheet(false); });

  const modal = $('#qa-modal');
  const formPanel = $('#qa-form');
  const formErr = $('#qa-form-err');
  const formBusy = $('#qa-form-busy');
  const formBusyMsg = $('#qa-form-busy-msg');
  const formProgress = $('#qa-form-progress');
  const formProgressFill = $('#qa-form-busy-fill');
  const fileInput = $('#qa-form-files');
  const drop = $('.qa-drop');

  $('#qa-form-cat').innerHTML = '<option value="">選んでください</option>' + QA_CATS.map(c => `<option value="${c.id}">${c.no} ${esc(c.title)}</option>`).join('');

  function renderFormPreviews() {
    const box = $('#qa-form-previews');
    if (!box) return;
    box.innerHTML = state.pendingFiles.map((f, i) => renderAttachmentItem({
      url: f.previewUrl || '',
      filename: f.name,
      contentType: f.type,
      removeIndex: i,
    })).join('');
    drop?.classList.toggle('has-files', state.pendingFiles.length > 0);
  }

  function addFiles(fileList) {
    for (const file of fileList) {
      if (state.pendingFiles.length >= 5) break;
      const entry = { file, name: file.name, type: file.type };
      const kind = inferMediaKind(file.type, file.name);
      if ((kind === 'image' || kind === 'video') && file.size > 0) {
        entry.previewUrl = URL.createObjectURL(file);
      }
      state.pendingFiles.push(entry);
    }
    renderFormPreviews();
  }

  drop?.addEventListener('dragover', e => { e.preventDefault(); });
  drop?.addEventListener('drop', e => {
    e.preventDefault();
    if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
  });
  drop?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', () => {
    if (fileInput.files) addFiles(fileInput.files);
    fileInput.value = '';
  });

  function setFormBusy(on, opts = {}) {
    const { message = '', progress = null, indeterminate = false } = opts;
    state.formSubmitting = on;
    formPanel?.classList.toggle('is-submitting', on);
    if (formBusy) {
      formBusy.hidden = !on;
      formBusy.setAttribute('aria-busy', on ? 'true' : 'false');
    }
    if (formBusyMsg && message) formBusyMsg.textContent = message;
    if (formProgress) {
      const showBar = on && (progress != null || indeterminate);
      formProgress.hidden = !showBar;
      formProgress.classList.toggle('qa-progress--indeterminate', Boolean(indeterminate));
    }
    if (formProgressFill) {
      if (progress != null) {
        formProgressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      } else if (!on) {
        formProgressFill.style.width = '0%';
      }
    }
  }

  function uploadFileWithProgress(file, onFileProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API}/upload`);
      xhr.withCredentials = true;
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && onFileProgress) {
          onFileProgress(ev.loaded / ev.total);
        }
      };
      xhr.onload = () => {
        let data = {};
        try { data = JSON.parse(xhr.responseText); } catch { /* ignore */ }
        if (xhr.status >= 200 && xhr.status < 300 && data.key) {
          resolve(data.key);
          return;
        }
        reject(new Error(data.error || '添付のアップロードに失敗しました'));
      };
      xhr.onerror = () => reject(new Error('添付のアップロードに失敗しました'));
      const fd = new FormData();
      fd.append('file', file);
      xhr.send(fd);
    });
  }

  async function uploadPending(onTotalProgress) {
    const files = state.pendingFiles;
    if (!files.length) return [];
    const keys = [];
    const sizes = files.map(f => f.file.size || 1);
    const totalBytes = sizes.reduce((a, b) => a + b, 0);
    let doneBytes = 0;
    for (let i = 0; i < files.length; i++) {
      const entry = files[i];
      setFormBusy(true, {
        message: `添付をアップロード中 (${i + 1}/${files.length})`,
        progress: totalBytes ? (doneBytes / totalBytes) * 90 : 0,
      });
      const key = await uploadFileWithProgress(entry.file, (frac) => {
        const loaded = doneBytes + sizes[i] * frac;
        const pct = totalBytes ? (loaded / totalBytes) * 90 : 0;
        if (onTotalProgress) onTotalProgress(pct);
        setFormBusy(true, {
          message: `添付をアップロード中 (${i + 1}/${files.length})`,
          progress: pct,
        });
      });
      keys.push(key);
      doneBytes += sizes[i];
    }
    return keys;
  }

  function resetForm() {
    state.pendingFiles.forEach(f => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl); });
    state.pendingFiles = [];
    state.pendingKeys = [];
    formErr.hidden = true;
    renderFormPreviews();
  }

  const setModal = on => {
    if (!on && state.formSubmitting) return;
    modal.hidden = !on;
    document.body.style.overflow = on ? 'hidden' : '';
    if (!on) {
      setFormBusy(false);
      resetForm();
    }
    if (on) setTimeout(() => $('#qa-form input[type="text"]')?.focus(), 50);
  };

  $('#qa-form').addEventListener('submit', async e => {
    e.preventDefault();
    formErr.hidden = true;
    const form = e.target;
    const title = form.querySelector('input[type="text"]')?.value?.trim() || '';
    const cat = $('#qa-form-cat').value;
    const body = form.querySelector('textarea')?.value?.trim() || '';
    const submitBtn = form.querySelector('[type="submit"]');
    const cancelBtns = $$('[data-ask-close]', formPanel);
    submitBtn.disabled = true;
    cancelBtns.forEach(b => { b.disabled = true; });
    setFormBusy(true, {
      message: state.pendingFiles.length
        ? '添付をアップロードしています…'
        : '内容を確認・送信しています…',
      progress: state.pendingFiles.length ? 0 : null,
      indeterminate: !state.pendingFiles.length,
    });
    try {
      const attachmentKeys = await uploadPending();
      setFormBusy(true, {
        message: '内容を確認・送信しています…',
        progress: 92,
        indeterminate: true,
      });
      const data = await api('/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          categoryId: cat,
          machine: state.formMachine,
          body,
          attachmentKeys,
        }),
      });
      setModal(false);
      form.reset();
      state.formMachine = 'both';
      $$('#qa-form-machine button').forEach((b, i) => b.classList.toggle('on', i === 0));
      showToast('質問を送信しました');
      if (data.id) state.open.add(data.id);
      await refreshList();
      if (data.id) {
        await loadDetail(data.id);
        renderList();
        document.getElementById(`q-${data.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      if (err.message && !err.message.includes('通信')) {
        formErr.textContent = err.message;
        formErr.hidden = false;
      } else {
        showToast(esc(err.message), false);
      }
    } finally {
      setFormBusy(false);
      submitBtn.disabled = false;
      cancelBtns.forEach(b => { b.disabled = false; });
    }
  });

  let searchTimer;
  $('#qa-q').addEventListener('input', e => {
    state.q = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => refreshList(), 400);
  });

  document.addEventListener('click', async e => {
    const rm = e.target.closest('[data-rm-file]');
    if (rm) {
      const i = Number(rm.dataset.rmFile);
      const f = state.pendingFiles[i];
      if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
      state.pendingFiles.splice(i, 1);
      renderFormPreviews();
      return;
    }
    const c = e.target.closest('[data-cat]');
    if (c) { e.preventDefault(); state.cat = c.dataset.cat; refreshList(); setSheet(false); window.scrollTo({ top: $('.layout').offsetTop - 80, behavior: 'smooth' }); return; }
    if (e.target.closest('[data-toc-close]')) { setSheet(false); return; }
    if (e.target.closest('[data-ask]')) { setModal(true); return; }
    if (e.target.closest('[data-ask-close]')) { if (!state.formSubmitting) setModal(false); return; }
    const sb = e.target.closest('#qa-status button');
    if (sb) { state.status = sb.dataset.status; $$('#qa-status button').forEach(b => b.classList.toggle('on', b === sb)); refreshList(); return; }
    const mb = e.target.closest('#qa-machine button');
    if (mb) { state.machine = mb.dataset.machine; $$('#qa-machine button').forEach(b => b.classList.toggle('on', b === mb)); refreshList(); return; }
    const fm = e.target.closest('#qa-form-machine button');
    if (fm) {
      const map = ['both', 'ke', 'cc'];
      const idx = [...$$('#qa-form-machine button')].indexOf(fm);
      state.formMachine = map[idx] || 'both';
      $$('#qa-form-machine button').forEach(b => b.classList.toggle('on', b === fm));
      return;
    }
    const replyBtn = e.target.closest('[data-reply]');
    if (replyBtn) {
      const id = replyBtn.dataset.reply;
      const ta = replyBtn.closest('.qa-reply')?.querySelector('[data-reply-body]');
      const text = ta?.value?.trim() || '';
      if (!text) return;
      replyBtn.disabled = true;
      try {
        await api(`/questions/${encodeURIComponent(id)}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: text }),
        });
        ta.value = '';
        showToast('追記を送信しました');
        state.details.delete(id);
        await loadDetail(id);
        await refreshList();
      } catch (err) {
        showToast(esc(err.message), false);
      } finally {
        replyBtn.disabled = false;
      }
      return;
    }
    const q = e.target.closest('.qa-q');
    if (q) {
      const id = q.closest('.qa-i').dataset.id;
      if (state.open.has(id)) state.open.delete(id);
      else {
        state.open.add(id);
        try {
          await loadDetail(id);
        } catch (err) {
          showToast(esc(err.message), false);
          state.open.delete(id);
        }
      }
      renderList();
    }
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !state.formSubmitting) { setModal(false); setSheet(false); }
  });

  (async () => {
    await loadMe();
    await loadQaAdminLink();
    await refreshList();
    const hash = location.hash.replace(/^#q-/, '');
    if (hash) {
      state.open.add(hash);
      try {
        await loadDetail(hash);
        renderList();
        document.getElementById(`q-${hash}`)?.scrollIntoView();
      } catch { /* ignore */ }
    }
  })();
})();
