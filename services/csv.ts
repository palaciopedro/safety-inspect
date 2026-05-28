import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { Inspection, Finding } from '../types';

const HEADERS = [
  'O que fazer',
  'Por que?',
  'Onde?',
  'Quem?',
  'Prazo início',
  'Prazo término',
  'Início',
  'Realizado',
  'Status',
  'Nº O.S. Engeman',
  'Valor',
  'Grav',
  'Freq',
  'Prob',
  'Exp',
  'HRN',
  'Grau de risco',
  'Recurso',
  'Observações',
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
        finding.sector ?? '',
        inspection.inspector_name ?? '',
        inspection.date,
        '',
        '',
        '',
        'Não iniciada',
        '',
        '',
        finding.gravity_value,
        finding.frequency_value,
        finding.probability_value,
        finding.exposure_value,
        hrn.toFixed(2),
        finding.risk_level,
        '',
        '',
      ];
    });

    const csvContent = [HEADERS, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
          .join(';')
      )
      .join('\n');

    const fileUri =
      FileSystem.cacheDirectory +
      `inspecao_${inspection.id}.csv`;

    await FileSystem.writeAsStringAsync(
      fileUri,
      '\uFEFF' + csvContent,
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );

    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Exportar Planilha',
    });
  } catch (error) {
    console.error('CSV ERROR:', error);
  }
};