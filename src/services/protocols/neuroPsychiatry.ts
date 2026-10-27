import type { DiseaseProtocolTemplate } from './types';
import { NEURO_PROTOCOLS } from './neuroProtocols';
import { PSYCH_PROTOCOLS } from './psychProtocols';

export const NEURO_PSYCHIATRY_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...NEURO_PROTOCOLS,
  ...PSYCH_PROTOCOLS,
];

export { NEURO_PROTOCOLS, PSYCH_PROTOCOLS };
