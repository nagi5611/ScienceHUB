/**
 * 管理パネル — dialog の外側クリックで閉じる
 */

/** ダイアログ外（バックドロップ）クリックで閉じる */
export function bindDialogBackdropClose(root = document) {
  root.querySelectorAll("dialog.cf-dialog").forEach((dialog) => {
    if (dialog.dataset.backdropCloseBound === "1") return;
    dialog.dataset.backdropCloseBound = "1";

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });
}
