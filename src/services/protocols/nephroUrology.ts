import type { DiseaseProtocolTemplate } from './types';
import { NEPHRO_RENAL_PROTOCOLS } from './nephroRenal';
import { UROLOGY_LOWER_PROTOCOLS } from './urologyLower';

export const NEPHRO_UROLOGY_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...NEPHRO_RENAL_PROTOCOLS,
  ...UROLOGY_LOWER_PROTOCOLS,
];

export { NEPHRO_RENAL_PROTOCOLS, UROLOGY_LOWER_PROTOCOLS };
