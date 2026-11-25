-- ============================================================================
-- MedRecord — 002_schema_sync_and_fixes.sql
-- Synchronizes Supabase cloud schema with TypeScript interfaces (schema.ts).
--
-- Fixes:
-- 1. Expands dosage_form enum and makes meal_timing resilient to Bengali strings.
-- 2. Adds missing columns to patients (age_months, age_days, age_unit, address, drug_history).
-- 3. Adds missing columns to encounters (follow_up_text, drug_history).
-- 4. Adds missing columns to prescription_items (route, tapering_steps).
-- 5. Adds missing Rx pad branding and layout customization columns to tenants.
-- ============================================================================

-- 1. Extend dosage_form enum values
alter type dosage_form add value if not exists 'Cream';
alter type dosage_form add value if not exists 'Gel';
alter type dosage_form add value if not exists 'Lotion';
alter type dosage_form add value if not exists 'Sachet';
alter type dosage_form add value if not exists 'Inhaler';
alter type dosage_form add value if not exists 'Supp';
alter type dosage_form add value if not exists 'Pessary';
alter type dosage_form add value if not exists 'Susp';
alter type dosage_form add value if not exists 'Spray';
alter type dosage_form add value if not exists 'Solution';

-- Convert meal_timing column in prescription_items to text to safely support both English & Bengali timing
alter table prescription_items alter column meal_timing drop default;
alter table prescription_items alter column meal_timing type text using meal_timing::text;
alter table prescription_items alter column meal_timing set default 'Anytime';

-- 2. Missing columns on patients
alter table patients add column if not exists age_months integer;
alter table patients add column if not exists age_days integer;
alter table patients add column if not exists age_unit text not null default 'years';
alter table patients add column if not exists address text not null default '';
alter table patients add column if not exists drug_history text[] not null default '{}';

-- 3. Missing columns on encounters
alter table encounters add column if not exists follow_up_text text;
alter table encounters add column if not exists drug_history text[] not null default '{}';

-- 4. Missing columns on prescription_items
alter table prescription_items add column if not exists route text not null default '';
alter table prescription_items add column if not exists tapering_steps jsonb not null default '[]'::jsonb;

-- 5. Missing customization columns on tenants
alter table tenants add column if not exists reg_number text not null default '';
alter table tenants add column if not exists ai_provider text not null default 'cloud';
alter table tenants add column if not exists ai_api_key text default '';
alter table tenants add column if not exists nvidia_api_key text default '';
alter table tenants add column if not exists ollama_base_url text default '';
alter table tenants add column if not exists pad_layout_style text not null default 'modern_teal';
alter table tenants add column if not exists header_alignment text not null default 'split';
alter table tenants add column if not exists column_ratio text not null default '30_70';
alter table tenants add column if not exists pad_font_size text not null default 'standard';
alter table tenants add column if not exists doctor_name_size text not null default 'large';
alter table tenants add column if not exists clinic_name_size text not null default 'large';
alter table tenants add column if not exists degrees_display_mode text not null default 'paragraph';
alter table tenants add column if not exists logo_url text default '';
alter table tenants add column if not exists logo_size text default 'md';
alter table tenants add column if not exists logo_position text default 'left';
alter table tenants add column if not exists logo_grayscale boolean not null default false;
alter table tenants add column if not exists watermark_enabled boolean not null default false;
alter table tenants add column if not exists watermark_type text default 'logo';
alter table tenants add column if not exists watermark_placement text default 'center';
alter table tenants add column if not exists watermark_image_url text default '';
alter table tenants add column if not exists watermark_text text default '';
alter table tenants add column if not exists watermark_opacity numeric default 0.08;
alter table tenants add column if not exists watermark_color_mode text default 'grayscale';
alter table tenants add column if not exists watermark_color text default '#0d9488';
alter table tenants add column if not exists print_color_mode text not null default 'full_color';
alter table tenants add column if not exists visiting_hours text default '';
alter table tenants add column if not exists special_notes text default '';
alter table tenants add column if not exists hide_header_for_print boolean not null default false;
alter table tenants add column if not exists hide_footer_for_print boolean not null default false;
alter table tenants add column if not exists paper_size_preset text not null default 'a4';
alter table tenants add column if not exists custom_paper_width_mm numeric;
alter table tenants add column if not exists custom_paper_height_mm numeric;
