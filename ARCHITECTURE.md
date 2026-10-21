# ARCHITECTURE — MedRecord (Offline-First, Multi-Tenant EHR)

An offline-first, multi-tenant EHR + Smart Prescription SaaS for doctors.
Doctors work in a clinic; connectivity is not guaranteed. Every read/write
hits the local device first; the cloud is a sync target, not a dependency.

## Tech Stack (Locked)

| Layer         | Choice                                                            |
| ------------- | ----------------------------------------------------------------- |
| Framework     | Next.js (App Router) + TypeScript (strict)                        |
| Styling       | Tailwind CSS v4 + shadcn/ui (radix-nova preset) + Lucide Icons     |
| Local DB      | Dexie.js over IndexedDB — 0ms offline reads/writes                 |
| Cloud/Auth    | Supabase — PostgreSQL, Row Level Security (RLS), Storage           |
| Desktop       | Tauri (optional); Next.js must stay compatible with static/local execution |
| AI            | Vercel AI SDK / Google Gemini (cloud) with Ollama fallback (local) |

## Non-Negotiable Rules

### 1. Multi-tenancy first
Every database table — local (Dexie) and cloud (Supabase) — carries
`tenant_id: string (UUID)`. Supabase enforces isolation with RLS policies
keyed on `tenant_id` from the user's JWT claims; Dexie indexes `tenant_id`
and all queries filter by it.

### 2. Offline-first data path
UI actions never call Supabase directly.

```
User action  ->  write Dexie (sync_status: 'pending')  ->  UI re-renders from Dexie
                  sync engine (later phase) drains 'pending' rows to Supabase
                  on reconnect -> marks them 'synced'
```

- Reads: Dexie only. A screen must render fully offline.
- Writes: Dexie first, tagged `sync_status: 'pending' | 'synced'`.
- Conflict policy: last-write-wins by `updated_at` (future phase).

### 3. UUIDs everywhere
Primary keys are client-generated UUID v4 via `crypto.randomUUID()`.
Offline-created records can never collide with cloud-generated IDs, so
sync becomes an upsert, and no server round-trip is needed to create a row.

### 4. Modular code
- No file exceeds 300 lines.
- Database schemas live in `src/lib/db/` (schema, migrations, typed tables).
- Reusable UI lives in `src/components/`; shadcn primitives in `src/components/ui/`.
- Domain logic is colocated per feature in `src/features/<domain>/`.
- AI services live in `src/services/ai/` (one module per provider: gemini, ollama).

### 5. Strict phase scope
Only implement what the current prompt requests. Verify zero TypeScript
errors (`npx tsc --noEmit`) and a clean production build before delivery.

## Directory Layout

```
src/
  app/            # Next.js App Router pages & layouts
  components/
    ui/           # shadcn/ui primitives
  features/       # Feature modules (UI + hooks per domain)
  hooks/          # Shared React hooks
  lib/
    db/           # Dexie schema, migrations, repositories
    supabase/     # Supabase clients & config stubs
    utils.ts      # shadcn cn() helper
  services/
    ai/           # Gemini + Ollama provider modules
```

## Environment Variables (future phases)

| Var                          | Used by   | Purpose                    |
| ---------------------------- | --------- | -------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`   | supabase  | Project URL                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | supabase | Public anon key           |
| `GEMINI_API_KEY`             | server-only | Google Gemini API         |
| `OLLAMA_BASE_URL`            | local fallback | Default `http://localhost:11434` |

## Conventions
- Client components are explicitly marked `"use client"` where needed.
- All entity types live next to their Dexie schema module and are re-exported
  through `src/features/<domain>/types.ts` where consumed by UI.
- Sync fields required on every synced entity: `id`, `tenant_id`,
  `sync_status`, `created_at`, `updated_at`.
