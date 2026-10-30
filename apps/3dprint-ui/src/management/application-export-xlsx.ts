import ExcelJS from 'exceljs';
import type { AdminApplication, AdminMember } from './admin-domain';
import {
  APPLICATION_EXPORT_HEADERS,
  buildApplicationExportRows,
  type ApplicationExportRow,
} from './admin-domain';

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFE4E4E7' },
};
const ROW_FILL_A: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFFFFFFF' },
};
const ROW_FILL_B: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFF4F4F5' },
};
const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FFD4D4D8' } },
  left: { style: 'thin', color: { argb: 'FFD4D4D8' } },
  bottom: { style: 'thin', color: { argb: 'FFD4D4D8' } },
  right: { style: 'thin', color: { argb: 'FFD4D4D8' } },
};

function autoColumnWidths(
  sheet: ExcelJS.Worksheet,
  rowCount: number,
  colCount: number
): void {
  for (let c = 1; c <= colCount; c++) {
    let maxLen = APPLICATION_EXPORT_HEADERS[c - 1]?.label.length ?? 8;
    for (let r = 1; r <= rowCount; r++) {
      const cell = sheet.getCell(r, c);
      const len = String(cell.value ?? '').length;
      if (len > maxLen) maxLen = len;
    }
    sheet.getColumn(c).width = Math.min(48, Math.max(10, maxLen + 2));
  }
}

/** Builds a styled .xlsx workbook for admin calendar export. */
export async function buildApplicationsXlsxBuffer(
  apps: AdminApplication[],
  fromStr: string,
  toStr: string,
  members: AdminMember[],
  shiftMap: Record<string, string | null> = {}
): Promise<ArrayBuffer> {
  const rows = buildApplicationExportRows(apps, fromStr, toStr, members, shiftMap);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ScienceHUB 3D印刷管理';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('予約・依頼', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  const headerRow = sheet.addRow(APPLICATION_EXPORT_HEADERS.map((h) => h.label));
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 11, color: { argb: 'FF18181B' } };
    cell.fill = HEADER_FILL;
    cell.border = THIN_BORDER;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  });

  rows.forEach((row: ApplicationExportRow, index) => {
    const values = APPLICATION_EXPORT_HEADERS.map((h) => row[h.key]);
    const dataRow = sheet.addRow(values);
    const fill = index % 2 === 0 ? ROW_FILL_A : ROW_FILL_B;
    dataRow.eachCell((cell) => {
      cell.fill = fill;
      cell.border = THIN_BORDER;
      cell.alignment = { vertical: 'top', wrapText: true };
    });
  });

  autoColumnWidths(sheet, rows.length + 1, APPLICATION_EXPORT_HEADERS.length);

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as ArrayBuffer;
}
