/**
 * サードパーティ MVP — スタブチャット（LLM 接続前）
 */

export type StubTemplateKey = "landing" | "todo" | "form";

const TEMPLATE_LABELS: Record<StubTemplateKey, string> = {
  landing: "ランディングページ",
  todo: "TODO リスト",
  form: "アンケートフォーム",
};

/** テンプレ HTML を返す */
export function buildTemplateHtml(
  key: StubTemplateKey,
  title: string,
  primaryColor: string
): string {
  const safeTitle = escapeHtml(title || "マイアプリ");
  const color = sanitizeColor(primaryColor);

  if (key === "landing") {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<style>
:root { --primary: ${color}; }
body { font-family: system-ui, sans-serif; margin: 0; background: #f8fafc; color: #0f172a; }
.hero { padding: 48px 24px; text-align: center; background: linear-gradient(135deg, var(--primary), #1e293b); color: #fff; }
.hero h1 { font-size: 2rem; margin: 0 0 12px; }
.hero p { opacity: 0.9; max-width: 480px; margin: 0 auto 24px; }
.btn { display: inline-block; padding: 12px 24px; background: #fff; color: var(--primary); border-radius: 8px; font-weight: 600; text-decoration: none; }
section { padding: 32px 24px; max-width: 720px; margin: 0 auto; }
</style>
</head>
<body>
<section class="hero">
<h1>${safeTitle}</h1>
<p>ScienceHUB サードパーティで作ったシンプルなランディングページです。</p>
<a class="btn" href="#">はじめる</a>
</section>
<section>
<h2>特徴</h2>
<ul>
<li>チャットで素早く作成</li>
<li>グループ内で共有</li>
</ul>
</section>
</body>
</html>`;
  }

  if (key === "todo") {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<style>
:root { --primary: ${color}; }
body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #f1f5f9; }
h1 { color: var(--primary); margin-bottom: 16px; }
#list { list-style: none; padding: 0; max-width: 480px; }
#list li { background: #fff; padding: 12px 16px; margin-bottom: 8px; border-radius: 8px; display: flex; gap: 8px; align-items: center; }
input[type=text] { flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; }
button { padding: 10px 16px; background: var(--primary); color: #fff; border: none; border-radius: 8px; cursor: pointer; }
</style>
</head>
<body>
<h1>${safeTitle}</h1>
<div style="display:flex;gap:8px;max-width:480px;margin-bottom:16px">
<input type="text" id="newItem" placeholder="タスクを入力">
<button type="button" id="addBtn">追加</button>
</div>
<ul id="list"></ul>
<script>
const list = document.getElementById('list');
const input = document.getElementById('newItem');
document.getElementById('addBtn').onclick = () => {
  const t = input.value.trim();
  if (!t) return;
  const li = document.createElement('li');
  li.innerHTML = '<input type="checkbox"> <span>' + t.replace(/</g,'&lt;') + '</span>';
  list.appendChild(li);
  input.value = '';
};
</script>
</body>
</html>`;
  }

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<style>
:root { --primary: ${color}; }
body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #fff; max-width: 520px; }
h1 { color: var(--primary); }
label { display: block; margin-top: 12px; font-weight: 500; }
input, textarea, select { width: 100%; padding: 10px; margin-top: 4px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; }
button { margin-top: 16px; padding: 12px 20px; background: var(--primary); color: #fff; border: none; border-radius: 8px; cursor: pointer; }
#msg { margin-top: 12px; color: #059669; }
</style>
</head>
<body>
<h1>${safeTitle}</h1>
<form id="f">
<label>お名前<input name="name" required></label>
<label>満足度<select name="rating"><option>とても良い</option><option>良い</option><option>普通</option></select></label>
<label>コメント<textarea name="comment" rows="3"></textarea></label>
<button type="submit">送信</button>
</form>
<p id="msg" hidden>送信しました（デモ）</p>
<script>
document.getElementById('f').onsubmit = (e) => {
  e.preventDefault();
  document.getElementById('msg').hidden = false;
};
</script>
</body>
</html>`;
}

export const EMPTY_PLACEHOLDER_HTML = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>新しいアプリ</title></head>
<body style="font-family:system-ui;padding:24px;color:#64748b">
<p>左のチャットで「ランディングページ」「TODO リスト」「アンケートフォーム」と送るか、サジェストを選んでください。</p>
</body>
</html>`;

export interface StubChatResult {
  assistantMessage: string;
  html: string | null;
  revisionSummary: string | null;
}

/** ユーザーメッセージを解釈して HTML 更新案を返す */
export function runStubChatLogic(
  userMessage: string,
  currentHtml: string,
  projectTitle: string
): StubChatResult {
  const text = userMessage.trim();
  const lower = text.toLowerCase();

  const templateKey = detectTemplate(lower);
  if (templateKey) {
    const label = TEMPLATE_LABELS[templateKey];
    const html = buildTemplateHtml(templateKey, projectTitle, "#F38020");
    return {
      assistantMessage: `${label}のテンプレートを適用しました。プレビューで確認してください。`,
      html,
      revisionSummary: `テンプレート: ${label}`,
    };
  }

  const titleMatch = text.match(/タイトルを[「『](.+?)[」』]に/);
  if (titleMatch) {
    const newTitle = titleMatch[1].trim();
    const html = patchTitle(currentHtml, newTitle);
    return {
      assistantMessage: `タイトルを「${newTitle}」に変更しました。`,
      html,
      revisionSummary: `タイトル変更: ${newTitle}`,
    };
  }

  if (/色を青に|ブルーに/.test(text)) {
    const html = patchPrimaryColor(currentHtml, "#2563eb");
    return {
      assistantMessage: "メインカラーを青に変更しました。",
      html,
      revisionSummary: "カラー: 青",
    };
  }

  if (/色をオレンジに|オレンジに/.test(text)) {
    const html = patchPrimaryColor(currentHtml, "#f38020");
    return {
      assistantMessage: "メインカラーをオレンジに変更しました。",
      html,
      revisionSummary: "カラー: オレンジ",
    };
  }

  return {
    assistantMessage:
      "MVP では「ランディングページ」「TODO リスト」「アンケートフォーム」、または「タイトルを『〇〇』に」「色を青に」などに対応しています。",
    html: null,
    revisionSummary: null,
  };
}

function detectTemplate(lower: string): StubTemplateKey | null {
  if (lower.includes("ランディング") || lower.includes("landing")) return "landing";
  if (lower.includes("todo") || lower.includes("タスク") || lower.includes("チェックリスト"))
    return "todo";
  if (lower.includes("アンケート") || lower.includes("フォーム") || lower.includes("form"))
    return "form";
  return null;
}

function patchTitle(html: string, title: string): string {
  const safe = escapeHtml(title);
  let out = html.replace(/<title>[^<]*<\/title>/i, `<title>${safe}</title>`);
  if (out.includes("<h1")) {
    out = out.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1>${safe}</h1>`);
  }
  return out;
}

function patchPrimaryColor(html: string, color: string): string {
  const c = sanitizeColor(color);
  if (html.includes("--primary:")) {
    return html.replace(/--primary:\s*[^;]+/g, `--primary: ${c}`);
  }
  return html.replace(
    "<style>",
    `<style>:root { --primary: ${c}; }`
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeColor(value: string): string {
  const v = value.trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v;
  return "#F38020";
}
