import type { DiseaseProtocolTemplate } from './types';
import { GYNAE_INFECTIONS_PROTOCOLS } from './gynaeInfections';
import { GYNAE_REPRODUCTIVE_PROTOCOLS } from './gynaeReproductive';

export const GYNECOLOGY_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...GYNAE_INFECTIONS_PROTOCOLS,
  ...GYNAE_REPRODUCTIVE_PROTOCOLS,
];

export { GYNAE_INFECTIONS_PROTOCOLS, GYNAE_REPRODUCTIVE_PROTOCOLS };
