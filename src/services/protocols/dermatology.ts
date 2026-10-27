import type { DiseaseProtocolTemplate } from './types';
import { DERM_INFECTIONS_PROTOCOLS } from './dermInfections';
import { DERM_INFLAMMATORY_PROTOCOLS } from './dermInflammatory';

export const DERMATOLOGY_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...DERM_INFECTIONS_PROTOCOLS,
  ...DERM_INFLAMMATORY_PROTOCOLS,
];

export { DERM_INFECTIONS_PROTOCOLS, DERM_INFLAMMATORY_PROTOCOLS };
