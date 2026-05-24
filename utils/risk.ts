import { RiskLevel } from '../types';

export const calculateRiskScore = (
  gravity: number,
  frequency: number,
  probability: number,
  exposure: number
): number => {
  return gravity * frequency * probability * exposure;
};

export const getRiskLevel = (score: number): RiskLevel => {
  if (score <= 1) return 'raro';
  if (score <= 5) return 'baixo';
  if (score <= 50) return 'atencao';
  if (score <= 500) return 'alto';
  return 'extremo';
};

export const getRiskColor = (level: RiskLevel): string => {
  const colors: Record<RiskLevel, string> = {
    raro: '#22c55e',
    baixo: '#84cc16',
    atencao: '#eab308',
    alto: '#f97316',
    extremo: '#ef4444',
  };
  return colors[level];
};