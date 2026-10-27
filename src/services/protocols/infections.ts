import type { DiseaseProtocolTemplate } from './types';
import { INFECTIONS_GENERAL } from './infectionsGeneral';
import { INFECTIONS_TROPICAL } from './infectionsTropical';

export const INFECTION_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...INFECTIONS_GENERAL,
  ...INFECTIONS_TROPICAL,
];

export { INFECTIONS_GENERAL, INFECTIONS_TROPICAL };
