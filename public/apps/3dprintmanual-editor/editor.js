// public/apps/3dprintmanual-editor/editor.js
// 公開ガイドと同じ画面で、文字クリック編集と R2 への画像・動画アップロードを行う
(() => {
  'use strict';

  const SIMPLE_MAX = 20 * 1024 * 1024;
  const MAX_BYTES = 512 * 1024 * 1024;

  const chromeState = {};
  let staticBound = false;
  let hinted = false;
  let saveTimer = 0;
  let hideTimer = 0;
  let saving = false;
  let dirty = false;
  let pill = null;

  /** 保存データがあればそれを使い、公開ページと同じ描画を始める */
  async function boot() {
    pill = document.createElement('div');
    pill.className = 'admin-pill';
    pill.title = '文字をクリックで編集。画像をクリックで画像管理。動画は枠にマウスを乗せて差し替え。';
    pill.textContent = '読み込み中…';
    document.body.appendChild(pill);

    Object.assign(chromeState, captureChrome());

    try {
      const res = await fetch('/api/3dprintmanual/content');
      const body = await readJson(res);
      if (!res.ok) throw new Error(body.error || '本文を読み込めませんでした');
      if (body.content) adoptContent(body.content);
    } catch (error) {
      setPill(error instanceof Error ? error.message : '本文を読み込めませんでした', true);
    }

    applyChrome();
    window.GUIDE_AFTER_RENDER = onRendered;
    try {
      await loadScript('/apps/3dprintmanual/js/main.js?v=20261003c');
    } catch {
      setPill('画面の読み込みに失敗しました', true);
      document.body.classList.remove('admin-booting');
    }
  }

  /** 描画のたびに、再生成される文言へ編集を付け直す */
  function onRendered() {
    document.querySelectorAll('textarea.ae-field').forEach((field) => field.blur());
    applyDynamicChrome();
    bindDynamic();
    if (!staticBound) {
      bindStatic();
      staticBound = true;
    }
    document.body.classList.add('admin-edit');
    if (!hinted && !pill.classList.contains('err')) {
      setPill('文字をクリックで編集、画像をクリックで画像管理');
      hinted = true;
    }
    document.body.classList.remove('admin-booting');
  }

  /** ヘッダーと仕様表など、描画で消えない文言を編集対象にする */
  function bindStatic() {
    document.querySelectorAll('[data-chrome]').forEach((el) => {
      const key = el.getAttribute('data-chrome');
      bindText(el, () => chromeState[key] || '', (value) => {
        chromeState[key] = value;
        document.querySelectorAll(`[data-chrome="${key}"]`).forEach((other) => {
          if (other !== el) other.textContent = value;
        });
      }, 'text');
    });
    bindText(document.getElementById('spec-maker'), () => machineField('maker'), (value) => {
      const row = currentMachine();
      if (row) row.maker = value;
    }, 'text');
    bindText(document.getElementById('spec-name'), () => machineField('name'), (value) => {
      const row = currentMachine();
      if (!row) return;
      row.name = value;
      const button = document.querySelector(`#machine-seg [data-machine="${machine()}"]`);
      if (button) button.textContent = value;
    }, 'text');
    bindText(document.getElementById('spec-slicer'), () => machineField('slicer'), (value) => {
      const row = currentMachine();
      if (row) row.slicer = value;
    }, 'text');
    const icon = document.querySelector('.site-title img');
    if (icon) {
      icon.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        replaceFile('image', (url) => {
          chromeState.icon = url;
          icon.src = url;
          scheduleSave();
        });
      });
    }
  }

  /** セクション本文・画像・動画を編集対象にする */
  function bindDynamic() {
    const m = machine();
    [...document.querySelectorAll('#sections > section.sec')].forEach((sec, index) => {
      const data = GUIDE_SECTIONS[index];
      if (!data) return;
      bindText(sec.querySelector('.sec-no'), () => data.no || '', (value) => {
        data.no = value;
        const shown = String(+value) === String(Number(value)) ? String(+value) : value;
        document.querySelectorAll(`a[data-sec="${data.id}"] span`).forEach((span) => {
          span.textContent = shown;
        });
      }, 'text');
      bindText(sec.querySelector('h2'), () => data.title || '', (value) => {
        data.title = value;
        syncTocTitle(data.id, value);
      }, 'text');
      bindText(sec.querySelector('.lead'), () => data.lead || '', (value) => {
        data.lead = value;
      }, 'txt');
      bindSectionTime(sec, data);
      if (data.patterns) bindPatterns(sec, data.patterns, m);
      else if (data.steps) {
        const list = sec.querySelector('.L-alt');
        bindStepList(list, data.steps, m);
        bindStepListAdd(list, data.steps);
      }
      if (data.trouble) bindTrouble(sec, data.trouble, m);
      sec.querySelectorAll('[data-check]').forEach((button) => {
        const i = +button.dataset.check;
        bindText(button.querySelector('.ct'), () => GUIDE_CHECKLIST[i] || '', (value) => {
          GUIDE_CHECKLIST[i] = value;
        }, 'text');
      });
    });
    document.querySelectorAll('.vid-h > b').forEach((el) => {
      bindText(el, () => chromeState.videoLabel || '参考動画', (value) => {
        chromeState.videoLabel = value;
        document.querySelectorAll('.vid-h > b').forEach((other) => {
          if (other !== el) other.textContent = value;
        });
      }, 'text');
    });
    const qa = document.querySelector('.qa-cta');
    if (qa) {
      bindText(qa.querySelector('b'), () => chromeState.qaTitle || '', (value) => {
        chromeState.qaTitle = value;
      }, 'text');
      bindText(qa.querySelector('span'), () => chromeState.qaBody || '', (value) => {
        chromeState.qaBody = value;
      }, 'text');
      bindText(qa.querySelector('a'), () => chromeState.qaButton || '', (value) => {
        chromeState.qaButton = value;
      }, 'text');
    }
    const checkTitle = document.querySelector('.check-h b');
    if (checkTitle) {
      bindText(checkTitle, () => chromeState.checkTitle || '', (value) => {
        chromeState.checkTitle = value;
      }, 'text');
    }
  }

  /** パターン分岐の質問・手順・動画を編集対象にする */
  function bindPatterns(sec, patterns, m) {
    bindText(sec.querySelector('.pat-q'), () => patterns.question || '', (value) => {
      patterns.question = value;
    }, 'text');
    [...sec.querySelectorAll('.pat-o')].forEach((button, index) => {
      const option = patterns.options[index];
      if (!option) return;
      bindText(button.querySelector('b'), () => option.label || '', (value) => {
        option.label = value;
      }, 'text');
      bindText(button.querySelector('small'), () => option.sub || '', (value) => {
        option.sub = value;
      }, 'text');
    });
    sec.querySelectorAll('.pat-pane').forEach((pane) => {
      const option = patterns.options.find((item) => item.key === pane.dataset.pane);
      if (!option) return;
      if (option.video) {
        bindText(pane.querySelector('.vid-h span'), () => option.video.title || '', (value) => {
          option.video.title = value;
        }, 'text');
        bindVideo(pane.querySelector('.vid'), option);
      }
      const list = pane.querySelector('.L-alt');
      bindStepList(list, option.steps, m);
      bindStepListAdd(list, option.steps);
    });
  }

  /** セクションの目安時間を編集する（未設定でも追加できる） */
  function bindSectionTime(sec, data) {
    const secH = sec.querySelector('.sec-h');
    if (!secH) return;
    let badge = sec.querySelector('.sec-h .badge.badge-muted');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'badge badge-muted';
      secH.appendChild(badge);
      if (data.time == null) data.time = '';
    }
    if (badge.dataset.ae === '1') return;
    bindText(badge, () => timeBadgeLabel(data.time), (value) => {
      data.time = parseTimeBadge(value);
    }, 'text');
  }

  /** 目安バッジの表示文言 */
  function timeBadgeLabel(time) {
    const t = typeof time === 'string' ? time.trim() : '';
    return t ? `目安 ${t}` : '目安（未設定・クリックで入力）';
  }

  /** 目安バッジの入力を time フィールドへ戻す */
  function parseTimeBadge(value) {
    return String(value || '')
      .replace(/^目安\s*/, '')
      .replace(/（未設定・クリックで入力）/g, '')
      .trim();
  }

  /** 新規ステップの初期データ */
  function blankStep() {
    return {
      title: '新しいステップ',
      text: '【要記入】ここに説明を書きます。',
      img: '写真の説明',
    };
  }

  /** 手順リストの末尾にステップ追加ボタン */
  function bindStepListAdd(container, steps) {
    if (!container || !steps) return;
    let bar = container.nextElementSibling;
    if (!bar || !bar.classList.contains('admin-step-add')) {
      bar = document.createElement('div');
      bar.className = 'admin-step-add';
      bar.innerHTML = '<button type="button">＋ ステップを追加</button>';
      container.after(bar);
    }
    const button = bar.querySelector('button');
    button.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      steps.push(blankStep());
      rerender();
      scheduleSave();
    };
  }

  /** 各ステップの削除・下に追加 */
  function bindStepToolbar(node, steps, index) {
    if (!node || node.dataset.adminStBar === '1') return;
    node.dataset.adminStBar = '1';
    const bar = document.createElement('div');
    bar.className = 'admin-st-bar';
    bar.innerHTML = `
      <button type="button" data-admin-step-add-below>この下にステップを追加</button>
      <button type="button" data-admin-step-del>このステップを削除</button>
    `;
    node.appendChild(bar);
    bar.querySelector('[data-admin-step-add-below]').addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      steps.splice(index + 1, 0, blankStep());
      rerender();
      scheduleSave();
    });
    bar.querySelector('[data-admin-step-del]').addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (steps.length <= 1) {
        setPill('最低1つのステップが必要です', true);
        return;
      }
      if (!window.confirm('このステップを削除しますか？')) return;
      steps.splice(index, 1);
      rerender();
      scheduleSave();
    });
  }

  /** 手順の見出し・本文・画像を編集対象にする */
  function bindStepList(container, steps, m) {
    if (!container || !steps) return;
    [...container.querySelectorAll(':scope > .st')].forEach((node, index) => {
      const step = steps[index];
      if (!step) return;
      bindStepToolbar(node, steps, index);
      bindText(node.querySelector('h3'), () => step.title || '', (value) => {
        step.title = value;
      }, 'text');
      bindText(node.querySelector('p'), () => textOf(step.text, m), (value) => {
        writeField(step, 'text', m, value);
      }, 'txt');
      const note = node.querySelector('.note div');
      if (note && step.note) {
        bindText(note, () => step.note.text || '', (value) => {
          step.note.text = value;
        }, 'txt');
      }
      bindPicture(node, step, m);
    });
  }

  /** トラブルの質問と回答、画像を編集対象にする */
  function bindTrouble(sec, items, m) {
    sec.querySelectorAll('[data-tr]').forEach((el) => {
      const item = items[+el.dataset.tr];
      if (!item) return;
      bindText(el.querySelector('.tr-qt'), () => item.q || '', (value) => {
        item.q = value;
      }, 'text');
      bindText(el.querySelector('.tr-a p'), () => item.a || '', (value) => {
        item.a = value;
      }, 'txt');
      bindPicture(el, item, m);
    });
  }

  /** クリックした文字を、その位置で編集する */
  function bindText(el, read, write, mode) {
    if (!el || el.dataset.ae === '1') return;
    el.dataset.ae = '1';
    el.addEventListener('click', (event) => {
      if (el.isContentEditable || el.dataset.editing === '1') return;
      event.preventDefault();
      event.stopPropagation();
      const before = read() ?? '';
      const commit = (value) => {
        if (value === before) {
          paint(el, before, mode);
          return;
        }
        write(value);
        paint(el, read() ?? '', mode);
        scheduleSave();
      };
      if (el.closest('button, a')) startOverlay(el, before, commit);
      else startEditable(el, before, commit, mode);
    });
  }

  /** ボタン外の文字を contenteditable で編集する */
  function startEditable(el, before, commit, mode) {
    el.dataset.prev = mode === 'txt' ? el.innerHTML : el.textContent;
    el.textContent = before;
    el.contentEditable = 'true';
    el.focus();
    let closed = false;
    const finish = (save) => {
      if (closed) return;
      closed = true;
      el.removeEventListener('blur', onBlur);
      el.removeEventListener('keydown', onKeydown);
      el.removeEventListener('paste', onPaste);
      el.contentEditable = 'false';
      if (!save || el.dataset.cancel === '1') {
        delete el.dataset.cancel;
        if (mode === 'txt') el.innerHTML = el.dataset.prev;
        else el.textContent = el.dataset.prev;
        return;
      }
      commit((el.textContent || '').replace(/\u00a0/g, ' ').trim());
    };
    const onBlur = () => finish(true);
    const onKeydown = (event) => {
      if (event.key === 'Enter' && !event.isComposing) {
        event.preventDefault();
        el.blur();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        el.dataset.cancel = '1';
        el.blur();
      }
    };
    const onPaste = (event) => {
      event.preventDefault();
      const text = event.clipboardData ? event.clipboardData.getData('text/plain') : '';
      document.execCommand('insertText', false, text);
    };
    el.addEventListener('blur', onBlur);
    el.addEventListener('keydown', onKeydown);
    el.addEventListener('paste', onPaste);
  }

  /** ボタンやリンクの中は、重なった入力欄で編集する */
  function startOverlay(el, before, commit) {
    el.dataset.editing = '1';
    const previous = el.style.visibility;
    el.style.visibility = 'hidden';
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const field = document.createElement('textarea');
    field.className = 'ae-field';
    field.value = before;
    field.setAttribute('aria-label', 'テキストを編集');
    field.style.position = 'fixed';
    field.style.top = `${rect.top}px`;
    field.style.left = `${rect.left}px`;
    field.style.width = `${Math.max(rect.width, 48)}px`;
    field.style.font = style.font;
    field.style.fontWeight = style.fontWeight;
    field.style.lineHeight = style.lineHeight;
    field.style.letterSpacing = style.letterSpacing;
    field.style.color = style.color;
    field.style.textAlign = style.textAlign;
    field.style.margin = '0';
    field.style.padding = '0';
    field.style.border = '2px solid #f38020';
    field.style.borderRadius = '4px';
    field.style.background = '#fff';
    field.style.zIndex = '50';
    field.style.resize = 'none';
    field.style.overflow = 'hidden';
    field.style.boxSizing = 'border-box';
    document.body.appendChild(field);
    const fit = () => {
      field.style.height = 'auto';
      field.style.height = `${Math.max(rect.height, field.scrollHeight)}px`;
    };
    fit();
    field.focus();
    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      window.removeEventListener('scroll', onScroll, true);
      const value = field.value.replace(/\u00a0/g, ' ').trim();
      field.remove();
      el.style.visibility = previous;
      delete el.dataset.editing;
      if (save) commit(value);
    };
    const onScroll = () => finish(true);
    window.addEventListener('scroll', onScroll, true);
    field.addEventListener('input', fit);
    field.addEventListener('blur', () => finish(true));
    field.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.isComposing) {
        event.preventDefault();
        field.blur();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        finish(false);
      }
    });
  }

  /** 手順とトラブルの画像をクリックで管理パネルを開く */
  function bindPicture(container, owner, m) {
    const frame = container.querySelector('.ph');
    if (!frame || frame.dataset.aeMedia === '1') return;
    frame.dataset.aeMedia = '1';
    const label = frame.querySelector('.ph-l');
    if (label) {
      bindText(label, () => `画像：${textOf(owner.img, m)}`, (value) => {
        writeField(owner, 'img', m, value.replace(/^画像：/, ''));
      }, 'text');
    }
    frame.addEventListener('click', (event) => {
      if (event.target.closest('button, .car-ft, [data-ae], .admin-st-bar')) return;
      if (frame._swiped) return;
      event.preventDefault();
      event.stopPropagation();
      const slide = event.target.closest('.car-slide');
      const slides = [...frame.querySelectorAll('.car-slide')];
      const index = slide ? Math.max(0, slides.indexOf(slide)) : 0;
      openImagePanel(owner, m, index);
    });
  }

  let imagePanelEl = null;
  let imagePanelState = null;

  /** 画像の追加・差し替え・削除・複数枚追加パネル */
  function openImagePanel(owner, m, initialIndex) {
    closeImagePanel();
    const info = readList(owner, m);
    let index = Math.min(Math.max(0, initialIndex), Math.max(0, info.list.length - 1));
    if (!info.list.length) index = 0;

    const panel = document.createElement('div');
    panel.className = 'admin-img-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.innerHTML = `
      <div class="admin-img-panel-in">
        <div class="admin-img-panel-h">
          <b>画像の管理</b>
          <button type="button" data-close aria-label="閉じる">×</button>
        </div>
        <div class="admin-img-thumbs" data-thumbs></div>
        <div class="admin-img-actions" data-actions></div>
        <div class="admin-img-meta" data-meta></div>
      </div>
    `;
    document.body.appendChild(panel);
    imagePanelEl = panel;

    const thumbs = panel.querySelector('[data-thumbs]');
    const actions = panel.querySelector('[data-actions]');
    const meta = panel.querySelector('[data-meta]');

    const refresh = () => {
      const cur = readList(owner, m);
      if (index >= cur.list.length) index = Math.max(0, cur.list.length - 1);
      imagePanelState = { owner, m, index };
      renderImageThumbs(thumbs, cur.list, index, (i) => {
        index = i;
        refresh();
      });
      renderImageActions(actions, owner, m, cur, index, refresh, closeImagePanel);
      renderImageMeta(meta, owner, m);
    };

    panel.addEventListener('click', (event) => {
      if (event.target === panel) closeImagePanel();
    });
    panel.querySelector('[data-close]').addEventListener('click', () => closeImagePanel());
    const onKey = (event) => {
      if (event.key === 'Escape') closeImagePanel();
    };
    document.addEventListener('keydown', onKey);
    panel._onKey = onKey;

    refresh();
  }

  /** 画像パネルを閉じる */
  function closeImagePanel() {
    if (!imagePanelEl) return;
    if (imagePanelEl._onKey) document.removeEventListener('keydown', imagePanelEl._onKey);
    imagePanelEl.remove();
    imagePanelEl = null;
    imagePanelState = null;
  }

  /** サムネイル一覧 */
  function renderImageThumbs(container, list, selected, onSelect) {
    container.innerHTML = '';
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'ph-mini';
      empty.textContent = '画像はまだありません';
      container.appendChild(empty);
      return;
    }
    list.forEach((url, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.classList.toggle('on', i === selected);
      btn.title = `画像 ${i + 1}`;
      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      btn.appendChild(img);
      btn.addEventListener('click', () => onSelect(i));
      container.appendChild(btn);
    });
  }

  /** 画像操作ボタン */
  function renderImageActions(container, owner, m, info, index, refresh, close) {
    container.innerHTML = '';
    const hasList = info.list.length > 0;

    const addOne = document.createElement('button');
    addOne.type = 'button';
    addOne.className = 'primary';
    addOne.textContent = hasList ? '画像を追加（1枚）' : '画像を追加';
    addOne.addEventListener('click', () => {
      replaceFile('image', (url) => {
        const next = readList(owner, m);
        const list = next.list.slice();
        list.push(url);
        writeListMulti(owner, m, list);
        index = list.length - 1;
        rerender({ keepImagePanel: true });
        scheduleSave();
        refresh();
      });
    });

    const addMany = document.createElement('button');
    addMany.type = 'button';
    addMany.textContent = '複数枚をまとめて追加';
    addMany.addEventListener('click', async () => {
      const files = await chooseFiles('image', true);
      if (!files.length) return;
      try {
        setPill('アップロード中…');
        const urls = [];
        for (const file of files) urls.push(await uploadFile(file));
        const next = readList(owner, m);
        const list = next.list.concat(urls);
        writeListMulti(owner, m, list);
        index = list.length - urls.length;
        rerender({ keepImagePanel: true });
        scheduleSave();
        refresh();
      } catch (error) {
        setPill(error instanceof Error ? error.message : 'アップロードに失敗しました', true);
      }
    });

    const replace = document.createElement('button');
    replace.type = 'button';
    replace.textContent = hasList ? '選択中の画像を差し替え' : '画像を設定';
    replace.addEventListener('click', () => {
      replaceFile('image', (url) => {
        const next = readList(owner, m);
        const list = next.list.slice();
        if (!list.length) list.push(url);
        else list[index] = url;
        writeListMulti(owner, m, list);
        rerender({ keepImagePanel: true });
        scheduleSave();
        refresh();
      });
    });

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'danger';
    del.textContent = '選択中の画像を削除';
    del.disabled = !hasList;
    del.addEventListener('click', () => {
      if (!hasList) return;
      if (!window.confirm('この画像を削除しますか？')) return;
      const next = readList(owner, m);
      const list = next.list.slice();
      list.splice(index, 1);
      writeListMulti(owner, m, list);
      index = Math.min(index, Math.max(0, list.length - 1));
      rerender({ keepImagePanel: true });
      scheduleSave();
      refresh();
    });

    const done = document.createElement('button');
    done.type = 'button';
    done.textContent = '閉じる';
    done.addEventListener('click', () => close());

    container.append(addOne, addMany, replace, del, done);
  }

  /** 縦長・説明文の補助 */
  function renderImageMeta(container, owner, m) {
    const tall = !!owner.tall;
    container.innerHTML = `
      <p>画像枠をクリックするとこのパネルが開きます。カルーセルは複数枚追加で作れます。</p>
      <label><input type="checkbox" data-tall ${tall ? 'checked' : ''}> 縦長写真として表示</label>
    `;
    const input = container.querySelector('[data-tall]');
    input.addEventListener('change', () => {
      owner.tall = input.checked;
      rerender({ keepImagePanel: true });
      scheduleSave();
    });
  }

  /** 枚数に応じて src / srcs を整理して保存する */
  function writeListMulti(owner, m, list) {
    const cleaned = list.filter((url) => typeof url === 'string' && url);
    if (!cleaned.length) {
      writeField(owner, 'src', m, '');
      if (owner.srcs != null) {
        if (isMachineMap(owner.srcs)) owner.srcs = { ...owner.srcs, [m]: [] };
        else owner.srcs = [];
      }
      return;
    }
    if (cleaned.length === 1) {
      writeField(owner, 'src', m, cleaned[0]);
      if (owner.srcs != null) {
        if (isMachineMap(owner.srcs)) owner.srcs = { ...owner.srcs, [m]: [] };
        else delete owner.srcs;
      }
      return;
    }
    if (isMachineMap(owner.srcs)) owner.srcs = { ...owner.srcs, [m]: cleaned };
    else owner.srcs = cleaned;
    writeField(owner, 'src', m, cleaned[0]);
  }

  /** 参考動画の差し替えボタンを付ける */
  function bindVideo(vid, option) {
    const frame = vid && vid.querySelector('.vid-frame');
    if (!frame || frame.dataset.aeMedia === '1') return;
    frame.dataset.aeMedia = '1';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'admin-upload';
    button.tabIndex = -1;
    button.textContent = '動画を差し替え';
    frame.appendChild(button);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      replaceFile('video', (url) => {
        option.video = { ...(option.video || {}), src: url };
        delete option.video.url;
        rerender();
        scheduleSave();
      });
    });
  }

  /** ファイルを選ばせて R2 に送り、URL を渡す */
  function replaceFile(kind, apply) {
    chooseFile(kind).then(async (file) => {
      if (!file) return;
      try {
        const url = await uploadFile(file);
        apply(url);
      } catch (error) {
        setPill(error instanceof Error ? error.message : 'アップロードに失敗しました', true);
      }
    });
  }

  /** ファイル選択ダイアログを開く */
  function chooseFile(kind) {
    return chooseFiles(kind, false).then((files) => files[0] || null);
  }

  /** ファイル選択（複数可） */
  function chooseFiles(kind, multiple) {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = !!multiple;
      input.accept = kind === 'video'
        ? 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov'
        : 'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif';
      input.addEventListener('change', () => {
        const files = input.files ? [...input.files] : [];
        resolve(files);
      });
      input.addEventListener('cancel', () => resolve([]));
      input.click();
    });
  }

  /** 20MB以下は一括、それを超える動画は分割で R2 に送る */
  async function uploadFile(file) {
    if (!/\.(jpe?g|png|webp|gif|mp4|webm|mov)$/i.test(file.name)) {
      throw new Error('対応形式は JPEG / PNG / WebP / GIF / MP4 / WebM / MOV です');
    }
    if (file.size <= 0 || file.size > MAX_BYTES) throw new Error('ファイルは 512MB 以下にしてください');
    if (file.size <= SIMPLE_MAX) {
      setPill('アップロード中…');
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/3dprintmanual/upload', { method: 'POST', body: form });
      const body = await readJson(res);
      if (!res.ok) throw new Error(body.error || 'アップロードに失敗しました');
      return body.url;
    }

    setPill('アップロードを開始しています…');
    const initRes = await fetch('/api/3dprintmanual/upload/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, size: file.size }),
    });
    const init = await readJson(initRes);
    if (!initRes.ok) throw new Error(init.error || 'アップロードを開始できませんでした');

    const parts = [];
    const partSize = init.partSize;
    for (let number = 1, offset = 0; offset < file.size; number += 1, offset += partSize) {
      const chunk = file.slice(offset, offset + partSize);
      const res = await fetch('/api/3dprintmanual/upload/part', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-R2-Key': init.key,
          'X-Upload-Id': init.uploadId,
          'X-Part-Number': String(number),
        },
        body: chunk,
      });
      const body = await readJson(res);
      if (!res.ok) throw new Error(body.error || '分割アップロードに失敗しました');
      parts.push(body.part);
      setPill(`アップロード中… ${Math.min(100, Math.round(((offset + chunk.size) / file.size) * 100))}%`);
    }

    const doneRes = await fetch('/api/3dprintmanual/upload/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: init.key, uploadId: init.uploadId, parts }),
    });
    const done = await readJson(doneRes);
    if (!doneRes.ok) throw new Error(done.error || 'アップロードを完了できませんでした');
    return done.url;
  }

  /** 編集内容を R2 の本文へ書く */
  function scheduleSave() {
    dirty = true;
    setPill('編集を保存します…');
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(flushSave, 600);
  }

  /** 連続編集をまとめて保存する */
  async function flushSave() {
    if (!dirty) return;
    if (saving) {
      saveTimer = window.setTimeout(flushSave, 400);
      return;
    }
    dirty = false;
    saving = true;
    setPill('保存しています…');
    try {
      const res = await fetch('/api/3dprintmanual/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: 1,
          machines: GUIDE_MACHINES,
          sections: GUIDE_SECTIONS,
          checklist: GUIDE_CHECKLIST,
          chrome: chromeState,
        }),
      });
      const body = await readJson(res);
      if (!res.ok) throw new Error(body.error || '保存に失敗しました');
      setPill(dirty ? '編集を保存します…' : '保存しました');
    } catch (error) {
      dirty = true;
      setPill(error instanceof Error ? error.message : '保存に失敗しました', true);
    } finally {
      saving = false;
      if (dirty) scheduleSave();
    }
  }

  /** 画像を入れたあとに、今のスクロール位置で描き直す */
  function rerender(options = {}) {
    if (!options.keepImagePanel) closeImagePanel();
    const y = window.scrollY;
    if (typeof window.GUIDE_RENDER === 'function') window.GUIDE_RENDER();
    window.scrollTo(0, y);
  }

  /** 保存済み本文を、いまのガイドデータへ移す */
  function adoptContent(content) {
    if (!content || content.version !== 1) return;
    if (content.machines && typeof content.machines === 'object') {
      for (const key of Object.keys(GUIDE_MACHINES)) delete GUIDE_MACHINES[key];
      Object.assign(GUIDE_MACHINES, content.machines);
    }
    if (Array.isArray(content.sections)) {
      GUIDE_SECTIONS.splice(0, GUIDE_SECTIONS.length, ...content.sections);
    }
    if (Array.isArray(content.checklist)) {
      GUIDE_CHECKLIST.splice(0, GUIDE_CHECKLIST.length, ...content.checklist);
    }
    if (content.chrome && typeof content.chrome === 'object') {
      for (const [key, value] of Object.entries(content.chrome)) {
        if (typeof value === 'string') chromeState[key] = value;
      }
    }
  }

  /** 初期表示の固定文言を控える */
  function captureChrome() {
    const chrome = {
      qaTitle: 'ここにない困りごとは？',
      qaBody: '質問・Q&A で過去の質問を検索したり、部員・先生に質問したりできます。',
      qaButton: '質問・Q&A を見る →',
      checkTitle: '印刷前チェックリスト',
      videoLabel: '参考動画',
    };
    document.querySelectorAll('[data-chrome]').forEach((el) => {
      chrome[el.getAttribute('data-chrome')] = el.textContent;
    });
    return chrome;
  }

  /** 固定文言を保存値で上書きする */
  function applyChrome() {
    document.querySelectorAll('[data-chrome]').forEach((el) => {
      const key = el.getAttribute('data-chrome');
      if (typeof chromeState[key] === 'string') el.textContent = chromeState[key];
    });
    if (chromeState.icon) {
      const icon = document.querySelector('.site-title img');
      if (icon) icon.src = chromeState.icon;
    }
  }

  /** 描画のたびに作り直される文言を保存値に戻す */
  function applyDynamicChrome() {
    document.querySelectorAll('.vid-h > b').forEach((el) => {
      el.textContent = chromeState.videoLabel || '参考動画';
    });
    const qa = document.querySelector('.qa-cta');
    if (qa) {
      const title = qa.querySelector('b');
      const body = qa.querySelector('span');
      const link = qa.querySelector('a');
      if (title) title.textContent = chromeState.qaTitle || '';
      if (body) body.textContent = chromeState.qaBody || '';
      if (link) link.textContent = chromeState.qaButton || '';
    }
    const checkTitle = document.querySelector('.check-h b');
    if (checkTitle) checkTitle.textContent = chromeState.checkTitle || '';
  }

  /** もくじの節タイトルを合わせる */
  function syncTocTitle(id, title) {
    document.querySelectorAll(`a[data-sec="${id}"]`).forEach((link) => {
      const span = link.querySelector('span');
      [...link.childNodes].forEach((node) => {
        if (node !== span) node.remove();
      });
      if (span) link.append(document.createTextNode(title));
    });
  }

  /** 表示中の機種キーを返す */
  function machine() {
    const button = document.querySelector('#machine-seg button.on');
    return button && button.dataset.machine ? button.dataset.machine : 'ke';
  }

  /** 表示中の機種データを返す */
  function currentMachine() {
    return GUIDE_MACHINES[machine()] || null;
  }

  /** 機種データの文字列フィールドを返す */
  function machineField(key) {
    const row = currentMachine();
    const value = row && row[key];
    return typeof value === 'string' ? value : '';
  }

  /** 機種別オブジェクトならその機種の値、そうでなければそのまま返す */
  function readField(value, m) {
    if (isMachineMap(value)) return value[m];
    return value;
  }

  /** 文字列フィールドを、共有文か機種別かに合わせて書く */
  function writeField(owner, key, m, value) {
    const current = owner[key];
    if (isMachineMap(current)) owner[key] = { ...current, [m]: value };
    else owner[key] = value;
  }

  /** 表示用の文字列を取り出す */
  function textOf(value, m) {
    const picked = readField(value, m);
    return typeof picked === 'string' ? picked : '';
  }

  /** 機種マップ（ke / cc）か判定する */
  function isMachineMap(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value) && ('ke' in value || 'cc' in value);
  }

  /** ステップの画像一覧を返す */
  function readList(owner, m) {
    const srcs = readField(owner.srcs, m);
    if (Array.isArray(srcs) && srcs.length) return { kind: 'srcs', list: srcs };
    const src = readField(owner.src, m);
    if (typeof src === 'string' && src) return { kind: 'src', list: [src] };
    if (owner.srcs) return { kind: 'srcs', list: [] };
    return { kind: 'src', list: [] };
  }

  /** 画像一覧をステップへ戻す */
  function writeList(owner, m, kind, list) {
    if (kind === 'srcs') {
      if (isMachineMap(owner.srcs)) owner.srcs = { ...owner.srcs, [m]: list };
      else owner.srcs = list;
      return;
    }
    writeField(owner, 'src', m, list[0] || '');
  }

  /** 公開ページと同じリンク化で文言を描く */
  function paint(el, value, mode) {
    if (mode === 'txt') el.innerHTML = txt(value);
    else el.textContent = value;
  }

  /** HTML をエスケープする */
  function esc(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
  }

  /** 【要記入】と URL を公開ページと同じ見た目にする */
  function txt(value) {
    return esc(value || '')
      .replace(/(【要(?:記入|確認)[^】]*】)/g, '<span class="todo">$1</span>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  /** 状態表示を出す */
  function setPill(message, isError) {
    if (!pill) return;
    pill.hidden = false;
    pill.textContent = message;
    pill.classList.toggle('err', !!isError);
    window.clearTimeout(hideTimer);
    if (!isError) hideTimer = window.setTimeout(() => { pill.hidden = true; }, 2800);
  }

  /** JSON レスポンスを読む。壊れていれば空オブジェクト */
  async function readJson(res) {
    try {
      return await res.json();
    } catch {
      return {};
    }
  }

  /** スクリプトを読み込む */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('script'));
      document.body.appendChild(script);
    });
  }

  boot();
})();
