import { Inspection, Finding } from '../types';
import { getRiskColor } from './risk';
import { formatDateBR } from './date';

const riskLabels: Record<string, string> = {
  raro: 'Raro',
  baixo: 'Baixo',
  atencao: 'Atenção',
  alto: 'Alto',
  extremo: 'Extremo',
};

const photoGrid = (photos: string[]): string => {
  if (!photos?.length) return '';
  const items = photos
    .map(
      uri => `
      <td style="padding:4px;">
        <img src="${uri}" style="width:240px;height:180px;object-fit:cover;border-radius:4px;" />
      </td>`
    )
    .join('');

  // Group into rows of 2
  const rows: string[] = [];
  for (let i = 0; i < photos.length; i += 2) {
    const pair = photos.slice(i, i + 2);
    rows.push(`
      <tr>
        ${pair.map(uri => `
          <td style="padding:4px;">
            <img src="${uri}" style="width:240px;height:180px;object-fit:cover;border-radius:4px;" />
          </td>`).join('')}
      </tr>`);
  }

  return `
    <table style="margin:12px 0;">
      ${rows.join('')}
    </table>`;
};

const findingBlock = (finding: Finding, index: number): string => {
  const color = getRiskColor(finding.risk_level);
  return `
    <div style="margin-bottom:32px;page-break-inside:avoid;">
      <div style="background:#4caf50;color:#fff;display:inline-block;padding:4px 12px;border-radius:4px;font-weight:bold;font-size:16px;margin-bottom:12px;">
        ${String(index + 1).padStart(2, '0')}
      </div>

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

      <div style="margin-top:8px;font-size:12px;color:#555;">
        <span>G: ${finding.gravity_value} &nbsp;|&nbsp;</span>
        <span>F: ${finding.frequency_value} &nbsp;|&nbsp;</span>
        <span>P: ${finding.probability_value} &nbsp;|&nbsp;</span>
        <span>E: ${finding.exposure_value}</span>
      </div>

      ${photoGrid(finding.photos)}
    </div>`;
};

const summaryRow = (finding: Finding, index: number): string => {
  const color = getRiskColor(finding.risk_level);
  return `
    <tr>
      <td style="padding:8px;text-align:center;">${String(index + 1).padStart(2, '0')}</td>
      <td style="padding:8px;">${finding.sector}</td>
      <td style="padding:8px;">${finding.risk_description}</td>
      <td style="padding:8px;text-align:center;color:${color};font-weight:bold;">
        ${riskLabels[finding.risk_level]}
      </td>
    </tr>`;
};

export const generateReportHTML = (
  inspection: Inspection,
  findings: Finding[]
): string => {
  const today = formatDateBR(inspection.date);

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
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover page-break">
    <div style="margin-bottom:40px;">
      <div style="font-size:28px;font-weight:900;color:#8B1A1A;letter-spacing:2px;">Nome Empresa</div>
      <div style="font-size:11px;color:#555;">Nome Empresa - Cooperativa Agropecuária e Industrial</div>
    </div>

    <div style="margin-top:80px;">
      <h1 style="font-size:32px;font-weight:900;">${inspection.unit}</h1>
      <h2 style="font-size:20px;font-weight:bold;margin-top:8px;">Nome Empresa</h2>
      <h2 style="font-size:20px;font-weight:bold;">Relatório da Inspeção visual</h2>
    </div>

    <div style="margin-top:80px;text-align:right;">
      <p>Período: <strong>${today}</strong></p>
    </div>
  </div>

  <!-- SUMMARY PAGE -->
  <div class="page page-break">
    <div class="header-row">
      <div>
        <div style="font-size:14px;font-weight:900;color:#8B1A1A;">Nome Empresa</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:14px;font-weight:bold;">Relatório da Inspeção visual</div>
        <div style="font-size:16px;font-weight:900;">${inspection.unit}</div>
      </div>
      <div>
        <div style="font-size:14px;font-weight:900;color:#8B1A1A;">Nome Empresa</div>
      </div>
    </div>

    ${inspection.inspector_name ? `
    <p style="margin-bottom:16px;font-size:13px;">
      Preparado por: <strong>${inspection.inspector_name}</strong>
      ${inspection.inspector_role ? ` — ${inspection.inspector_role}` : ''}
    </p>` : ''}

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
          <th>Risco/Ocorrência</th>
          <th>Nível de Risco</th>
        </tr>
      </thead>
      <tbody>
        ${findings.map(summaryRow).join('')}
      </tbody>
    </table>

    ${inspection.inspector_signature ? `
    <div style="margin-top:40px;">
      <p style="font-size:12px;color:#555;margin-bottom:8px;">Assinatura do Inspetor:</p>
      <img src="${inspection.inspector_signature}"
           style="height:80px;border:1px solid #ddd;border-radius:4px;background:#fff;" />
      <p style="font-size:12px;margin-top:4px;">
        ${inspection.inspector_name} — ${inspection.inspector_role}
      </p>
    </div>` : ''}
  </div>

  <!-- DETAIL PAGES -->
  <div class="page">
    <h3 style="text-align:center;font-size:14px;text-transform:uppercase;margin-bottom:24px;">
      Detalhamento da Inspeção Visual
    </h3>

    ${findings.map(findingBlock).join('<hr class="divider" />')}
  </div>

</body>
</html>`;
};