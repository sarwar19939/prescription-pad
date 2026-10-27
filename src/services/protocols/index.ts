/**
 * Master Clinical Disease Treatment Protocols Aggregator.
 * Covers 150+ comprehensive evidence-based clinical templates tailored for
 * Bangladesh DGHS / BMDC / icddr,b outpatient practice and MedEx formulations.
 */
import type { DiseaseProtocolTemplate } from './types';
import { INFECTION_PROTOCOLS } from './infections';
import { GASTROINTESTINAL_PROTOCOLS } from './gastrointestinal';
import { RESPIRATORY_PROTOCOLS } from './respiratory';
import { CARDIOVASCULAR_PROTOCOLS } from './cardiovascular';
import { ENDOCRINE_PROTOCOLS } from './endocrine';
import { DERMATOLOGY_PROTOCOLS } from './dermatology';
import { PEDIATRICS_PROTOCOLS } from './pediatrics';
import { ENT_EYE_PROTOCOLS } from './entEye';
import { MUSCULOSKELETAL_PROTOCOLS } from './musculoskeletal';
import { NEPHRO_UROLOGY_PROTOCOLS } from './nephroUrology';
import { NEURO_PSYCHIATRY_PROTOCOLS } from './neuroPsychiatry';
import { GYNECOLOGY_PROTOCOLS } from './gynecology';
import { GERIATRICS_GENERAL_PROTOCOLS } from './geriatricsGeneral';
import { ACUTE_EMERGENCY_PROTOCOLS } from './acuteEmergencyOpd';

export const DISEASE_PROTOCOL_TEMPLATES: DiseaseProtocolTemplate[] = [
  ...INFECTION_PROTOCOLS,
  ...GASTROINTESTINAL_PROTOCOLS,
  ...RESPIRATORY_PROTOCOLS,
  ...CARDIOVASCULAR_PROTOCOLS,
  ...ENDOCRINE_PROTOCOLS,
  ...DERMATOLOGY_PROTOCOLS,
  ...PEDIATRICS_PROTOCOLS,
  ...ENT_EYE_PROTOCOLS,
  ...MUSCULOSKELETAL_PROTOCOLS,
  ...NEPHRO_UROLOGY_PROTOCOLS,
  ...NEURO_PSYCHIATRY_PROTOCOLS,
  ...GYNECOLOGY_PROTOCOLS,
  ...GERIATRICS_GENERAL_PROTOCOLS,
  ...ACUTE_EMERGENCY_PROTOCOLS,
];

export * from './types';
export {
  INFECTION_PROTOCOLS,
  GASTROINTESTINAL_PROTOCOLS,
  RESPIRATORY_PROTOCOLS,
  CARDIOVASCULAR_PROTOCOLS,
  ENDOCRINE_PROTOCOLS,
  DERMATOLOGY_PROTOCOLS,
  PEDIATRICS_PROTOCOLS,
  ENT_EYE_PROTOCOLS,
  MUSCULOSKELETAL_PROTOCOLS,
  NEPHRO_UROLOGY_PROTOCOLS,
  NEURO_PSYCHIATRY_PROTOCOLS,
  GYNECOLOGY_PROTOCOLS,
  GERIATRICS_GENERAL_PROTOCOLS,
  ACUTE_EMERGENCY_PROTOCOLS,
};
