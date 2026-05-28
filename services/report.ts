import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Inspection, Finding } from '../types';
import { generateReportHTML } from '../utils/generateReport';

export const generateAndShareReport = async (
  inspection: Inspection,
  findings: Finding[]
): Promise<void> => {
  const html = generateReportHTML(inspection, findings);

  const { uri } = await Print.printToFileAsync({ html, base64: false });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Relatório - ${inspection.unit}`,
      UTI: 'com.adobe.pdf',
    });
  }
};