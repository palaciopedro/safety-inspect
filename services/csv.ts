import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { Inspection, Finding } from '../types';

const HEADERS = [
  'O que fazer',
  'Por que',
  'Requisito Legal',
  'Onde',
  'Quem',
  'Prazo início',
  'Grav',
  'Freq',
  'Prob',
  'Exp',
  'HRN',
];

export const generateAndShareCSV = async (
  inspection: Inspection,
  findings: Finding[]
) => {
  try {
    const rows = findings.map((finding) => {
      const hrn =
        finding.gravity_value *
        finding.frequency_value *
        finding.probability_value *
        finding.exposure_value;

      return [
        finding.what_to_do,
        finding.why_to_do,
        finding.legal_requirement,
        finding.sector ?? '',
        inspection.inspector_name ?? '',
        inspection.date,
        finding.gravity_value,
        finding.frequency_value,
        finding.probability_value,
        finding.exposure_value,
        hrn.toFixed(2).replace('.', ','),
      ];
    });

    const csvContent = [HEADERS, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
          .join(';')
      )
      .join('\r\n');

    const fileUri =
      FileSystem.cacheDirectory +
      `inspecao_${inspection.id}.csv`;

    const content = '\uFEFF' + csvContent;

    await FileSystem.writeAsStringAsync(
      fileUri,
      content,
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );

    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv;charset=utf-8',
      dialogTitle: 'Exportar Planilha',
    });
  } catch (error) {
    console.error('CSV ERROR:', error);
  }
};