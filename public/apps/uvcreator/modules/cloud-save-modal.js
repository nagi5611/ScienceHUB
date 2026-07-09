/**
 * クラウドストレージへ保存するモーダル（UV Creator 用ラッパー）
 */

import { createCloudSaveModal as createShared } from "../../../js/cloud-save-modal.js";

/** クラウド保存モーダルを生成 */
export function createCloudSaveModal(dialogEl) {
  return createShared(dialogEl, {
    idPrefix: "uv-cloud-save",
    loginNext: "/apps/uvcreator/",
  });
}
