-- ============================================================================
-- MedRecord — 001_initial_schema.sql
-- Cloud schema for the Offline-First Multi-Tenant EHR.
--
-- Conventions (must match src/types/schema.ts):
--   * Primary keys are UUID v4 generated on the client (crypto.randomUUID()),
--     so offline-created rows upsert without ever needing a server round-trip.
--   * Every table carries tenant_id for multi-tenant isolation with RLS.
--   * Every table carries sync_status + created_at/updated_at to support the
--     Dexie -> Supabase sync engine.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Shared enum types
-- ---------------------------------------------------------------------------
create type subscription_plan as enum ('free', 'pro', 'enterprise');
create type dosage_form as enum ('Tab', 'Cap', 'Syr', 'Inj', 'Oint', 'Drop');
create type meal_timing as enum ('After Meal', 'Before Meal', 'With Meal', 'Anytime');
create type sync_status as enum ('synced', 'pending', 'failed');
create type gender as enum ('male', 'female', 'other');

-- ---------------------------------------------------------------------------
-- 1. tenants (clinic / doctor)
--    Isolation rule: a signed-in doctor can only touch rows whose
--    tenant_id equals their Supabase auth uid().
-- ---------------------------------------------------------------------------
create table if not exists tenants (
  id                    uuid primary key,
  tenant_id             uuid not null default uuid_generate_v4(),
  clinic_name           text not null,
  doctor_name           text not null,
  degrees               text not null default '',
  specialty             text not null default '',
  phone                 text not null default '',
  address               text not null default '',
  subscription_plan     subscription_plan not null default 'free',
  print_margin_top_mm   numeric not null default 12,
  print_margin_left_mm  numeric not null default 15,
  sync_status           sync_status not null default 'pending',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint tenants_tenant_id_key unique (tenant_id)
);

-- ---------------------------------------------------------------------------
-- 2. patients
-- ---------------------------------------------------------------------------
create table if not exists patients (
  id                        uuid primary key,
  tenant_id                 uuid not null references tenants (tenant_id) on delete cascade,
  patient_code              text not null,
  full_name                 text not null,
  age                       integer not null check (age >= 0 and age < 150),
  gender                    gender not null,
  phone                     text not null default '',
  blood_group               text not null default '',
  chronic_conditions        text[] not null default '{}',
  allergies                 text[] not null default '{}',
  medical_surgical_history  text not null default '',
  sync_status               sync_status not null default 'pending',
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint patients_unique_per_tenant unique (tenant_id, patient_code)
);

-- ---------------------------------------------------------------------------
-- 3. encounters (visits)
-- ---------------------------------------------------------------------------
create table if not exists encounters (
  id                   uuid primary key,
  tenant_id            uuid not null references tenants (tenant_id) on delete cascade,
  patient_id           uuid not null references patients (id) on delete cascade,
  visit_date           timestamptz not null default now(),
  chief_complaints     text[] not null default '{}',
  vitals               jsonb not null default '{}'::jsonb,
  clinical_findings    text not null default '',
  diagnosis            text[] not null default '{}',
  advice               text[] not null default '{}',
  follow_up_date       date,
  ai_suggested_notes   text,
  sync_status          sync_status not null default 'pending',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists idx_encounters_tenant on encounters (tenant_id);
create index if not exists idx_encounters_patient on encounters (patient_id);
create index if not exists idx_encounters_visit_date on encounters (visit_date desc);
create index if not exists idx_encounters_sync on encounters (sync_status);

-- ---------------------------------------------------------------------------
-- 4. prescription_items (one medicine line per row)
-- ---------------------------------------------------------------------------
create table if not exists prescription_items (
  id                     uuid primary key,
  tenant_id              uuid not null references tenants (tenant_id) on delete cascade,
  encounter_id           uuid not null references encounters (id) on delete cascade,
  patient_id             uuid not null references patients (id) on delete cascade,
  brand_name             text not null,
  generic_name           text not null default '',
  dosage_form            dosage_form not null default 'Tab',
  strength               text not null default '',
  schedule               text not null default '',
  meal_timing            meal_timing not null default 'Anytime',
  duration               text not null default '',
  special_instructions   text not null default '',
  sync_status            sync_status not null default 'pending',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint prescription_items_patient_match check (
    exists (
      select 1 from encounters e
      where e.id = encounter_id and e.patient_id = prescription_items.patient_id and e.tenant_id = prescription_items.tenant_id
    )
  )
);
create index if not exists idx_rx_items_tenant on prescription_items (tenant_id);
create index if not exists idx_rx_items_patient on prescription_items (patient_id);
create index if not exists idx_rx_items_encounter on prescription_items (encounter_id);
create index if not exists idx_rx_items_sync on prescription_items (sync_status);

-- ---------------------------------------------------------------------------
-- 5. investigation_reports
--    Files live in Supabase Storage; cloud_file_url references the object.
-- ---------------------------------------------------------------------------
create table if not exists investigation_reports (
  id                   uuid primary key,
  tenant_id            uuid not null references tenants (tenant_id) on delete cascade,
  patient_id           uuid not null references patients (id) on delete cascade,
  encounter_id         uuid references encounters (id) on delete set null,
  test_name            text not null,
  report_date          timestamptz not null default now(),
  cloud_file_url       text,
  extracted_metrics    jsonb not null default '{}'::jsonb,
  abnormality_flags    text[] not null default '{}',
  ai_summary           text,
  sync_status          sync_status not null default 'pending',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists idx_reports_tenant on investigation_reports (tenant_id);
create index if not exists idx_reports_patient on investigation_reports (patient_id);
create index if not exists idx_reports_encounter on investigation_reports (encounter_id);
create index if not exists idx_reports_sync on investigation_reports (sync_status);

-- ---------------------------------------------------------------------------
-- 6. medicine_catalog
--    Master reference data, tenant-scoped per architecture rule #1.
-- ---------------------------------------------------------------------------
create table if not exists medicine_catalog (
  id                 uuid primary key,
  tenant_id          uuid not null references tenants (tenant_id) on delete cascade,
  brand_name         text not null,
  generic_name       text not null default '',
  dosage_form        dosage_form not null default 'Tab',
  strength           text not null default '',
  manufacturer       text not null default '',
  contraindications  text[] not null default '{}',
  sync_status        sync_status not null default 'synced',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint medicine_unique_per_tenant unique (tenant_id, brand_name, strength)
);
create index if not exists idx_medicine_tenant on medicine_catalog (tenant_id);
create index if not exists idx_medicine_brand on medicine_catalog (brand_name);
create index if not exists idx_medicine_generic on medicine_catalog (generic_name);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['tenants', 'patients', 'encounters', 'prescription_items', 'investigation_reports', 'medicine_catalog']
  loop
    execute format(
      'drop trigger if exists trg_%s_updated_at on %I; create trigger trg_%s_updated_at before update on %I for each row execute function set_updated_at();',
      t, t, t, t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security — restrict every operation to the owning tenant:
-- auth.uid() = tenant_id (the signed-in doctor OWNS their tenant id).
-- ---------------------------------------------------------------------------
alter table tenants               enable row level security;
alter table patients              enable row level security;
alter table encounters            enable row level security;
alter table prescription_items    enable row level security;
alter table investigation_reports enable row level security;
alter table medicine_catalog      enable row level security;

do $$
declare t text;
begin
  foreach t in array array['tenants', 'patients', 'encounters', 'prescription_items', 'investigation_reports', 'medicine_catalog']
  loop
    execute format($f$
      drop policy if exists tenant_read on %I;
      create policy tenant_read on %I for select
        using (auth.uid() = tenant_id);

      drop policy if exists tenant_insert on %I;
      create policy tenant_insert on %I for insert
        with check (auth.uid() = tenant_id);

      drop policy if exists tenant_update on %I;
      create policy tenant_update on %I for update
        using (auth.uid() = tenant_id)
        with check (auth.uid() = tenant_id);

      drop policy if exists tenant_delete on %I;
      create policy tenant_delete on %I for delete
        using (auth.uid() = tenant_id);
    $f$, t, t, t, t, t, t, t, t);
  end loop;
end $$;
