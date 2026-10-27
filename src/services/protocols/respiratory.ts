import type { DiseaseProtocolTemplate } from './types';
import { RESP_OBSTRUCTIVE_PROTOCOLS } from './respObstructive';
import { RESP_INFECTIONS_PROTOCOLS } from './respInfections';

export const RESPIRATORY_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...RESP_OBSTRUCTIVE_PROTOCOLS,
  ...RESP_INFECTIONS_PROTOCOLS,
];

export { RESP_OBSTRUCTIVE_PROTOCOLS, RESP_INFECTIONS_PROTOCOLS };
