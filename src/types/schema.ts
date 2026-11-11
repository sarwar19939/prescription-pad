/**
 * MedRecord — strict entity schema (source of truth for Dexie + Supabase).
 *
 * Every entity carries the sync/multi-tenancy base fields:
 *   - id: client-generated UUID v4 (crypto.randomUUID())
 *   - tenant_id: UUID — multi-tenancy isolation, required on EVERY table
 *   - created_at / updated_at: ISO 8601 strings
 *   - sync_status: 'synced' | 'pending' | 'failed'
 */

import type { Table } from 'dexie';

export type SyncStatus = 'synced' | 'pending' | 'failed';

/** Fields shared by every stored entity. */
export interface BaseRecord {
  id: UUID;
  tenant_id: UUID;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  sync_status: SyncStatus;
}

/** RFC 4122 UUID v4, generated on the client via crypto.randomUUID(). */
export type UUID = string;

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
export type DosageForm = 'Tab' | 'Cap' | 'Syr' | 'Inj' | 'Oint' | 'Drop' | 'Sachet' | 'Inhaler' | 'Supp';
export type MealTiming = 'After Meal' | 'Before Meal' | 'With Meal' | 'Anytime';
export type Gender = 'male' | 'female' | 'other';

/** Clinical vitals captured at a visit. */
export interface Vitals {
  bp: string;
  pulse: string;
  temp: string;
  weight: string;
  spo2: string;
}

/* ------------------------------------------------------------------ */
/* Entities                                                            */
/* ------------------------------------------------------------------ */

/** The clinic/doctor tenant. */
export interface Tenant extends BaseRecord {
  clinic_name: string;
  doctor_name: string;
  degrees: string;
  specialty: string;
  phone: string;
  address: string;
  subscription_plan: SubscriptionPlan;
  print_margin_top_mm: number;
  print_margin_left_mm: number;
  /** Phase 3: skip letterhead on print (for pre-printed pads). */
  hide_header_for_print?: boolean;
  reg_number?: string;
  ai_provider?: 'cloud' | 'local';
  ai_api_key?: string;
  nvidia_api_key?: string;
  ollama_base_url?: string;
}

/** A patient registered by a tenant. */
export interface Patient extends BaseRecord {
  patient_code: string;
  full_name: string;
  age: number;
  gender: Gender;
  phone: string;
  blood_group: string;
  chronic_conditions: string[];
  allergies: string[];
  medical_surgical_history: string;
}

/** A clinical visit (encounter) for a patient. */
export interface Encounter extends BaseRecord {
  patient_id: UUID;
  visit_date: string; // ISO 8601
  chief_complaints: string[];
  vitals: Vitals;
  clinical_findings: string;
  diagnosis: string[];
  advice: string[];
  follow_up_date: string | null; // ISO 8601 date
  ai_suggested_notes: string | null;
}

/** One medicine line on a prescription. */
export interface PrescriptionItem extends BaseRecord {
  encounter_id: UUID;
  patient_id: UUID;
  brand_name: string;
  generic_name: string;
  dosage_form: DosageForm;
  strength: string;
  schedule: string; // e.g. '1+0+1'
  meal_timing: MealTiming;
  duration: string; // e.g. '7 Days'
  special_instructions: string;
}

/** An uploaded lab/imaging report for a patient (optionally an encounter). */
export interface InvestigationReport extends BaseRecord {
  patient_id: UUID;
  encounter_id: UUID | null;
  test_name: string;
  report_date: string; // ISO 8601
  /** Raw report blob cached locally (never synced to SQL — files go to Storage). */
  local_file_blob?: Blob;
  cloud_file_url: string | null;
  extracted_metrics: Record<string, string | number>;
  abnormality_flags: string[];
  ai_summary: string | null;
}

/**
 * Global medicine reference catalog.
 * tenant_id is required per architecture rule #1 (multi-tenancy on every
 * table); the seeded master catalog lives under the default tenant and is
 * copied per-tenant when clinics go multi-tenant.
 */
export interface MedicineCatalog extends BaseRecord {
  brand_name: string;
  generic_name: string;
  dosage_form: DosageForm;
  strength: string;
  manufacturer: string;
  contraindications: string[];
}

export type AgeGroupCategory = 'infant' | 'child' | 'adolescent' | 'adult' | 'elderly' | 'all';

export interface TemplateMedicineItem {
  brand_name: string;
  generic_name: string;
  dosage_form: DosageForm | string;
  strength: string;
  schedule: string;
  meal_timing: MealTiming | string;
  duration: string;
  special_instructions?: string;
}

/** Doctor custom and customizable disease prescription template. */
export interface PrescriptionTemplate extends BaseRecord {
  title: string;
  title_bn: string;
  category: string; // System: Respiratory, GI, Fever, Cardio, Pediatrics, Dermatology, etc.
  disease_group: string; // e.g. Pneumonia, Fever, Diarrhea, Asthma, Dengue, PUD
  age_group: AgeGroupCategory;
  age_range_label?: string; // e.g. "১ - ৫ বছর"
  description?: string;
  description_bn?: string;
  diagnosis: string[];
  chief_complaints?: string[];
  medicines: TemplateMedicineItem[];
  advice: string[];
  investigations?: string[];
  is_custom?: boolean;
}

/* ------------------------------------------------------------------ */
/* Registry: map of Dexie table name -> entity record type             */
/* ------------------------------------------------------------------ */

export interface DbSchema {
  tenants: Tenant;
  patients: Patient;
  encounters: Encounter;
  prescription_items: PrescriptionItem;
  investigation_reports: InvestigationReport;
  medicine_catalog: MedicineCatalog;
  prescription_templates: PrescriptionTemplate;
}

/** Exposed for typing Dexie tables. */
export type AnyRecord =
  | Tenant
  | Patient
  | Encounter
  | PrescriptionItem
  | InvestigationReport
  | MedicineCatalog
  | PrescriptionTemplate;

export type { Table };
