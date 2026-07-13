/**
 * ScienceHUB — Service Worker 登録
 */

let refreshing = false;

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

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) {
      return;
    }
    refreshing = true;
    window.location.reload();
  });
}

registerServiceWorker();
