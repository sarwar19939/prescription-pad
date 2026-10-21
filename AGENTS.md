# MedRecord — Offline-First Multi-Tenant EHR

## Project Overview
We are building an Offline-First, Multi-Tenant EHR (Electronic Health Record) and Smart Prescription SaaS application for doctors.

## Tech Stack (Strict)
- Framework: Next.js (App Router) with TypeScript
- Styling: Tailwind CSS + shadcn/ui + Lucide Icons
- Local Offline Database: Dexie.js (IndexedDB wrapper for instant 0ms offline reads/writes)
- Cloud Backend & Auth: Supabase (PostgreSQL + Row Level Security + Storage)
- Desktop Packaging: Tauri (optional wrapper, keep Next.js compatible with static/local execution)
- AI Integration: Vercel AI SDK / Google Gemini API (Cloud) + Ollama fallback (Local)

## Non-Negotiable Architecture Rules
1. MULTI-TENANCY FIRST: Every single database table (local and cloud) MUST include tenant_id (UUID) to isolate clinic/doctor data for future SaaS scaling.
2. OFFLINE-FIRST: Every UI action (creating a patient, writing a prescription, viewing history) MUST read and write to the local Dexie.js database first, and mark records with sync_status: 'pending' | 'synced'.
3. UUIDs EVERYWHERE: Generate UUID v4 on the client side (crypto.randomUUID()) for all primary keys (id) so offline records never collide when syncing to the cloud later.
4. MODULAR CODE: Never write monolithic files over 300 lines. Separate database schemas, UI components, and AI services into clean directories.
5. DO NOT skip ahead to future phases. Only implement what is requested in the current prompt and verify there are zero TypeScript errors.

## Where things live
- `src/db/` — local Dexie database (`localDb.ts`), seed (`seed.ts`), and the Supabase cloud client (`supabase.ts`)
- `src/types/schema.ts` — strict TypeScript interfaces for all entities (source of truth for local + cloud)
- `src/components/ui/` — shadcn/ui primitives (add with `npx shadcn@latest add <component>`)
- `src/services/` — AI + sync service modules (future phases)
- `supabase/migrations/` — PostgreSQL schema migrations with RLS policies

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
