/**
 * ScienceHUB — Service Worker 登録
 */

let refreshing = false;
/** @type {boolean} */
let pendingControllerReload = false;

/** アプリが true / () => true を返す間は controllerchange によるリロードを延期する */
function shouldDeferPwaReload() {
  const guard = window.__scienceHubDeferPwaReload;
  if (typeof guard === "function") {
    return guard();
  }
  return Boolean(guard);
}

/** 延期されていた SW 更新リロードを、ガード解除後に実行する */
function flushPendingPwaReload() {
  if (!pendingControllerReload || refreshing) {
    return;
  }
  if (shouldDeferPwaReload()) {
    return;
  }
  pendingControllerReload = false;
  refreshing = true;
  window.location.reload();
}

/** Service Worker の controller 切替時にページを更新する（必要なら延期） */
function handleControllerChange() {
  if (refreshing) {
    return;
  }
  if (shouldDeferPwaReload()) {
    pendingControllerReload = true;
    return;
  }
  refreshing = true;
  window.location.reload();
}

window.__scienceHubFlushPwaReload = flushPendingPwaReload;

/** Service Worker を登録する */
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((error) => {
        console.warn("Service Worker の登録に失敗しました:", error);
      });
  });

  navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
}

registerServiceWorker();

if (window.location.pathname.startsWith("/apps/")) {
  import("./app-tutorial-hero.js");
}
