/**
 * ScienceHUB — サービス稼働状況ページ
 */

/** HTML エスケープ */
function esc(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

/** 稼働状態バッジ */
function badge(ok) {
  if (ok === true) {
    return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-900 border border-green-500"><i class="fas fa-check-circle"></i>正常</span>';
  }
  if (ok === false) {
    return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-900 border border-red-500"><i class="fas fa-times-circle"></i>異常</span>';
  }
  return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300"><i class="fas fa-clock"></i>未チェック</span>';
}

/** API から稼働状況を読み込んで表示する */
async function load() {
  const metaEl = document.getElementById("meta");
  const listEl = document.getElementById("list");
  const errEl = document.getElementById("err");
  if (!metaEl || !listEl || !errEl) return;

  errEl.classList.add("hidden");

  try {
    const response = await fetch("/api/status", { cache: "no-store" });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();

    if (!data.checkedAt) {
      metaEl.innerHTML =
        '最終チェック: <span class="font-medium text-gray-800">まだありません</span>（読み込み時にチェックされます）';
    } else {
      const date = new Date(data.checkedAt);
      const jst = date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
      const utc = date.toUTCString();
      metaEl.innerHTML =
        `最終チェック: <span class="font-medium text-gray-800">${esc(jst)} (JST)</span>` +
        ` <span class="text-gray-400">·</span> <span class="text-gray-500 text-xs">${esc(utc)} UTC</span>`;
    }

    const results = Array.isArray(data.results) ? data.results : [];
    if (results.length === 0) {
      listEl.innerHTML =
        '<div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center text-gray-600">監視結果がまだありません。</div>';
      return;
    }

    listEl.innerHTML = results
      .map((result) => {
        const latency =
          typeof result.latencyMs === "number" ? `${result.latencyMs} ms` : "—";
        const code = result.statusCode != null ? String(result.statusCode) : "—";
        const errorLine = result.error
          ? `<p class="text-xs text-red-700 mt-2">${esc(result.error)}</p>`
          : "";
        const note = result.note
          ? `<span class="text-xs text-gray-400 ml-2">(${esc(result.note)})</span>`
          : "";

        return (
          '<article class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5">' +
            '<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">' +
              '<div class="min-w-0 flex-1">' +
                '<div class="flex flex-wrap items-center gap-2">' +
                  badge(result.ok) +
                  `<h2 class="text-base font-semibold text-gray-900">${esc(result.name || "")}</h2>` +
                  note +
                "</div>" +
                `<p class="text-sm text-orange mt-2 break-all"><a class="hover:underline" href="${esc(result.url || "#")}" target="_blank" rel="noopener noreferrer">${esc(result.url || "")}</a></p>` +
                errorLine +
              "</div>" +
              '<dl class="text-xs sm:text-sm text-gray-600 sm:text-right shrink-0 space-y-1">' +
                '<div><dt class="inline text-gray-500">HTTP </dt>' +
                `<dd class="inline font-mono">${esc(code)}</dd></div>` +
                '<div><dt class="inline text-gray-500">応答時間 </dt>' +
                `<dd class="inline font-mono">${esc(latency)}</dd></div>` +
              "</dl>" +
            "</div>" +
          "</article>"
        );
      })
      .join("");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errEl.textContent = `読み込みに失敗しました: ${message}`;
    errEl.classList.remove("hidden");
    listEl.innerHTML = "";
  }
}

load();
setInterval(load, 60_000);
