import { DropdownOption } from '../types';

export const GRAVITY_OPTIONS: DropdownOption[] = [
  { label: 'Arranhão, Contusão e/ou Escoriação', value: 0.1 },
  { label: 'Laceração, Corte e/ou Efeito Leve na Saúde', value: 0.5 },
  { label: 'Fratura - Ossos Menores e/ou Doença Leve (Temporária)', value: 1.0 },
  { label: 'Fratura - Ossos Importantes e/ou Doença Leve (Permanente)', value: 2.0 },
  { label: 'Perda de 1 Membro, Olho e/ou Doença Grave (Temporária)', value: 4.0 },
  { label: 'Perda de 2 Membros, Olhos e/ou Doença Grave (Irreversível)', value: 8.0 },
  { label: 'Enfermidade Permanente ou Crítica', value: 12.0 },
  { label: 'Morte', value: 15.0 },
];

export const FREQUENCY_OPTIONS: DropdownOption[] = [
  { label: 'Raramente', value: 0.1 },
  { label: 'Anualmente', value: 0.2 },
  { label: 'Mensalmente', value: 1.0 },
  { label: 'Semanalmente', value: 1.5 },
  { label: 'Diariamente', value: 2.5 },
  { label: 'Em Termos de Hora', value: 4.0 },
  { label: 'Constantemente', value: 5.0 },
];

export const PROBABILITY_OPTIONS: DropdownOption[] = [
  { label: 'Quase Impossível', value: 0.03 },
  { label: 'Altamente Improvável', value: 0.5 },
  { label: 'Possível', value: 1.0 },
  { label: 'Alguma Chance', value: 5.0 },
  { label: 'Provável', value: 8.0 },
  { label: 'Esperado', value: 10.0 },
  { label: 'Certamente', value: 15.0 },
];

export const EXPOSURE_OPTIONS: DropdownOption[] = [
  { label: '1 - 2 Pessoas', value: 1.0 },
  { label: '3 - 7 Pessoas', value: 2.0 },
  { label: '8 - 15 Pessoas', value: 4.0 },
  { label: '16 - 50 Pessoas', value: 8.0 },
  { label: 'Mais de 50 Pessoas', value: 12.0 },
];