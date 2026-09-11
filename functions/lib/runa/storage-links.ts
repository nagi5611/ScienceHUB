/**
 * Runa — クラウドストレージ UI へのリンク生成
 */

import type { RunaFileItem } from "./tools";

/** 論理パスの親ディレクトリを返す */
export function parentStoragePath(logicalPath: string): string {
  const parts = logicalPath.split("/").filter(Boolean);
  if (parts.length <= 2) return logicalPath;
  return parts.slice(0, -1).join("/");
}

/** クラウドストレージアプリで開く URL */
export function storageBrowserUrl(
  logicalPath: string,
  type: "file" | "folder" = "file"
): string {
  const target =
    type === "folder" ? logicalPath : parentStoragePath(logicalPath);
  return `/apps/cloud-storage/?path=${encodeURIComponent(target)}`;
}

/** 検索結果などを Markdown リンク付きで整形 */
export function formatFileItemsMarkdown(
  title: string,
  files: RunaFileItem[]
): string {
  if (!files.length) {
    return `${title}\n\n該当するファイルは見つかりませんでした。`;
  }

  const lines = files.map((f) => {
    const url = storageBrowserUrl(f.path, f.type);
    const kind = f.type === "folder" ? "フォルダ" : "ファイル";
    const updated =
      f.updatedAt != null
        ? new Date(f.updatedAt).toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
          })
        : "不明";
    return `- [${f.name}（${kind}）](${url}) — \`${f.path}\`（更新: ${updated}）`;
  });

  const heading = title.includes("**")
    ? `${title}（${files.length}件）`
    : `**${title}**（${files.length}件）`;
  return `${heading}:\n\n${lines.join("\n")}`;
}
