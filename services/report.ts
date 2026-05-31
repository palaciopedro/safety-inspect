import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Inspection, Finding } from '../types';
import { generateReportHTML } from '../utils/generateReport';
import { settingsService } from './settings';

export const generateAndShareReport = async (
  inspection: Inspection,
  findings: Finding[]
): Promise<void> => {
  const settings = await settingsService.load().catch(() => ({ companyName: '', companyLogo: null }));
  const html = generateReportHTML(inspection, findings, settings);

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