import type { DiseaseProtocolTemplate } from './types';
import { ENDOCRINE_DIABETES_PROTOCOLS } from './endocrineDiabetes';
import { ENDOCRINE_METABOLIC_PROTOCOLS } from './endocrineMetabolic';

export const ENDOCRINE_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...ENDOCRINE_DIABETES_PROTOCOLS,
  ...ENDOCRINE_METABOLIC_PROTOCOLS,
];

export { ENDOCRINE_DIABETES_PROTOCOLS, ENDOCRINE_METABOLIC_PROTOCOLS };
