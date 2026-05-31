import { Inspection, Finding } from '../types';
import { getRiskColor } from './risk';
import { formatDateBR } from './date';
import { AppSettings } from '../services/settings';

const riskLabels: Record<string, string> = {
  raro: 'Raro',
  baixo: 'Baixo',
  atencao: 'Atenção',
  alto: 'Alto',
  extremo: 'Extremo',
};

const photoGrid = (photos: string[]): string => {
  if (!photos?.length) return '';

  const rows: string[] = [];

  for (let i = 0; i < photos.length; i += 2) {
    const pair = photos.slice(i, i + 2);

    rows.push(`
      <tr>
        ${pair.map(uri => `
          <td style="width:50%;padding:6px;text-align:center;vertical-align:top;">
            <img
              src="${uri}"
              style="
                width:100%;
                max-width:260px;
                max-height:200px;
                object-fit:contain;
                border:1px solid #ddd;
                border-radius:4px;
                background:#fff;
              "
            />
          </td>
        `).join('')}
      </tr>
    `);
  }

  return `
    <table style="width:100%;margin-top:16px;border-collapse:collapse;">
      ${rows.join('')}
    </table>
  `;
};

const findingBlock = (finding: Finding, index: number): string => {
  const color = getRiskColor(finding.risk_level);
  return `
    <div style="margin-bottom:32px;page-break-inside:avoid;border:1px solid #e5e7eb;border-radius:8px;padding:16px;background:#fff;">
      <h3 style="font-size:18px;font-weight:bold;margin:0 0 8px 0;">
        ${finding.risk_description}
      </h3>

      <p style="margin:4px 0;font-size:13px;">
        <strong>Setor:</strong> ${finding.sector}
      </p>
      <p style="margin:4px 0;font-size:13px;">
        <strong>Nível de Risco:</strong>
        <span style="color:${color};font-weight:bold;">${riskLabels[finding.risk_level]}</span>
        (${finding.calculated_score.toFixed(2)})
      </p>
      <p style="margin:4px 0;font-size:13px;">
        <strong>Melhorias necessárias:</strong> ${finding.what_to_do}
      </p>
      <p style="margin:4px 0;font-size:13px;">
        <strong>Por que:</strong> ${finding.why_to_do}
      </p>
      <p style="margin:4px 0;font-size:13px;">
        <strong>Requisito Legal:</strong> ${finding.legal_requirement}
      </p>

      <div style="margin-top:8px;font-size:12px;color:#555;">
        <span>Grav: ${finding.gravity_value} &nbsp;|&nbsp;</span>
        <span>Freq: ${finding.frequency_value} &nbsp;|&nbsp;</span>
        <span>Prob: ${finding.probability_value} &nbsp;|&nbsp;</span>
        <span>Exp: ${finding.exposure_value}</span>
      </div>

      ${photoGrid(finding.photos)}
    </div>`;
};

const summaryRow = (finding: Finding, index: number): string => {
  const color = getRiskColor(finding.risk_level);
  return `
    <tr>
      <td style="padding:8px;text-align:center;">${String(index + 1).padStart(2, '0')}</td>
      <td style="padding:8px;text-align:center;">${finding.sector}</td>
      <td style="padding:8px;text-align:center;">${finding.legal_requirement}</td>
      <td style="padding:8px;text-align:center;">${finding.risk_description}</td>
      <td style="padding:8px;text-align:center;color:${color};font-weight:bold;">
        ${riskLabels[finding.risk_level]}
      </td>
    </tr>`;
};

export const generateReportHTML = (
  inspection: Inspection,
  findings: Finding[],
  settings: AppSettings = { companyName: '', companyLogo: null }
): string => {
  const today = formatDateBR(inspection.date);
  const name = settings.companyName || 'Nome Empresa';
  const logoHTML = settings.companyLogo
    ? `<img src="${settings.companyLogo}" style="height:60px;object-fit:contain;margin-bottom:8px;" />`
    : '';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; color: #222; font-size: 13px; }
  h1, h2, h3 { font-family: Arial, sans-serif; }
  .page { padding: 40px; max-width: 800px; margin: 0 auto; }
  .cover { text-align: center; padding: 80px 40px; }
  .divider { border: none; border-top: 1px solid #ccc; margin: 16px 0; }
  table { border-collapse: collapse; width: 100%; }
  th { background: #f0f0f0; padding: 8px; text-align: center; font-size: 13px; }
  td { border-bottom: 1px solid #eee; }
  .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .page-break { page-break-after: always; }

  .signature-page {
    page-break-before: always;
  }

  .signature-container {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .signature-card {
    flex: 1;
    min-width: 156px;
    max-width: 192px;
    text-align: center;
  }

  .signature-box {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }

  .signature-box img {
    max-width: 100%;
    max-height: 90px;
    object-fit: contain;
  }
</style>
<body>

  <!-- COVER PAGE -->
  <div class="cover page-break">
    <div style="margin-bottom:40px;">
      ${logoHTML}
    </div>

    <div style="margin-top:80px;">
      <h1 style="font-size:32px;font-weight:900;">${inspection.unit}</h1>
      <h2 style="font-size:20px;font-weight:bold;">Relatório da Inspeção visual</h2>
    </div>

    <div style="margin-top:80px;text-align:right;">
      <p>Data: <strong>${today}</strong></p>
    </div>
  </div>

  <!-- SUMMARY PAGE -->
  <div class="page page-break">
    <div class="header-row">
      <div></div>
      <div style="text-align:center;">
        <div style="font-size:14px;font-weight:bold;">Relatório da Inspeção visual</div>
        <div style="font-size:16px;font-weight:900;">${inspection.unit}</div>
      </div>
      <div></div>
    </div>

    

    <div style="background:#f5f5f5;padding:12px;margin-bottom:12px;">
      <h3 style="text-align:center;font-size:14px;text-transform:uppercase;">
        Resumo da Inspeção Visual
      </h3>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nº</th>
          <th>Setor</th>
          <th>Requisito Legal</th>
          <th>Risco/Ocorrência</th>
          <th>Nível de Risco</th>
        </tr>
      </thead>
      <tbody>
        ${findings.map(summaryRow).join('')}
      </tbody>
    </table>
  </div>

    <!-- DETAIL PAGES -->
  <div class="page">
    <h3 style="text-align:center;font-size:14px;text-transform:uppercase;margin-bottom:24px;">
      Detalhamento da Inspeção Visual
    </h3>

    ${findings.map(findingBlock).join('<hr class="divider" />')}
  </div>

  <!-- SIGNATURE PAGE -->
  <div class="page signature-page">

    <h3 style="
      text-align:center;
      font-size:14px;
      text-transform:uppercase;
      margin-bottom:40px;
    ">
      Assinaturas
    </h3>

    <div class="signature-container">

      <div class="signature-card">
        <div style="font-size:12px;font-weight:700;margin-bottom:8px;">
          AUDITOR SST
        </div>

        <div class="signature-box">
          ${
            inspection.inspector_signature
              ? `<img src="${inspection.inspector_signature}" />`
              : ''
          }
        </div>

        <p style="font-size:13px;font-weight:600;margin-top:12px;">
          ${inspection.inspector_name ?? ''}
        </p>

        <p style="font-size:12px;color:#555;">
          ${inspection.inspector_role ?? ''}
        </p>
      </div>

      <div class="signature-card">
        <div style="font-size:12px;font-weight:700;margin-bottom:8px;">
          RESPONSÁVEL PELO LOCAL
        </div>

        <div class="signature-box">
          ${
            inspection.responsible_signature
              ? `<img src="${inspection.responsible_signature}" />`
              : ''
          }
        </div>

        <p style="font-size:13px;font-weight:600;margin-top:12px;">
          ${inspection.responsible_name ?? ''}
        </p>

        <p style="font-size:12px;color:#555;">
          ${inspection.responsible_role ?? ''}
        </p>
      </div>

    </div>

  </div>

</body>
</html>`;
};