/**
 * ScienceHUB — Service Worker（シェルキャッシュ + 静的アセット）
 */

const CACHE_VERSION = "v1";
const STATIC_CACHE = `sciencehub-static-${CACHE_VERSION}`;
const SHELL_CACHE = `sciencehub-shell-${CACHE_VERSION}`;

const PRECACHE_SHELL = [
  "/login/",
  "/login/index.html",
  "/css/login.css",
  "/js/login.js",
  "/js/oauth-icons.js",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/favicon-32.png",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png",
];

const OFFLINE_FALLBACK = "/login/";

/** 同一オリジンのリクエストか判定する */
function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

/** API リクエストか判定する */
function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

/** 静的アセットか判定する */
function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/css/") ||
    url.pathname.startsWith("/js/") ||
    url.pathname.startsWith("/icons/")
  );
}

/** キャッシュから取得し、バックグラウンドで更新する */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const response = await networkFetch;
  if (response) {
    return response;
  }

  throw new Error("Network unavailable");
}

/** ナビゲーションを network-first で処理し、失敗時はログインシェルへフォールバックする */
async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cache = await caches.open(SHELL_CACHE);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    const fallback = await cache.match(OFFLINE_FALLBACK);
    if (fallback) {
      return fallback;
    }

    return cache.match("/login/index.html");
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== SHELL_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (!isSameOrigin(url)) {
    return;
  }

  if (isApiRequest(url)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  }
});
