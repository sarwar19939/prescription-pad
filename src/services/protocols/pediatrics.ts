import type { DiseaseProtocolTemplate } from './types';
import { PEDS_COMMON_PROTOCOLS } from './pedsCommon';
import { PEDS_INFECTIONS_PROTOCOLS } from './pedsInfections';

export const PEDIATRICS_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...PEDS_COMMON_PROTOCOLS,
  ...PEDS_INFECTIONS_PROTOCOLS,
];

export { PEDS_COMMON_PROTOCOLS, PEDS_INFECTIONS_PROTOCOLS };
