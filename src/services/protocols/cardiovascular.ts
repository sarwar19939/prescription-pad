import type { DiseaseProtocolTemplate } from './types';
import { CARDIO_HYPERTENSION_PROTOCOLS } from './cardioHypertension';
import { CARDIO_HEART_PROTOCOLS } from './cardioHeart';

export const CARDIOVASCULAR_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...CARDIO_HYPERTENSION_PROTOCOLS,
  ...CARDIO_HEART_PROTOCOLS,
];

export { CARDIO_HYPERTENSION_PROTOCOLS, CARDIO_HEART_PROTOCOLS };
