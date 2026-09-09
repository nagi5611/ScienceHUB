/**
 * ページ範囲文字列のパース・バリデーション
 * 例: "1-3, 5, 7-9"
 */

/**
 * ページ範囲文字列を 0-based インデックス配列のグループに変換
 * @param {string} input
 * @param {number} pageCount 1-based 総ページ数
 * @returns {number[][]} 各グループは 0-based ページインデックス
 */
export function parsePageRangeGroups(input, pageCount) {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("ページ範囲を入力してください");
  }
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error("有効な PDF ページ数がありません");
  }

  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) {
    throw new Error("ページ範囲を入力してください");
  }

  /** @type {number[][]} */
  const groups = [];

  for (const part of parts) {
    const rangeMatch = /^(\d+)\s*-\s*(\d+)$/.exec(part);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start < 1 || end < 1 || start > end) {
        throw new Error(`無効な範囲です: ${part}`);
      }
      if (end > pageCount) {
        throw new Error(`ページ ${end} は PDF の総ページ数 (${pageCount}) を超えています`);
      }
      const indices = [];
      for (let page = start; page <= end; page += 1) {
        indices.push(page - 1);
      }
      groups.push(indices);
      continue;
    }

    if (!/^\d+$/.test(part)) {
      throw new Error(`無効な指定です: ${part}`);
    }

    const page = Number(part);
    if (page < 1 || page > pageCount) {
      throw new Error(`ページ ${page} は PDF の総ページ数 (${pageCount}) を超えています`);
    }
    groups.push([page - 1]);
  }

  return groups;
}

/**
 * N ページごとに 0-based インデックスグループを生成
 * @param {number} pageCount
 * @param {number} chunkSize
 * @returns {number[][]}
 */
export function buildFixedPageGroups(pageCount, chunkSize) {
  if (!Number.isInteger(chunkSize) || chunkSize < 1) {
    throw new Error("N ページは 1 以上の整数で指定してください");
  }
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error("有効な PDF ページ数がありません");
  }

  /** @type {number[][]} */
  const groups = [];
  for (let offset = 0; offset < pageCount; offset += chunkSize) {
    const indices = [];
    for (let page = offset; page < Math.min(offset + chunkSize, pageCount); page += 1) {
      indices.push(page);
    }
    groups.push(indices);
  }
  return groups;
}

/**
 * 全ページを 1 ページずつのグループに分割
 * @param {number} pageCount
 * @returns {number[][]}
 */
export function buildAllPageGroups(pageCount) {
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error("有効な PDF ページ数がありません");
  }
  return Array.from({ length: pageCount }, (_, index) => [index]);
}
