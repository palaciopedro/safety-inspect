export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type Probability = 1 | 2 | 3 | 4 | 5;
export type Impact = 1 | 2 | 3 | 4 | 5;

export interface Inspection {
  id: string;
  unit: string;
  date: string;
  status: 'draft' | 'completed';
  created_at: string;
}

export interface Finding {
  id: string;
  inspection_id: string;
  description: string;
  probability: Probability;
  impact: Impact;
  risk_level: RiskLevel;
  photo_url?: string;
  created_at: string;
}

export interface RiskMatrix {
  probability: Probability;
  impact: Impact;
  level: RiskLevel;
}