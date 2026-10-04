import { initRunaPanel } from "/js/runa-panel.js";

const isQaAdminPage = location.pathname.includes("3dprintmanual-qa-admin");

initRunaPanel({
  placeholder: "3Dプリンター利用ガイドや Q&A について質問…",
  getContext: () => ({
    manualQaPage: true,
    qaSearchQuery: isQaAdminPage
      ? null
      : document.getElementById("qa-q")?.value?.trim() || null,
  }),
  getContextLabel: () => "3Dプリンター利用ガイド Q&A",
});
