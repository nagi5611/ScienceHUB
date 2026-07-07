/**
 * ScienceHUB 連携 — 予約アプリ用認証・プロフィール
 */

let hubUser = null;

/** アプリアクセスを確認する */
export async function checkAppAccess() {
  const response = await fetch("/api/apps/3dprint-reservation/access", {
    credentials: "include",
  });
  if (response.status === 401) {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login/?next=${next}`;
    return false;
  }
  if (response.status === 403) {
    document.body.innerHTML =
      '<main style="padding:2rem;font-family:Inter,sans-serif"><h1>アクセス拒否</h1><p>このアプリを利用する権限がありません。</p><p><a href="/">ダッシュボードに戻る</a></p></main>';
    return false;
  }
  return response.ok;
}

/** ScienceHUB プロフィールを取得する */
export async function refreshAuthSession() {
  const res = await fetch("/api/auth/profile", { credentials: "include" });
  if (!res.ok) throw new Error("ログインが必要です");
  const data = await res.json();
  hubUser = data.user;
  return hubUser;
}

/** 現在のユーザー */
export function getAuthUser() {
  return hubUser;
}

/** ログイン済みのため本人確認フォームは不要 */
export function canSkipIdentity() {
  return Boolean(
    hubUser?.homeroom && hubUser?.student_number && hubUser?.student_name
  );
}

/** 予約フォームへプロフィールを反映 */
export function applyUserToReservationForm() {
  if (!hubUser) return;
  const homeroom = document.getElementById("homeroom");
  const num = document.getElementById("student_number");
  const name = document.getElementById("student_name");
  if (homeroom && hubUser.homeroom) homeroom.value = hubUser.homeroom;
  if (num && hubUser.student_number != null) num.value = String(hubUser.student_number);
  if (name && hubUser.student_name) name.value = hubUser.student_name;
}

/** 修正フォームへプロフィールを反映 */
export function applyUserToEditForm() {
  if (!hubUser) return;
  const homeroom = document.getElementById("edit-homeroom");
  const num = document.getElementById("edit-student-number");
  const name = document.getElementById("edit-student-name");
  if (homeroom && hubUser.homeroom) homeroom.value = hubUser.homeroom;
  if (num && hubUser.student_number != null) num.value = String(hubUser.student_number);
  if (name && hubUser.student_name) name.value = hubUser.student_name;
}

/** API 用の依頼者情報（プロフィールから） */
export function identityPayload() {
  return {
    homeroom: hubUser?.homeroom ?? "",
    student_number: hubUser?.student_number ?? 0,
    student_name: hubUser?.student_name ?? "",
  };
}

/** 予約前にプロフィールが揃っているか */
export function ensureCanBook() {
  if (!hubUser?.print_profile_complete) {
    openProfileGateModal();
    return false;
  }
  return true;
}

/** 本人確認セクションの表示切替 */
export function updateIdentitySections() {
  const complete = canSkipIdentity();
  const note = document.getElementById("logged-in-identity-note");
  if (note) {
    note.textContent = complete
      ? `依頼者: ${hubUser.student_name}（${hubUser.homeroom} ${hubUser.student_number}番）`
      : "";
    note.classList.toggle("hidden", !complete);
  }

  for (const id of ["requester-info-section", "edit-identity-section"]) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden", complete);
  }
}

/** ヘッダー表示を更新 */
export function updateAuthHeader() {
  const label = document.getElementById("auth-user-label");
  if (label && hubUser) {
    label.textContent = hubUser.display_name || hubUser.username;
  }
}

/** 予約ページの認証初期化 */
export async function initAuth() {
  document.getElementById("auth-profile-btn")?.addEventListener("click", () => {
    openProfileGateModal();
  });
  document.getElementById("auth-dashboard-btn")?.addEventListener("click", () => {
    window.location.href = "/";
  });

  await refreshAuthSession();
  updateAuthHeader();
  updateIdentitySections();
  applyUserToReservationForm();

  if (!hubUser?.print_profile_complete) {
    openProfileGateModal();
  }
}

/** プロフィール登録モーダルを開く */
export function openProfileGateModal() {
  const modal = document.getElementById("profile-gate-modal");
  if (!modal) return;
  modal.classList.add("open");
  if (hubUser?.homeroom) {
    document.getElementById("profile-homeroom").value = hubUser.homeroom;
  }
  if (hubUser?.student_number != null) {
    document.getElementById("profile-student-number").value = String(hubUser.student_number);
  }
  if (hubUser?.student_name) {
    document.getElementById("profile-student-name").value = hubUser.student_name;
  }
}

/** プロフィール登録モーダルを閉じる */
export function closeProfileGateModal() {
  document.getElementById("profile-gate-modal")?.classList.remove("open");
}

/** プロフィール登録モーダルの送信設定 */
export function setupProfileGateForm(setupHomeroomCombobox) {
  setupHomeroomCombobox("profile-homeroom", "profile-homeroom-list");
  const form = document.getElementById("profile-gate-form");
  const alertEl = document.getElementById("profile-gate-alert");
  const closeBtn = document.getElementById("profile-gate-close");

  closeBtn?.addEventListener("click", () => {
    if (hubUser?.print_profile_complete) closeProfileGateModal();
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (alertEl) alertEl.innerHTML = "";
    const homeroom = document.getElementById("profile-homeroom").value.trim();
    const student_number = Number(document.getElementById("profile-student-number").value);
    const student_name = document.getElementById("profile-student-name").value.trim();

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeroom, student_number, student_name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "保存に失敗しました");
      hubUser = data.user;
      updateAuthHeader();
      updateIdentitySections();
      applyUserToReservationForm();
      closeProfileGateModal();
    } catch (err) {
      if (alertEl) {
        alertEl.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
      }
    }
  });
}
