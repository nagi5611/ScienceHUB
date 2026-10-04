/**
 * 3Dプリンター利用ガイド Q&A の定数
 */

export const QA_CATEGORY_IDS = new Set([
  "rules",
  "model",
  "slice",
  "filament",
  "print",
  "finish",
  "trouble",
]);

export const QA_MACHINES = new Set(["ke", "cc", "both"]);

export const STAFF_DISPLAY_NAME = "担当者";
export const ASKER_DISPLAY_ROLE = "質問者";

export const MAX_QA_TITLE_LEN = 200;
export const MAX_QA_BODY_LEN = 8000;
export const MAX_QA_ATTACHMENTS = 5;
export const QA_LIST_LIMIT = 100;
export const QA_SEARCH_CANDIDATES = 50;
