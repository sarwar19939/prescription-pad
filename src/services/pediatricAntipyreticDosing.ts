/**
 * MedRecord — Specialized Pediatric Antipyretic & Topical Protocol Dosing.
 */
import type { PrescriptionItem } from '@/types/schema';
import { toBengaliNumerals } from '@/lib/prescriptionFormatters';
import type { DoseProposal } from './dosingEngine';

export function calculateTopicalSpecialtyDose(
  name: string,
  normalizedForm: string,
  medStrength?: string,
): DoseProposal | null {
  // Scabies / Permethrin pediatric specifics
  const isScabies =
    name.includes('permethrin') ||
    name.includes('scabex') ||
    name.includes('lorex') ||
    name.includes('permin') ||
    name.includes('পারমিন');

  if (isScabies) {
    return {
      hasAdjustment: true,
      dosage_form: normalizedForm === 'Lotion' ? 'Lotion' : 'Cream',
      strength: medStrength || '5% w/w',
      schedule: '১ বার (রাতে)',
      meal_timing: undefined,
      duration: '১ দিন (৭ দিন পর পুনরায়)',
      special_instructions: '',
      reason: 'স্ক্যাবিস পারমেথ্রিন ৫% সারা শরীরে ওভারনাইট অ্যাপ্লিকেশন।',
      badge: 'Scabies Protocol',
    };
  }

  // Antifungal creams
  const isAntifungal =
    name.includes('afun') ||
    name.includes('এফান') ||
    name.includes('clotrimazole') ||
    name.includes('miconazole') ||
    name.includes('econazole') ||
    name.includes('ketoconazole') ||
    name.includes('fungidal') ||
    name.includes('candid');

  if (isAntifungal) {
    return {
      hasAdjustment: true,
      dosage_form: normalizedForm === 'Oint' ? 'Oint' : 'Cream',
      strength: medStrength || '1%',
      schedule: 'দিনে ২ বার',
      meal_timing: undefined,
      duration: '১৪-২১ দিন',
      special_instructions: '',
      reason: 'টপিক্যাল অ্যান্টিফাংগাল ত্বকের সংক্রমণ প্রটোকল।',
      badge: 'Topical Antifungal',
    };
  }

  // Topical Steroids
  const isTopicalSteroid =
    name.includes('halovar') ||
    name.includes('halovate') ||
    name.includes('হ্যালোভার') ||
    name.includes('হ্যালোভেট') ||
    name.includes('halobetasol') ||
    name.includes('clobetasol') ||
    name.includes('dermasol') ||
    name.includes('betnovate');

  if (isTopicalSteroid) {
    return {
      hasAdjustment: true,
      dosage_form: normalizedForm === 'Oint' ? 'Oint' : 'Cream',
      strength: medStrength || '0.05%',
      schedule: 'রাতে ১ বার',
      meal_timing: undefined,
      duration: '৭-১০ দিন',
      special_instructions: '',
      reason: 'টপিক্যাল কর্টিকোস্টেরয়েড স্কিন অ্যাপ্লিকেশন।',
      badge: 'Topical Steroid',
    };
  }

  return null;
}

export function calculateParacetamolDose(
  patientAge: number,
  weight: number | null,
  isPediatric: boolean,
  isInfant: boolean,
  isFever: boolean,
  temp: number | null,
  medStrength?: string,
): DoseProposal {
  if (isPediatric) {
    if (isInfant || (weight !== null && weight < 10) || patientAge < 1) {
      const doseMg = weight !== null ? Math.round(weight * 15) : 60;
      const drops = Math.round((doseMg / 80) * 0.8 * 20) || 12;
      return {
        hasAdjustment: true,
        dosage_form: 'Drop',
        strength: '80mg/0.8ml',
        schedule: `${toBengaliNumerals(drops)} ফোঁটা করে দিনে ৩-৪ বার (জ্বর আসলে SOS)`,
        meal_timing: 'After Meal',
        duration: '3 Days',
        special_instructions: '',
        reason: 'Paediatric infant drops calibrated for age < 1.',
        badge: 'Infant Drops',
      };
    }

    if (weight !== null) {
      const doseMg = Math.round(weight * 15);
      const ml = Math.round((doseMg / 120) * 5 * 10) / 10;
      const spoons = Math.round((ml / 5) * 10) / 10;
      const spoonStr = spoons === 0.5 ? 'আধা' : toBengaliNumerals(spoons);
      return {
        hasAdjustment: true,
        dosage_form: 'Syr',
        strength: '120mg/5ml',
        schedule: `${spoonStr} চামচ (${toBengaliNumerals(ml)} মি.লি.) করে দিনে ৩-৪ বার (জ্বর আসলে SOS)`,
        meal_timing: 'After Meal',
        duration: '3 Days',
        special_instructions: '',
        reason: `Pediatric weight ${weight}kg: calibrated 15 mg/kg per dose.`,
        badge: `Pediatric ${doseMg}mg (~${ml}ml)`,
      };
    }

    let spoonText = '১ চামচ (৫ মি.লি.)';
    if (patientAge < 2) spoonText = 'আধা চামচ (২.৫ মি.লি.)';
    else if (patientAge <= 5) spoonText = '১ চামচ (৫ মি.লি.)';
    else if (patientAge <= 8) spoonText = '১.৫ চামচ (৭.৫ মি.লি.)';
    else spoonText = '২ চামচ (১০ মি.লি.)';

    return {
      hasAdjustment: true,
      dosage_form: 'Syr',
      strength: '120mg/5ml',
      schedule: `${spoonText} করে দিনে ৩-৪ বার (জ্বর আসলে SOS)`,
      meal_timing: 'After Meal',
      duration: '3 Days',
      special_instructions: '',
      reason: 'Age-appropriate pediatric oral suspension.',
      badge: 'Pediatric Syrup',
    };
  }

  if (isFever) {
    return {
      hasAdjustment: true,
      dosage_form: 'Tab',
      strength: medStrength || '500mg',
      schedule: '1+1+1+1 (every 6 hrs)',
      meal_timing: 'After Meal',
      duration: '3-5 Days',
      special_instructions: '',
      reason: `Active fever detected (${temp}°F). QDS adult schedule indicated.`,
      badge: 'Fever SOS Dosing',
    };
  }

  return { hasAdjustment: false };
}
