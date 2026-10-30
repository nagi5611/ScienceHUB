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

type ParsedFormRow = { label: string; value: string };

/** Parses plain-text application form from buildPrintApplicationFormText (field lines unchanged upstream). */
export function parseApplicationFormText(applicationText: string): {
  rows: ParsedFormRow[];
  reservationId: string | null;
  outputLine: string | null;
} {
  const rows: ParsedFormRow[] = [];
  let reservationId: string | null = null;
  let outputLine: string | null = null;

  for (const raw of applicationText.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trimEnd();
    if (!line || line.startsWith('ScienceHUB') || /^=+$/.test(line.trim())) continue;
    if (line.startsWith('出力:')) {
      outputLine = line;
      continue;
    }
    const sep = line.indexOf(':');
    if (sep <= 0) continue;
    const label = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim();
    if (label === '予約ID') {
      reservationId = value;
      continue;
    }
    rows.push({ label, value });
  }

  return { rows, reservationId, outputLine };
}

const SECTIONS: { title: string; labels: string[] }[] = [
  {
    title: '作品・申請者',
    labels: ['作品名', '申請者'],
  },
  {
    title: '印刷予約',
    labels: ['日付', '時間', '機種', '種別', '状態', '担当'],
  },
  {
    title: 'データ・備考',
    labels: ['印刷データ', '備考', '担当者メモ'],
  },
];

function rowByLabel(rows: ParsedFormRow[], label: string): ParsedFormRow | undefined {
  return rows.find((r) => r.label === label);
}

function renderFieldRow(row: ParsedFormRow, multiline = false): string {
  const valueClass = multiline ? 'field-value multiline' : 'field-value';
  return `<tr>
  <th scope="row">${escapeHtml(row.label)}</th>
  <td class="${valueClass}">${escapeHtml(row.value || '—')}</td>
</tr>`;
}

function renderSection(title: string, rows: ParsedFormRow[]): string {
  if (!rows.length) return '';
  const body = rows.map((r) =>
    renderFieldRow(r, r.label === '備考' || r.label === '担当者メモ')
  ).join('\n');
  return `<section class="form-section">
  <h2 class="section-title">${escapeHtml(title)}</h2>
  <table class="field-table" role="presentation">
    <tbody>
${body}
    </tbody>
  </table>
</section>`;
}

/** Builds a self-contained HTML document for Browser Run /pdf (inline woff2, no external URLs). */
export function buildApplicationFormHtml(
  applicationText: string,
  fontWoff2Base64: string
): string {
  const { rows, reservationId, outputLine } = parseApplicationFormText(applicationText);
  const sectionsHtml = SECTIONS.map(({ title, labels }) => {
    const sectionRows = labels
      .map((label) => rowByLabel(rows, label))
      .filter((r): r is ParsedFormRow => Boolean(r));
    return renderSection(title, sectionRows);
  }).join('\n');

  const metaId = reservationId
    ? `<p class="doc-meta-id"><span class="meta-label">予約ID</span> ${escapeHtml(reservationId)}</p>`
    : '';
  const footer = escapeHtml(outputLine ?? '出力: ScienceHUB 3Dプリント');

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
@page { size: A4; margin: 14mm 13mm; }
*, *::before, *::after { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  font-family: 'NotoSansJP', sans-serif;
  font-size: 9.5pt;
  line-height: 1.5;
  color: #000;
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.form-body {
  max-width: 100%;
}
.doc-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12pt;
  padding-bottom: 10pt;
  margin-bottom: 14pt;
  border-bottom: 2pt solid #000;
}
.doc-brand {
  font-size: 8pt;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #444;
  margin: 0 0 4pt;
}
.doc-title {
  font-size: 16pt;
  font-weight: 700;
  margin: 0;
  color: #000;
  letter-spacing: 0.02em;
}
.doc-meta-id {
  margin: 0;
  text-align: right;
  font-size: 8pt;
  color: #444;
  line-height: 1.4;
}
.meta-label {
  display: block;
  font-size: 7pt;
  letter-spacing: 0.08em;
  color: #666;
  margin-bottom: 2pt;
}
.form-section {
  margin-bottom: 12pt;
  break-inside: avoid;
}
.section-title {
  font-size: 9pt;
  font-weight: 700;
  color: #000;
  background: #e8e8e8;
  margin: 0 0 0;
  padding: 5pt 8pt;
  border: 1pt solid #999;
  border-bottom: none;
}
.field-table {
  width: 100%;
  border-collapse: collapse;
  border: 1pt solid #999;
  border-top: none;
  background: #fff;
}
.field-table tr:not(:last-child) th,
.field-table tr:not(:last-child) td {
  border-bottom: 1pt solid #ccc;
}
.field-table th {
  width: 22%;
  min-width: 72pt;
  padding: 6pt 8pt;
  text-align: left;
  vertical-align: top;
  font-weight: 600;
  font-size: 8.5pt;
  color: #000;
  background: #f2f2f2;
  white-space: nowrap;
}
.field-table td {
  padding: 6pt 10pt;
  vertical-align: top;
  background: #fff;
}
.field-value.multiline {
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 2.5em;
}
.doc-footer {
  margin-top: 16pt;
  padding-top: 8pt;
  border-top: 1pt solid #ccc;
  font-size: 7.5pt;
  color: #666;
  text-align: center;
}
</style>
</head>
<body>
<article class="form-body application-form">
  <header class="doc-header">
    <div>
      <p class="doc-brand">ScienceHUB · 3Dプリント</p>
      <h1 class="doc-title">予約・依頼 申請書</h1>
    </div>
    ${metaId}
  </header>
  ${sectionsHtml}
  <footer class="doc-footer">${footer}</footer>
</article>
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
