import type { DiseaseProtocolTemplate } from './types';
import { ENT_PROTOCOLS } from './entProtocols';
import { EYE_PROTOCOLS } from './eyeProtocols';

export const ENT_EYE_PROTOCOLS: DiseaseProtocolTemplate[] = [
  ...ENT_PROTOCOLS,
  ...EYE_PROTOCOLS,
];

export { ENT_PROTOCOLS, EYE_PROTOCOLS };
