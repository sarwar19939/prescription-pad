import type { DiseaseProtocolTemplate } from './types';
import { GASTRO_UPPER_PROTOCOLS } from './gastroUpper';
import { GASTRO_LOWER_PROTOCOLS } from './gastroLower';

export const GASTROINTESTINAL_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...GASTRO_LOWER_PROTOCOLS,
  ...GASTRO_UPPER_PROTOCOLS,
];

export { GASTRO_UPPER_PROTOCOLS, GASTRO_LOWER_PROTOCOLS };
