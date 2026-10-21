/**
 * Clinical shorthand parser for the Rx quick-command bar.
 *
 * Examples the parser understands:
 *   "1+0+1"            → schedule 1+0+1
 *   "bd"               → schedule 1+0+1 (twice daily)
 *   "tds"              → schedule 1+1+1
 *   "od"               → schedule 1+0+0
 *   "hs"               → schedule 0+0+1 (at bedtime)
 *   "qid"              → schedule 1+1+1+1
 *   "pc" / "ac" / "cc" → After Meal / Before Meal / With Meal
 *   "7d" / "10 days" / "2m" → "7 Days" / "10 Days" / "2 Months"
 * Combined: "bd pc 7d" fills all three fields at once.
 */
import type { MealTiming } from '@/types/schema';

export interface ShorthandResult {
  schedule?: string;
  meal_timing?: MealTiming;
  duration?: string;
}

const SCHEDULE_WORDS: Record<string, string> = {
  bd: '1+0+1',
  bid: '1+0+1',
  tds: '1+1+1',
  tid: '1+1+1',
  od: '1+0+0',
  qd: '1+0+0',
  hs: '0+0+1',
  qid: '1+1+1+1',
  sos: 'sos',
  stat: 'stat',
};

const MEAL_WORDS: Record<string, MealTiming> = {
  pc: 'After Meal',
  ac: 'Before Meal',
  cc: 'With Meal',
  am: 'After Meal',
};

const DURATION_RE = /^(\d+)\s*(d|day|days|w|week|weeks|m|month|months|mo)$/i;

function parseScheduleToken(token: string): string | undefined {
  // Numeric pattern like 1+0+1, 1+1+1+1
  if (/^\d+\+\d+(\+\d+(\+\d+)?)?$/.test(token)) return token;
  return SCHEDULE_WORDS[token.toLowerCase()];
}

function parseDurationToken(token: string): string | undefined {
  const match = DURATION_RE.exec(token);
  if (!match) return undefined;
  const n = match[1];
  const unitRaw = match[2].toLowerCase();
  if (unitRaw.startsWith('d')) return `${n} Days`;
  if (unitRaw.startsWith('w')) return `${n} Weeks`;
  return `${n} Months`;
}

function parseMealToken(token: string): MealTiming | undefined {
  const t = token.toLowerCase();
  if (MEAL_WORDS[t]) return MEAL_WORDS[t];
  const direct: MealTiming[] = ['After Meal', 'Before Meal', 'With Meal', 'Anytime'];
  const hit = direct.find((m) => m.toLowerCase() === t);
  return hit;
}

/** Parse a free-text command into the fields it declares. */
export function parseShorthand(input: string): ShorthandResult {
  const result: ShorthandResult = {};
  for (const tokenRaw of input.split(/[\s,]+/)) {
    const token = tokenRaw.trim();
    if (!token) continue;
    if (result.schedule === undefined) {
      const schedule = parseScheduleToken(token);
      if (schedule) {
        result.schedule = schedule;
        continue;
      }
    }
    if (result.meal_timing === undefined && parseMealToken(token)) {
      result.meal_timing = parseMealToken(token);
      continue;
    }
    if (result.duration === undefined) {
      const duration = parseDurationToken(token);
      if (duration) {
        result.duration = duration;
        continue;
      }
    }
  }
  return result;
}

/** True when a command string contains nothing the parser recognizes. */
export function isParsedEmpty(input: string): boolean {
  const r = parseShorthand(input);
  return !r.schedule && !r.meal_timing && !r.duration;
}
