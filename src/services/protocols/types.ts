/**
 * Clinical Disease Treatment Protocol & Dosing Type Definitions.
 */
import type { DosageForm, MealTiming } from '@/types/schema';

export interface ProtocolMedicineDef {
  brand_name: string;
  generic_name: string;
  adult: {
    dosage_form: DosageForm;
    strength: string;
    schedule: string;
    meal_timing: MealTiming;
    duration: string;
    special_instructions: string;
  };
  pediatric?: {
    dosage_form: DosageForm;
    strength: string;
    schedule: string;
    meal_timing: MealTiming;
    duration: string;
    special_instructions: string;
    perKgDoseMg?: number;
    concentrationMgPerMl?: number;
  };
}

export type ProtocolCategory =
  | 'Infectious Diseases'
  | 'Gastrointestinal & Liver'
  | 'Respiratory & Chest'
  | 'Cardiovascular & Vaso'
  | 'Endocrine & Metabolic'
  | 'Skin & Dermatology'
  | 'Pediatrics'
  | 'ENT & Eye'
  | 'Musculoskeletal & Joint'
  | 'Nephrology & Urology'
  | 'Neurology & Psychiatry'
  | 'Gynecology & Obstetrics';

export interface DiseaseProtocolTemplate {
  id: string;
  title: string;
  titleBn: string;
  category: ProtocolCategory;
  diagnosisMatch: string[];
  description: string;
  descriptionBn: string;
  medicines: ProtocolMedicineDef[];
  investigations?: string[];
  adviceBn: string[];
}
