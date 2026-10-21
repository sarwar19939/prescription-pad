/**
 * MedRecord — local offline database (Dexie.js over IndexedDB).
 *
 * All reads and writes go through this database first (offline-first rule).
 * Every record carries `sync_status` ('pending' | 'synced' | 'failed') and a
 * `tenant_id` for multi-tenant isolation; primary keys are client-generated
 * UUID v4 so offline-created rows never collide with cloud rows.
 */
import Dexie, { type EntityTable } from 'dexie';

import type { DbSchema } from '@/types/schema';

export const LOCAL_DB_NAME = 'medrecord';

/** Dexie index schemes per table. Primary key is always `id` (UUID v4). */
const SCHEMA_V1: { [K in keyof DbSchema]: string } = {
  tenants: 'id, tenant_id, phone',
  patients: 'id, tenant_id, patient_code, phone, sync_status',
  encounters: 'id, tenant_id, patient_id, visit_date, sync_status',
  prescription_items: 'id, tenant_id, patient_id, encounter_id, sync_status',
  investigation_reports: 'id, tenant_id, patient_id, encounter_id, sync_status',
  medicine_catalog: 'id, tenant_id, brand_name, generic_name, sync_status',
};

export class ClinicLocalDB extends Dexie {
  tenants!: EntityTable<DbSchema['tenants'], 'id'>;
  patients!: EntityTable<DbSchema['patients'], 'id'>;
  encounters!: EntityTable<DbSchema['encounters'], 'id'>;
  prescription_items!: EntityTable<DbSchema['prescription_items'], 'id'>;
  investigation_reports!: EntityTable<DbSchema['investigation_reports'], 'id'>;
  medicine_catalog!: EntityTable<DbSchema['medicine_catalog'], 'id'>;

  constructor(dbName: string = LOCAL_DB_NAME) {
    super(dbName);
    this.version(1).stores(SCHEMA_V1);
  }
}

/** Singleton instance used across the app (must run in a browser context). */
export const db = new ClinicLocalDB();

/** All 6 table names, for generic iteration (sync engine, stats, wipe). */
export const TABLE_NAMES = Object.keys(SCHEMA_V1) as Array<keyof DbSchema>;
