/**
 * MedRecord — first-run seeding for the local Dexie database.
 * Populates a default doctor/tenant, the 30-item medicine catalog, and two
 * demo patients with past visits + prescriptions so the app is testable
 * immediately. Idempotent: running twice is a no-op.
 */
import {
  DEFAULT_TENANT_ID,
  MEDICINE_SEEDS,
  PATIENT_SEEDS,
  type EncounterSeed,
} from './seedData';
import { db } from './localDb';
import type {
  Encounter,
  MedicineCatalog,
  Patient,
  PrescriptionItem,
  Tenant,
} from '@/types/schema';

const DEFAULT_TENANT: Omit<Tenant, 'id' | 'created_at' | 'updated_at'> = {
  tenant_id: DEFAULT_TENANT_ID,
  sync_status: 'synced',
  clinic_name: 'MedRecord Demo Clinic',
  doctor_name: 'Dr. A. Verma',
  degrees: 'MBBS, MD (Internal Medicine)',
  specialty: 'General Physician',
  phone: '+91-90000-00001',
  address: '12 Clay Road, Kolkata 700001',
  subscription_plan: 'free',
  print_margin_top_mm: 12,
  print_margin_left_mm: 15,
};

function nowIso(): string {
  return new Date().toISOString();
}

interface SeedSummary {
  tenants: number;
  medicines: number;
  patients: number;
  encounters: number;
  prescription_items: number;
}

/**
 * Seeds the local database once. Returns per-table counts.
 * Safe to call on every app start: if the default tenant already exists
 * with seeded patients, nothing is written.
 */
export async function seedInitialData(): Promise<SeedSummary> {
  const existingTenant = await db.tenants.get(DEFAULT_TENANT_ID);
  const existingPatients = await db.patients
    .where('tenant_id')
    .equals(DEFAULT_TENANT_ID)
    .count();

  if (existingTenant && existingPatients >= PATIENT_SEEDS.length) {
    return snapshotCounts();
  }

  const ts = nowIso();

  const tenantRecord: Tenant = {
    ...DEFAULT_TENANT,
    id: existingTenant?.id ?? DEFAULT_TENANT_ID,
    created_at: existingTenant?.created_at ?? ts,
    updated_at: ts,
  };

  const medicines: MedicineCatalog[] = MEDICINE_SEEDS.map((m) => ({
    ...m,
    id: crypto.randomUUID(),
    tenant_id: DEFAULT_TENANT_ID,
    created_at: ts,
    updated_at: ts,
    sync_status: 'synced',
  }));

  const patients: Patient[] = [];
  const encounters: Encounter[] = [];
  const items: PrescriptionItem[] = [];

  for (const p of PATIENT_SEEDS) {
    let patient: Patient | undefined;
    const existingP = await db.patients
      .where('patient_code')
      .equals(p.patient_code)
      .and((x) => x.tenant_id === DEFAULT_TENANT_ID)
      .first();

    if (existingP) {
      patient = existingP;
    } else {
      patient = {
        ...p,
        id: crypto.randomUUID(),
        tenant_id: DEFAULT_TENANT_ID,
        created_at: ts,
        updated_at: ts,
        sync_status: 'synced',
      };
      patients.push(patient);
    }

    for (const e of p.encounters) {
      const existingE = await db.encounters
        .where('patient_id')
        .equals(patient.id)
        .and((x) => x.visit_date === e.visit_date)
        .first();
      let encounter: Encounter;
      if (existingE) {
        encounter = existingE;
      } else {
        encounter = buildEncounter(e, patient.id, ts);
        encounters.push(encounter);
      }
      for (const item of e.prescriptions) {
        const existingI = await db.prescription_items
          .where('encounter_id')
          .equals(encounter.id)
          .and((x) => x.brand_name === item.brand_name)
          .first();
        if (!existingI) {
          items.push(buildPrescription(item, encounter, patient.id, ts));
        }
      }
    }
  }

  await db.transaction('rw', db.tenants, db.medicine_catalog, db.patients, db.encounters, db.prescription_items, async () => {
    await db.tenants.put(tenantRecord);
    if (medicines.length) await db.medicine_catalog.bulkAdd(medicines);
    if (patients.length) await db.patients.bulkAdd(patients);
    if (encounters.length) await db.encounters.bulkAdd(encounters);
    if (items.length) await db.prescription_items.bulkAdd(items);
  });

  return snapshotCounts();
}

function buildEncounter(e: EncounterSeed, patientId: string, ts: string): Encounter {
  return {
    id: crypto.randomUUID(),
    tenant_id: DEFAULT_TENANT_ID,
    patient_id: patientId,
    visit_date: e.visit_date,
    chief_complaints: e.chief_complaints,
    vitals: e.vitals,
    clinical_findings: e.clinical_findings,
    diagnosis: e.diagnosis,
    advice: e.advice,
    follow_up_date: e.follow_up_date,
    ai_suggested_notes: null,
    created_at: ts,
    updated_at: ts,
    sync_status: 'synced',
  };
}

function buildPrescription(
  seed: EncounterSeed['prescriptions'][number],
  encounter: Encounter,
  patientId: string,
  ts: string,
): PrescriptionItem {
  return {
    ...seed,
    id: crypto.randomUUID(),
    tenant_id: DEFAULT_TENANT_ID,
    encounter_id: encounter.id,
    patient_id: patientId,
    created_at: ts,
    updated_at: ts,
    sync_status: 'synced',
  };
}

async function snapshotCounts(): Promise<SeedSummary> {
  const t = DEFAULT_TENANT_ID;
  return {
    tenants: await db.tenants.where('tenant_id').equals(t).count(),
    medicines: await db.medicine_catalog.where('tenant_id').equals(t).count(),
    patients: await db.patients.where('tenant_id').equals(t).count(),
    encounters: await db.encounters.where('tenant_id').equals(t).count(),
    prescription_items: await db.prescription_items.where('tenant_id').equals(t).count(),
  };
}
