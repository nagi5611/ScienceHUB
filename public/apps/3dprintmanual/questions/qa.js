// 質問・Q&A ページ — API 接続
(() => {
  'use strict';
  const API = '/api/3dprintmanual/qa';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = d => d.replace(/^\d{4}-0?(\d+)-0?(\d+)$/, '$1/$2');
  const STAFF_ROLES = ['担当者'];

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
  };

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
    return `<div class="qa-attach">${attachments.map(a => {
      const ct = a.contentType || '';
      if (ct.startsWith('image/')) {
        return `<div class="qa-attach-preview"><img src="${esc(a.url)}" alt="${esc(a.filename)}" loading="lazy"></div>`;
      }
      if (ct.startsWith('video/')) {
        return `<div class="qa-attach-preview"><video src="${esc(a.url)}" controls preload="metadata"></video></div>`;
      }
      return `<div class="qa-attach-preview"><a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.filename)}</a></div>`;
    }).join('')}</div>`;
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
  const formErr = $('#qa-form-err');
  const fileInput = $('#qa-form-files');
  const drop = $('.qa-drop');

  $('#qa-form-cat').innerHTML = '<option value="">選んでください</option>' + QA_CATS.map(c => `<option value="${c.id}">${c.no} ${esc(c.title)}</option>`).join('');

  function renderFormPreviews() {
    const box = $('#qa-form-previews');
    if (!box) return;
    box.innerHTML = state.pendingFiles.map((f, i) => {
      const url = f.previewUrl || '';
      if (f.type?.startsWith('image/') && url) {
        return `<div class="qa-attach-preview"><img src="${url}" alt=""><button type="button" data-rm-file="${i}" aria-label="削除">×</button></div>`;
      }
      return `<div class="qa-attach-preview"><span>${esc(f.name)}</span><button type="button" data-rm-file="${i}">×</button></div>`;
    }).join('');
    drop?.classList.toggle('has-files', state.pendingFiles.length > 0);
  }

  function addFiles(fileList) {
    for (const file of fileList) {
      if (state.pendingFiles.length >= 5) break;
      const entry = { file, name: file.name, type: file.type };
      if (file.type.startsWith('image/')) {
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

  async function uploadPending() {
    const keys = [];
    for (const entry of state.pendingFiles) {
      const fd = new FormData();
      fd.append('file', entry.file);
      const res = await fetch(`${API}/upload`, { method: 'POST', credentials: 'same-origin', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || '添付のアップロードに失敗しました');
      keys.push(data.key);
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
    modal.hidden = !on;
    document.body.style.overflow = on ? 'hidden' : '';
    if (!on) resetForm();
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
    submitBtn.disabled = true;
    try {
      const attachmentKeys = await uploadPending();
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
      submitBtn.disabled = false;
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
    if (e.target.closest('[data-ask-close]')) { setModal(false); return; }
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

  window.addEventListener('keydown', e => { if (e.key === 'Escape') { setModal(false); setSheet(false); } });

  (async () => {
    await loadMe();
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
