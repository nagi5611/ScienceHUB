/**
 * サードパーティ — 公開アプリ Viewer
 */

function getSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("slug")?.trim();
  if (fromQuery) return fromQuery;
  return "";
}

async function init() {
  const slug = getSlugFromQuery();
  const loading = document.getElementById("viewer-loading");
  const denied = document.getElementById("viewer-denied");

  if (!slug) {
    loading.hidden = true;
    denied.hidden = false;
    denied.querySelector("p").textContent = "アプリの指定がありません。";
    return;
  }

  try {
    const metaRes = await fetch(
      `/api/third-party/published/${encodeURIComponent(slug)}/meta`,
      { credentials: "same-origin" }
    );

    if (metaRes.status === 401) {
      window.location.href =
        "/login/?next=" + encodeURIComponent(window.location.href);
      return;
    }

    if (!metaRes.ok) {
      loading.hidden = true;
      denied.hidden = false;
      return;
    }

    const { meta } = await metaRes.json();
    document.getElementById("viewer-title").textContent = meta.title;
    document.getElementById("viewer-owner").textContent = meta.owner_display_name;

    const forkBtn = document.getElementById("viewer-fork-btn");
    if (forkBtn) {
      forkBtn.hidden = false;
      forkBtn.addEventListener("click", async () => {
        forkBtn.disabled = true;
        try {
          const res = await fetch(
            `/api/third-party/published/${encodeURIComponent(slug)}/fork`,
            {
              method: "POST",
              credentials: "same-origin",
              headers: { "Content-Type": "application/json" },
              body: "{}",
            }
          );
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.error || "フォークに失敗しました");
          window.location.href = `/apps/third-party/?project=${encodeURIComponent(data.project.id)}`;
        } catch (err) {
          alert(err instanceof Error ? err.message : "フォークに失敗しました");
          forkBtn.disabled = false;
        }
      });
    }

    document.getElementById("viewer-header").hidden = false;
    document.getElementById("viewer-wrap").hidden = false;
    document.getElementById("viewer-iframe").src =
      `/api/third-party/published/${encodeURIComponent(slug)}?t=${Date.now()}`;
    document.title = `${meta.title} — ScienceHUB`;
    loading.hidden = true;
  } catch {
    loading.hidden = true;
    denied.hidden = false;
  }
}

init();
