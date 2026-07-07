/**
 * 管理パネル — Google カレンダー連携（ステータス表示・接続テスト）
 */

let gcalStatus = null;

/** 連携ステータスを読み込む */
export async function loadGoogleCalendarSettings(api) {
  gcalStatus = await api("/api/admin/google-calendar");
  renderGoogleCalendarCard();
}

/** ステータスバッジ HTML */
function statusBadge(ok, labelOk, labelNg) {
  return `<span class="cf-gcal-badge${ok ? " is-ok" : " is-ng"}">${ok ? labelOk : labelNg}</span>`;
}

/** Google カレンダー連携カードを描画 */
function renderGoogleCalendarCard() {
  const card = document.getElementById("gcal-settings-card");
  if (!card || !gcalStatus) return;

  const statusEl = document.getElementById("gcal-status-badges");
  if (!statusEl) return;

  statusEl.innerHTML = [
    statusBadge(gcalStatus.has_refresh_token, "トークン OK", "トークン未設定"),
    statusBadge(gcalStatus.has_oauth_client, "カレンダー OAuth OK", "カレンダー OAuth 未設定"),
    statusBadge(
      Boolean(gcalStatus.all_groups_calendar_id),
      "カレンダー ID 設定済",
      "カレンダー ID 未設定"
    ),
    statusBadge(gcalStatus.ready, "連携準備完了", "連携未完了"),
  ].join("");
}

/** テスト結果を表示 */
function showGcalTestResult(result, isError = false) {
  const el = document.getElementById("gcal-test-result");
  if (!el) return;

  el.hidden = false;
  el.classList.toggle("is-error", isError);
  el.classList.toggle("is-success", !isError);

  let html = `<strong>${isError ? "失敗" : "成功"}:</strong> ${result.message ?? result}`;
  if (result.details && typeof result.details === "object") {
    const rows = Object.entries(result.details)
      .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`)
      .join("");
    html += `<dl class="cf-gcal-test-details">${rows}</dl>`;
  }
  el.innerHTML = html;
}

/** 検証テストを実行 */
async function runGcalTest(api, test) {
  const resultEl = document.getElementById("gcal-test-result");
  const buttons = document.querySelectorAll("[data-gcal-test]");
  buttons.forEach((btn) => {
    btn.disabled = true;
  });

  if (resultEl) {
    resultEl.hidden = false;
    resultEl.className = "cf-gcal-test-result is-loading";
    resultEl.textContent = "テスト実行中…";
  }

  try {
    const result = await api("/api/admin/google-calendar/test", {
      method: "POST",
      body: JSON.stringify({
        test,
        calendar_id: gcalStatus?.all_groups_calendar_id || undefined,
      }),
    });
    showGcalTestResult(result);
  } catch (err) {
    showGcalTestResult({ message: err.message }, true);
  } finally {
    buttons.forEach((btn) => {
      btn.disabled = false;
    });
  }
}

/** Google カレンダー連携イベントを登録 */
export function bindGoogleCalendarEvents({ api }) {
  document.querySelectorAll("[data-gcal-test]").forEach((btn) => {
    btn.addEventListener("click", () => {
      runGcalTest(api, btn.dataset.gcalTest);
    });
  });
}
