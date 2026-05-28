export type RiskLevel = 'raro' | 'baixo' | 'atencao' | 'alto' | 'extremo';

export interface Inspection {
  id: string;
  unit: string;
  date: string;
  status: 'draft' | 'completed';
  inspector_name?: string;
  inspector_role?: string;
  inspector_signature?: string;
  created_at: string;
}

export interface DropdownOption {
  label: string;
  value: number;
}

export interface Finding {
  id: string;
  inspection_id: string;
  risk_description: string;
  what_to_do: string;
  why_to_do: string;
  gravity_label: string;
  gravity_value: number;
  frequency_label: string;
  frequency_value: number;
  probability_label: string;
  probability_value: number;
  exposure_label: string;
  exposure_value: number;
  calculated_score: number;
  risk_level: RiskLevel;
  photos: string[];
  created_at: string;
}