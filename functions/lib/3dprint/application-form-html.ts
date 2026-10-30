/** R2 object key for Noto Sans JP used in application-form PDFs (upload via scripts/upload-print-application-font.mjs). */
export const APPLICATION_FORM_FONT_R2_KEY =
  'print/assets/noto-sans-jp-japanese-400-normal.woff2';

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Builds a self-contained HTML document for Browser Run /pdf (inline woff2, no external URLs). */
export function buildApplicationFormHtml(
  applicationText: string,
  fontWoff2Base64: string
): string {
  const body = escapeHtml(applicationText.replace(/\r\n/g, '\n'));
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<style>
@font-face {
  font-family: 'NotoSansJP';
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url(data:font/woff2;base64,${fontWoff2Base64}) format('woff2');
}
@page { size: A4; margin: 18mm 16mm; }
html, body {
  margin: 0;
  padding: 0;
  font-family: 'NotoSansJP', sans-serif;
  font-size: 10pt;
  line-height: 1.45;
  color: #1a1a1f;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
h1 {
  font-size: 13pt;
  font-weight: 700;
  margin: 0 0 12pt;
  padding-bottom: 6pt;
  border-bottom: 1px solid #ccc;
}
pre.form-body {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
</style>
</head>
<body>
<h1>ScienceHUB 3Dプリント 申請書</h1>
<pre class="form-body">${body}</pre>
</body>
</html>`;
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
