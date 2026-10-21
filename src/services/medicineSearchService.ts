/**
 * High-Precision Ranked Medicine Search Engine.
 *
 * Implements multi-token relevance scoring so that:
 * 1. Exact matches appear first (e.g. "Napa" -> Napa 500mg).
 * 2. Prefix word matches appear next (e.g. "Napa Extra", "Napa Rapid").
 * 3. Multi-word searches match across Brand + Strength + Form (e.g. "Napa 500", "Seclo 20").
 * 4. High-quality Bangladeshi manufacturers (Square, Beximco, Incepta, Renata) get appropriate clinical priority.
 */
import { db } from '@/db/localDb';
import type { MedicineCatalog } from '@/types/schema';

const TOP_MANUFACTURERS = new Set([
  'square pharmaceuticals ltd.',
  'beximco pharmaceuticals ltd.',
  'incepta pharmaceuticals ltd.',
  'renata limited',
  'healthcare pharmaceuticals ltd.',
  'acme laboratories ltd.',
  'opsonin pharma ltd.',
  'eskayef pharmaceuticals ltd.',
  'aci limited',
  'aristopharma ltd.',
  'drug international ltd.',
  'popular pharmaceuticals ltd.',
]);

export interface ScoredMedicine {
  medicine: MedicineCatalog;
  score: number;
}

/**
 * Calculates a multi-factor clinical relevance score for a medicine candidate against search tokens.
 */
export function scoreMedicine(
  m: MedicineCatalog,
  rawQuery: string,
  tokens: string[],
): number {
  const brand = m.brand_name.toLowerCase();
  const generic = m.generic_name.toLowerCase();
  const strength = m.strength.toLowerCase();
  const form = m.dosage_form.toLowerCase();
  const mfg = m.manufacturer.toLowerCase();
  const fullText = `${brand} ${generic} ${strength} ${form} ${mfg}`;

  let score = 0;

  // 1. Exact brand match (Highest priority)
  if (brand === rawQuery) {
    score += 1200;
  } else if (brand.startsWith(rawQuery)) {
    score += 600;
  }

  // 2. Token-by-token evaluation
  let allTokensMatched = true;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    let tokenMatched = false;

    // First token matching the start of brand name gets huge weight
    if (i === 0 && brand.startsWith(t)) {
      score += 400;
      tokenMatched = true;
    } else if (brand.includes(t)) {
      // Word boundary match in brand (e.g. "Extra" in "Napa Extra")
      const words = brand.split(/[\s\-+/]+/);
      if (words.some((w) => w === t)) {
        score += 250;
      } else if (words.some((w) => w.startsWith(t))) {
        score += 150;
      } else {
        score += 80;
      }
      tokenMatched = true;
    }

    // Matching strength (e.g. "500", "20", "40", "10", "120")
    if (strength.includes(t)) {
      score += 180;
      tokenMatched = true;
    }

    // Matching dosage form (e.g. "tab", "syr", "inj", "cap")
    if (form === t || form.startsWith(t)) {
      score += 120;
      tokenMatched = true;
    }

    // Matching generic name
    if (generic.startsWith(t)) {
      score += 140;
      tokenMatched = true;
    } else if (generic.includes(t)) {
      score += 60;
      tokenMatched = true;
    }

    // Matching manufacturer
    if (mfg.includes(t)) {
      score += 30;
      tokenMatched = true;
    }

    if (!tokenMatched && !fullText.includes(t)) {
      allTokensMatched = false;
    }
  }

  // Heavy bonus if every single word typed by doctor is present
  if (allTokensMatched) {
    score += 300;
  } else {
    // If some tokens did not match anywhere in the record, penalize heavily
    score -= 400;
  }

  // Shorter, cleaner brand names rank higher when search is brief (e.g. "Napa" vs "Napasyn-D")
  score += Math.max(0, 40 - brand.length * 1.5);

  // Top national pharmaceutical manufacturer bonus
  if (TOP_MANUFACTURERS.has(mfg)) {
    score += 45;
  }

  return score;
}

/**
 * Searches and ranks medicines from the local Dexie catalog.
 * Uses indexed prefix scanning for instant 0ms retrieval, followed by multi-token ranking.
 */
export async function searchMedicinesRanked(
  query: string,
  limit = 12,
): Promise<MedicineCatalog[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const tokens = clean.split(/[\s,+/]+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const firstToken = tokens[0];

  // 1. Indexed lookup on brand_name prefix (super fast IndexedDB B-tree scan)
  const prefixCandidates = await db.medicine_catalog
    .where('brand_name')
    .startsWithIgnoreCase(firstToken)
    .limit(60)
    .toArray();

  let candidatePool = prefixCandidates;

  // 2. If pool is small (< 30) and token is at least 3 chars, also search generic index or fallback scan
  if (candidatePool.length < 30 && firstToken.length >= 3) {
    const genericCandidates = await db.medicine_catalog
      .where('generic_name')
      .startsWithIgnoreCase(firstToken)
      .limit(30)
      .toArray();

    const seenIds = new Set(candidatePool.map((m) => m.id));
    for (const g of genericCandidates) {
      if (!seenIds.has(g.id)) {
        candidatePool.push(g);
        seenIds.add(g.id);
      }
    }

    // If still small, scan for substring matches
    if (candidatePool.length < 20) {
      const substringMatches = await db.medicine_catalog
        .filter(
          (m) =>
            m.brand_name.toLowerCase().includes(firstToken) ||
            m.generic_name.toLowerCase().includes(firstToken),
        )
        .limit(40)
        .toArray();

      for (const s of substringMatches) {
        if (!seenIds.has(s.id)) {
          candidatePool.push(s);
          seenIds.add(s.id);
        }
      }
    }
  }

  // 3. Score all candidates using our multi-token clinical relevance algorithm
  const scored = candidatePool
    .map((m) => ({
      medicine: m,
      score: scoreMedicine(m, clean, tokens),
    }))
    .filter((item) => item.score > 0);

  // 4. Sort strictly by descending relevance score, then alphabetically
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.medicine.brand_name.localeCompare(b.medicine.brand_name);
  });

  return scored.slice(0, limit).map((s) => s.medicine);
}
