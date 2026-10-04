// 利用ガイド Q&A 管理
(() => {
  'use strict';
  const API = '/api/3dprintmanual/qa';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const state = { filter: 'all', items: [], selectedId: null, detail: null };

  async function api(path, options = {}) {
    const res = await fetch(`${API}${path}`, { credentials: 'same-origin', ...options });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.message || '通信に失敗しました');
    return data;
  }

  function toast(msg) {
    const el = $('#page-toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
  }

  async function loadList() {
    const p = new URLSearchParams({ admin: '1', limit: '200' });
    if (state.filter === 'open') p.set('status', 'open');
    if (state.filter === 'unresolved') p.set('resolved', '0');
    const data = await api(`/questions?${p}`);
    state.items = data.items || [];
    renderList();
    if (state.selectedId && !state.items.find(i => i.id === state.selectedId)) {
      state.selectedId = null;
      state.detail = null;
      renderDetail();
    }
  }

  function renderList() {
    const el = $('#admin-list');
    if (!state.items.length) {
      el.innerHTML = '<p style="padding:16px;color:var(--color-text-muted)">質問はありません</p>';
      return;
    }
    el.innerHTML = state.items.map(item => `
      <button type="button" class="${state.selectedId === item.id ? 'on' : ''}" data-pick="${esc(item.id)}">
        <div><b>${esc(item.title)}</b></div>
        <div class="meta">${item.status === 'answered' ? '回答済' : '未回答'} · ${item.resolved ? '解決済' : '未解決'} · ${esc(item.date)}</div>
      </button>`).join('');
  }

  async function loadDetail(id) {
    const data = await api(`/questions/${encodeURIComponent(id)}`);
    state.detail = data.item;
    state.selectedId = id;
    renderList();
    renderDetail();
  }

  function extOf(name) {
    const base = String(name || '').split(/[/\\]/).pop() || '';
    const dot = base.lastIndexOf('.');
    return dot < 0 ? '' : base.slice(dot).toLowerCase();
  }

  function inferMediaKind(contentType, filename) {
    const ct = (contentType || '').toLowerCase();
    if (ct.startsWith('image/')) return 'image';
    if (ct.startsWith('video/')) return 'video';
    const ext = extOf(filename);
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return 'image';
    if (['.mp4', '.webm', '.mov'].includes(ext)) return 'video';
    return 'file';
  }

  function attachHtml(attachments) {
    if (!attachments?.length) return '';
    return `<div class="qa-admin-attach">${attachments.map(a => {
      const kind = inferMediaKind(a.contentType, a.filename);
      const name = esc(a.filename || 'file');
      if (kind === 'image') {
        return `<figure class="qa-admin-attach-item"><img src="${esc(a.url)}" alt="${name}"><figcaption>${name}</figcaption></figure>`;
      }
      if (kind === 'video') {
        const src = esc(a.url) + (String(a.url).includes('#') ? '' : '#t=0.1');
        return `<figure class="qa-admin-attach-item qa-admin-attach-item--video"><video src="${src}" controls playsinline preload="metadata"></video><figcaption>${name}</figcaption></figure>`;
      }
      return `<a class="qa-admin-attach-file" href="${esc(a.url)}" target="_blank" rel="noopener">${name}</a>`;
    }).join('')}</div>`;
  }

  function renderDetail() {
    const el = $('#admin-detail');
    const d = state.detail;
    if (!d) {
      el.innerHTML = '<p class="qa-admin-placeholder">左の一覧から質問を選んでください。</p>';
      return;
    }
    const posts = (d.answers || []).map(a => `
      <div class="qa-admin-post ${a.kind === 'staff' ? 'staff' : ''}">
        <b>${esc(a.by)}</b> (${esc(a.role)}) · ${esc(a.date)}<br>${esc(a.text)}
      </div>`).join('');

    el.innerHTML = `
      <h2>${esc(d.title)}</h2>
      <p class="qa-admin-body">${esc(d.body)}</p>
      ${attachHtml(d.attachments)}
      <div class="qa-admin-posts">${posts || '<p class="qa-admin-placeholder">投稿はまだありません</p>'}</div>
      <div class="qa-admin-actions">
        <button type="button" class="btn btn-secondary" data-toggle-resolved>${d.resolved ? '未解決に戻す' : '解決済みにする'}</button>
        <button type="button" class="btn btn-secondary" data-toggle-pinned>${d.pinned ? 'ピン留めを外す' : 'よくある質問にピン'}</button>
        <button type="button" class="btn btn-danger" data-delete-question>質問を削除</button>
      </div>
      <div class="qa-admin-reply">
        <label><b>担当者として返信</b></label>
        <textarea id="staff-reply-body" placeholder="回答を入力"></textarea>
        <button type="button" class="btn btn-primary" data-staff-reply>返信を送信</button>
      </div>`;
  }

  document.addEventListener('click', async e => {
    const pick = e.target.closest('[data-pick]');
    if (pick) {
      try { await loadDetail(pick.dataset.pick); } catch (err) { toast(err.message); }
      return;
    }
    const fb = e.target.closest('#admin-filters button');
    if (fb) {
      state.filter = fb.dataset.filter;
      $$('#admin-filters button').forEach(b => b.classList.toggle('on', b === fb));
      loadList().catch(err => toast(err.message));
      return;
    }
    if (e.target.closest('[data-toggle-resolved]') && state.detail) {
      const next = !state.detail.resolved;
      try {
        await api(`/questions/${encodeURIComponent(state.detail.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resolved: next }),
        });
        state.detail.resolved = next;
        renderDetail();
        await loadList();
        toast(next ? '解決済みにしました' : '未解決に戻しました');
      } catch (err) { toast(err.message); }
      return;
    }
    if (e.target.closest('[data-toggle-pinned]') && state.detail) {
      const next = !state.detail.pinned;
      try {
        await api(`/questions/${encodeURIComponent(state.detail.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinned: next }),
        });
        state.detail.pinned = next;
        renderDetail();
        await loadList();
        toast(next ? 'ピン留めしました' : 'ピン留めを外しました');
      } catch (err) { toast(err.message); }
      return;
    }
    if (e.target.closest('[data-delete-question]') && state.detail) {
      const title = state.detail.title || 'この質問';
      if (!confirm(`「${title}」を完全に削除します。添付ファイルも消えます。よろしいですか？`)) {
        return;
      }
      const id = state.detail.id;
      try {
        await api(`/questions/${encodeURIComponent(id)}`, { method: 'DELETE' });
        state.detail = null;
        renderDetail();
        await loadList();
        toast('質問を削除しました');
      } catch (err) { toast(err.message); }
      return;
    }
    if (e.target.closest('[data-staff-reply]') && state.detail) {
      const text = $('#staff-reply-body')?.value?.trim() || '';
      if (!text) return;
      try {
        await api(`/questions/${encodeURIComponent(state.detail.id)}/staff-reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: text }),
        });
        $('#staff-reply-body').value = '';
        await loadDetail(state.detail.id);
        await loadList();
        toast('返信を送信しました');
      } catch (err) { toast(err.message); }
    }
  });

  loadList().catch(err => toast(err.message));
})();
