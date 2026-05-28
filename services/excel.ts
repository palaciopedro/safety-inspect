import ExcelJS from 'exceljs';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Inspection, Finding } from '../types';
import { formatDateBR } from '../utils/date';

const COLUMNS = [
  { header: 'O que fazer',     key: 'o_que_fazer',    width: 30 },
  { header: 'Por que?',        key: 'por_que',        width: 30 },
  { header: 'Onde?',           key: 'onde',           width: 20 },
  { header: 'Quem?',           key: 'quem',           width: 20 },
  { header: 'Prazo início',    key: 'prazo_inicio',   width: 14 },
  { header: 'Prazo término',   key: 'prazo_termino',  width: 14 },
  { header: 'Início',          key: 'inicio',         width: 14 },
  { header: 'Realizado',       key: 'realizado',      width: 14 },
  { header: 'Status',          key: 'status',         width: 20 },
  { header: 'Nº O.S. Engeman', key: 'os_engeman',    width: 16 },
  { header: 'Valor',           key: 'valor',          width: 12 },
  { header: 'Grav',            key: 'grav',           width: 8  },
  { header: 'Freq',            key: 'freq',           width: 8  },
  { header: 'Prob',            key: 'prob',           width: 8  },
  { header: 'Exp.',            key: 'exp',            width: 8  },
  { header: 'HRN',             key: 'hrn',            width: 10 },
  { header: 'Grau de risco',   key: 'grau_risco',     width: 16 },
  { header: 'Recurso',         key: 'recurso',        width: 16 },
  { header: 'Observações',     key: 'observacoes',    width: 30 },
];

const RISK_COLORS: Record<string, string> = {
  raro:     'FF22c55e',
  baixo:    'FF84cc16',
  atencao:  'FFd97706',
  alto:     'FFf97316',
  extremo:  'FFef4444',
};

const RISK_LABELS: Record<string, string> = {
  raro:    'Raro',
  baixo:   'Baixo',
  atencao: 'Atenção',
  alto:    'Alto',
  extremo: 'Extremo',
};

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1a6b2f' },
};

const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: 'FFFFFFFF' },
  name: 'Arial',
  size: 10,
};

const applyHeaderStyle = (cell: ExcelJS.Cell) => {
  cell.fill = HEADER_FILL;
  cell.font = HEADER_FONT;
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  cell.border = {
    top:    { style: 'thin', color: { argb: 'FF000000' } },
    left:   { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right:  { style: 'thin', color: { argb: 'FF000000' } },
  };
};

const applyDataStyle = (cell: ExcelJS.Cell) => {
  cell.font = { name: 'Arial', size: 10 };
  cell.alignment = { vertical: 'middle', wrapText: true };
  cell.border = {
    top:    { style: 'thin', color: { argb: 'FFCCCCCC' } },
    left:   { style: 'thin', color: { argb: 'FFCCCCCC' } },
    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    right:  { style: 'thin', color: { argb: 'FFCCCCCC' } },
  };
};

export const generateAndShareExcel = async (
  inspection: Inspection,
  findings: Finding[]
): Promise<void> => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Safety Inspection App';
  wb.created = new Date();

  const ws = wb.addWorksheet('Inspeção', {
    pageSetup: { orientation: 'landscape', fitToPage: true },
  });

  ws.columns = COLUMNS;

  const headerRow = ws.getRow(1);
  headerRow.height = 30;
  COLUMNS.forEach((_, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = COLUMNS[idx].header;
    applyHeaderStyle(cell);
  });

  findings.forEach((finding, i) => {
    const rowNum = i + 2;
    const row = ws.getRow(rowNum);
    row.height = 20;

    const hrn = finding.gravity_value * finding.frequency_value *
                finding.probability_value * finding.exposure_value;
    row.getCell(1).value  = finding.what_to_do;
    row.getCell(2).value  = finding.why_to_do;
    row.getCell(3).value  = finding.sector;
    row.getCell(4).value  = inspection.inspector_name ?? '';
    row.getCell(5).value = inspection.date;
    row.getCell(6).value  = ''; 
    row.getCell(7).value  = '';
    row.getCell(8).value  = '';
    row.getCell(9).value = '';
    row.getCell(10).value = '';
    row.getCell(11).value = '';
    row.getCell(12).value = finding.gravity_value;
    row.getCell(13).value = finding.frequency_value;
    row.getCell(14).value = finding.probability_value;
    row.getCell(15).value = finding.exposure_value;
    row.getCell(16).value = parseFloat(hrn.toFixed(2));
    row.getCell(17).value = RISK_LABELS[finding.risk_level] ?? finding.risk_level;
    row.getCell(18).value = '';
    row.getCell(19).value = '';

    const riskCell = row.getCell(17);
    const color = RISK_COLORS[finding.risk_level];
    if (color) {
      riskCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
      riskCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    }

    for (let c = 1; c <= COLUMNS.length; c++) {
      const cell = row.getCell(c);
      applyDataStyle(cell);
      if (c === 17 && color) {
        cell.border = {
          top:    { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left:   { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right:  { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };
      }
    }

    row.commit();
  });

  ws.views = [{ state: 'frozen', ySplit: 1 }];

  const buffer = await wb.xlsx.writeBuffer();
  
  const bytes = new Uint8Array(buffer as ArrayBuffer);
  
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  
  const base64 = global.btoa(binary);
  
  const filename = `inspecao_${inspection.unit.replace(/\s+/g, '_')}_${inspection.date}.xlsx`;
  
  const fileUri = `${FileSystem.cacheDirectory}${filename}`;
  
  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: `Exportar - ${inspection.unit}`,
      UTI: 'com.microsoft.excel.xlsx',
    });
  }
};