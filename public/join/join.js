/**
 * グループ招待リンク参加ページ
 */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getInviteToken() {
  return new URL(window.location.href).searchParams.get("t")?.trim() ?? "";
}

function setVisible(id, visible) {
  const el = document.getElementById(id);
  if (el) el.hidden = !visible;
}

async function fetchInviteInfo(token) {
  const response = await fetch(
    `/api/group-invite/info?token=${encodeURIComponent(token)}`,
    { method: "GET" }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "招待リンクが見つかりません");
  }
  return data.invite;
}

async function joinGroup(token) {
  const response = await fetch("/api/group-invite/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "グループへの参加に失敗しました");
  }
  return data;
}

function renderInvitePage(invite) {
  setVisible("join-loading", false);
  setVisible("join-error", false);
  setVisible("join-success", false);
  setVisible("join-content", true);

  const dot = document.getElementById("join-group-dot");
  const nameEl = document.getElementById("join-group-name");
  const roleEl = document.getElementById("join-group-role");
  const noteEl = document.getElementById("join-note");
  const submitBtn = document.getElementById("join-submit");

  if (dot) dot.style.background = invite.group_color;
  if (nameEl) nameEl.textContent = invite.group_display_name;
  if (roleEl) {
    roleEl.textContent = `参加時の権限: ${invite.group_role_display_name}`;
    roleEl.style.color = invite.group_role_color;
  }

  if (invite.revoked) {
    if (noteEl) {
      noteEl.hidden = false;
      noteEl.textContent = "この招待リンクは無効化されています。";
      noteEl.classList.add("is-error");
    }
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  if (invite.already_member) {
    if (noteEl) {
      noteEl.hidden = false;
      noteEl.textContent = invite.current_role_display_name
        ? `現在「${invite.current_role_display_name}」として所属しています。参加すると「${invite.group_role_display_name}」に更新されます。`
        : "既にこのグループに所属しています。";
      noteEl.classList.remove("is-error");
    }
  } else if (noteEl) {
    noteEl.hidden = true;
    noteEl.textContent = "";
  }

  if (submitBtn) submitBtn.disabled = false;
}

function showError(message) {
  setVisible("join-loading", false);
  setVisible("join-content", false);
  setVisible("join-success", false);
  setVisible("join-error", true);
  const textEl = document.getElementById("join-error-text");
  if (textEl) textEl.textContent = message;
}

function showSuccess(groupName, roleName) {
  setVisible("join-loading", false);
  setVisible("join-content", false);
  setVisible("join-error", false);
  setVisible("join-success", true);
  const textEl = document.getElementById("join-success-text");
  if (textEl) {
    textEl.textContent = `「${groupName}」に「${roleName}」として参加しました。`;
  }
}

async function init() {
  const token = getInviteToken();
  if (!token) {
    showError("招待リンクが不正です");
    return;
  }

  let invite;
  try {
    invite = await fetchInviteInfo(token);
  } catch (err) {
    showError(err instanceof Error ? err.message : "招待リンクの読み込みに失敗しました");
    return;
  }

  renderInvitePage(invite);

  document.getElementById("join-submit")?.addEventListener("click", async () => {
    const submitBtn = document.getElementById("join-submit");
    if (!submitBtn || submitBtn.disabled) return;

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = "参加中…";

    try {
      const result = await joinGroup(token);
      showSuccess(
        result.group_display_name ?? invite.group_display_name,
        result.group_role_display_name ?? invite.group_role_display_name
      );
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel ?? "参加する";
      showError(err instanceof Error ? err.message : "グループへの参加に失敗しました");
    }
  });
}

init().catch((err) => {
  showError(err instanceof Error ? err.message : "エラーが発生しました");
});
