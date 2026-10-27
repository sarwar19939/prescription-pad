import type { DiseaseProtocolTemplate } from './types';
import { MSK_SPINE_PROTOCOLS } from './mskSpine';
import { MSK_JOINTS_PROTOCOLS } from './mskJoints';

export const MUSCULOSKELETAL_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...MSK_SPINE_PROTOCOLS,
  ...MSK_JOINTS_PROTOCOLS,
];

export { MSK_SPINE_PROTOCOLS, MSK_JOINTS_PROTOCOLS };
