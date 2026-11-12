/**
 * ClinicalAutocompleteService — Instant 0ms fuzzy search for Chief Complaints,
 * Patient History, and Physical Examination (O/E).
 * Integrates official DGHS presets with live Dexie encounter/patient draft records.
 */
import { db } from '@/db/localDb';
import {
  ALL_CHIEF_COMPLAINTS_BY_CATEGORY,
  HISTORY_CATEGORIES,
  OE_CATEGORIES,
  TOP_CHIEF_COMPLAINTS,
} from '@/features/consultation/rx-builder/clinical-presets';
import { TOP_OE_CHIPS } from '@/features/consultation/rx-builder/clinical-oe-section';
import { getQualifierKey } from '@/features/consultation/rx-builder/symptom-qualifiers';

export interface ClinicalSuggestionItem {
  id: string;
  text: string;
  label: string;
  category?: string;
  source: 'preset' | 'draft';
  type?: 'chronic' | 'allergy' | 'drug' | 'social' | 'gynae' | 'complaint' | 'oe';
  hasQualifier?: boolean;
}

/** Score a candidate string against a search term */
function scoreMatch(candidate: string, query: string): number {
  const c = candidate.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  if (c === q) return 100;
  if (c.startsWith(q)) return 80;
  
  // Word start match (e.g. "amen" matches "Secondary Amenorrhea")
  const words = c.split(/[\s,()/:+-]+/);
  if (words.some((w) => w.startsWith(q))) return 70;
  if (c.includes(q)) return 50;

  // Common clinical abbreviations
  if (q === 'amen' && c.includes('amenorrhea')) return 90;
  if (q === 'htn' && (c.includes('hypertension') || c.includes('htn'))) return 90;
  if (q === 'dm' && (c.includes('diabetes') || c.includes('dm'))) return 90;
  if (q === 'pud' && c.includes('peptic')) return 90;
  if (q === 'cns' && c.includes('cns')) return 90;
  if (q === 'ch' && c.includes('chest')) return 85;
  if (q === 'ab' && c.includes('abdomen')) return 85;
  if (q === 'ja' && c.includes('jaundice')) return 85;
  if (q === 'an' && c.includes('anemia')) return 85;
  if (q === 'bp' && c.includes('blood pressure')) return 85;

  return 0;
}

/** Search chief complaints (presets + previous encounters in Dexie) */
export async function searchComplaintSuggestions(
  query: string
): Promise<ClinicalSuggestionItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const candidates: ClinicalSuggestionItem[] = [];
  const seen = new Set<string>();

  // 1. Static presets
  for (const c of TOP_CHIEF_COMPLAINTS) {
    const key = c.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      candidates.push({
        id: `preset-top-${key}`,
        text: c,
        label: c,
        category: 'সাধারণ উপসর্গ',
        source: 'preset',
        type: 'complaint',
        hasQualifier: Boolean(getQualifierKey(c)),
      });
    }
  }

  for (const group of ALL_CHIEF_COMPLAINTS_BY_CATEGORY) {
    for (const item of group.items) {
      const key = item.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        candidates.push({
          id: `preset-cat-${key}`,
          text: item,
          label: item,
          category: group.category.split(' ')[0],
          source: 'preset',
          type: 'complaint',
          hasQualifier: Boolean(getQualifierKey(item)),
        });
      }
    }
  }

  // 2. Draft / past encounter items from Dexie
  try {
    const recent = await db.encounters.orderBy('visit_date').reverse().limit(30).toArray();
    for (const enc of recent) {
      for (const cc of enc.chief_complaints || []) {
        const raw = cc.split(/[-:(]/)[0].trim();
        const key = raw.toLowerCase();
        if (raw && !seen.has(key)) {
          seen.add(key);
          candidates.push({
            id: `draft-cc-${key}`,
            text: raw,
            label: raw,
            category: 'ড্রাফট / পূর্বে ব্যবহৃত',
            source: 'draft',
            type: 'complaint',
            hasQualifier: Boolean(getQualifierKey(raw)),
          });
        }
      }
    }
  } catch {
    // Graceful fallback if Dexie isn't ready
  }

  return candidates
    .map((item) => ({ item, score: scoreMatch(item.text, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ item }) => item);
}

/** Search history items (chronic illness, allergy, gynae, drug, past Dexie records) */
export async function searchHistorySuggestions(
  query: string
): Promise<ClinicalSuggestionItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const candidates: ClinicalSuggestionItem[] = [];
  const seen = new Set<string>();

  for (const cat of HISTORY_CATEGORIES) {
    for (const item of cat.items) {
      const key = item.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        candidates.push({
          id: `preset-hist-${key}`,
          text: item,
          label: item,
          category: cat.title.split(' ')[0],
          source: 'preset',
          type: cat.type as any,
          hasQualifier: cat.type === 'chronic' || cat.type === 'gynae' || Boolean(getQualifierKey(item)),
        });
      }
    }
  }

  // Draft / previous patient records
  try {
    const patients = await db.patients.limit(30).toArray();
    for (const p of patients) {
      for (const cond of p.chronic_conditions || []) {
        const base = cond.split(/[-:(]/)[0].trim();
        const key = base.toLowerCase();
        if (base && !seen.has(key)) {
          seen.add(key);
          candidates.push({
            id: `draft-pat-${key}`,
            text: base,
            label: base,
            category: 'ড্রাফট / রোগীর হিস্ট্রি',
            source: 'draft',
            type: 'chronic',
            hasQualifier: true,
          });
        }
      }
      for (const allg of p.allergies || []) {
        const key = allg.toLowerCase();
        if (allg && !seen.has(key)) {
          seen.add(key);
          candidates.push({
            id: `draft-allg-${key}`,
            text: allg,
            label: allg,
            category: 'অ্যালার্জি হিস্ট্রি',
            source: 'draft',
            type: 'allergy',
          });
        }
      }
    }
  } catch {}

  return candidates
    .map((item) => ({ item, score: scoreMatch(item.text, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ item }) => item);
}

/** Search Physical Examination (O/E) findings (presets + draft encounter notes) */
export async function searchOeSuggestions(
  query: string
): Promise<ClinicalSuggestionItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const candidates: ClinicalSuggestionItem[] = [];
  const seen = new Set<string>();

  for (const chip of TOP_OE_CHIPS) {
    const key = chip.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      candidates.push({
        id: `preset-oe-top-${key}`,
        text: chip,
        label: chip,
        category: 'সাধারণ O/E',
        source: 'preset',
        type: 'oe',
      });
    }
  }

  for (const cat of OE_CATEGORIES) {
    for (const item of cat.items) {
      const key = item.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        candidates.push({
          id: `preset-oe-cat-${key}`,
          text: item,
          label: item,
          category: cat.title.split(' ')[0],
          source: 'preset',
          type: 'oe',
        });
      }
    }
  }

  // Draft encounter findings from Dexie
  try {
    const recent = await db.encounters.orderBy('visit_date').reverse().limit(30).toArray();
    for (const enc of recent) {
      if (!enc.clinical_findings) continue;
      const findings = enc.clinical_findings.split(/[\n,;]+/).map((s) => s.trim());
      for (const f of findings) {
        const key = f.toLowerCase();
        if (f.length > 2 && !seen.has(key)) {
          seen.add(key);
          candidates.push({
            id: `draft-oe-${key}`,
            text: f,
            label: f,
            category: 'ড্রাফট / পূর্বে সেভকৃত',
            source: 'draft',
            type: 'oe',
          });
        }
      }
    }
  } catch {}

  return candidates
    .map((item) => ({ item, score: scoreMatch(item.text, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ item }) => item);
}
