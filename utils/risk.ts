import { Probability, Impact, RiskLevel } from '@/types';

const RISK_MATRIX: Record<number, RiskLevel> = {
  1: 'low', 2: 'low', 3: 'low', 4: 'low',
  5: 'low', 6: 'medium', 8: 'medium',
  9: 'medium', 10: 'medium', 12: 'high',
  15: 'high', 16: 'high', 20: 'critical', 25: 'critical'
};

export const calculateRisk = (probability: Probability, impact: Impact): RiskLevel => {
  return RISK_MATRIX[probability * impact];
};

export const getRiskColor = (level: RiskLevel): string => {
  const colors: Record<RiskLevel, string> = {
    low: '#22c55e',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444'
  };
  return colors[level];
};
