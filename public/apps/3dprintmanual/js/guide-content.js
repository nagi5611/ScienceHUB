// public/apps/3dprintmanual/js/guide-content.js
// R2 に保存されたガイド本文を data.js の GUIDE_* へ反映する
(() => {
  'use strict';

  /** 保存済み本文を、いまのガイドデータへ移す */
  window.adoptGuideContent = function adoptGuideContent(content) {
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
  };

  /** API から本文を取得して反映する（未保存なら data.js のまま） */
  window.fetchGuideContentFromApi = async function fetchGuideContentFromApi() {
    try {
      const res = await fetch('/api/3dprintmanual/content');
      let body = {};
      try {
        body = await res.json();
      } catch {
        body = {};
      }
      if (!res.ok) {
        return { ok: false, error: typeof body.error === 'string' ? body.error : res.status };
      }
      if (body.content) window.adoptGuideContent(body.content);
      return { ok: true, hasContent: !!body.content };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : '本文を読み込めませんでした',
      };
    }
  };
})();
