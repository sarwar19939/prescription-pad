/**
 * AI-Assisted Smart Dosing & Chronotherapy Engine.
 * Calibrates dosage, formulation, and timing by age (<12 pediatric), weight, and vitals.
 */
import type { MealTiming, Patient, PrescriptionItem, Vitals } from '@/types/schema';
import { parseBP } from './vitalsService';
import { detectMedicineCategory } from './medicineRouteService';
import { normalizeDosageForm } from '@/lib/prescriptionFormatters';
import {
  calculateParacetamolDose,
  calculateTopicalSpecialtyDose,
} from './pediatricAntipyreticDosing';

export interface DoseProposal {
  hasAdjustment: boolean;
  dosage_form?: PrescriptionItem['dosage_form'];
  strength?: string;
  schedule?: string;
  meal_timing?: MealTiming;
  duration?: string;
  special_instructions?: string;
  reason?: string;
  badge?: string;
}

function parseNum(val?: string | number): number | null {
  if (val === undefined || val === null) return null;
  const match = String(val).match(/[-+]?[0-9]*\.?[0-9]+/);
  return match ? parseFloat(match[0]) : null;
}

export function calculateSmartDose(
  med: { brand_name: string; generic_name?: string; dosage_form?: PrescriptionItem['dosage_form']; strength?: string },
  patient: Patient,
  vitals?: Partial<Vitals> | null,
): DoseProposal {
  const name = (med.brand_name + ' ' + (med.generic_name || '')).toLowerCase();
  const weight = parseNum(vitals?.weight);
  const patientAge = patient?.age ?? 30;
  const isPediatric = patientAge < 12;
  const isInfant = patientAge < 2;
  const temp = parseNum(vitals?.temp);
  const isFever = temp !== null && (temp >= 100 || (temp <= 45 && temp >= 38));
  const { sbp, dbp } = parseBP(vitals?.bp);
  const isHighBP = (sbp !== null && sbp >= 140) || (dbp !== null && dbp >= 90);

  const category = detectMedicineCategory(med.dosage_form, med.brand_name, med.generic_name);
  const normalizedForm = normalizeDosageForm(med.dosage_form);

  // If medicine is non-oral (Topical, Suppository, Injection, Drops, Inhaler),
  // NEVER force it into Syrup or Drops! Keep its authentic form and topical/route instructions.
  if (category !== 'oral_solid' && category !== 'syrup') {
    const topicalProposal = calculateTopicalSpecialtyDose(name, normalizedForm, med.strength);
    if (topicalProposal) return topicalProposal;
    return { hasAdjustment: false };
  }

  // 1. Paracetamol / Acetaminophen (Ace, Napa, Fast, Parapyrol)
  if (name.includes('paracetamol') || name.includes('napa') || name.includes('ace') || name.includes('fast')) {
    return calculateParacetamolDose(patientAge, weight, isPediatric, isInfant, isFever, temp, med.strength);
  }

  // 2. PPIs / Antacids (Omeprazole, Esomeprazole, Pantoprazole, Rabeprazole, Seclo, Maxpro, Sergel)
  if (name.includes('prazole') || name.includes('seclo') || name.includes('maxpro') || name.includes('sergel') || name.includes('finix') || name.includes('pantodac')) {
    return {
      hasAdjustment: true,
      dosage_form: isPediatric ? 'Syr' : 'Cap',
      strength: med.strength || (isPediatric ? '20mg/sachet' : '20mg'),
      schedule: '1+0+1',
      meal_timing: 'Before Meal',
      duration: '14 Days',
      special_instructions: '',
      reason: 'Gastric acid suppression: optimal 30 mins before meals.',
      badge: 'Before Meal (PPI)',
    };
  }

  // 3. Antihypertensives (Amlodipine, Losartan, Telmisartan, Bisoprolol, Camlosart, Osartil)
  if (name.includes('amlodipine') || name.includes('losartan') || name.includes('telmisartan') || name.includes('bisoprolol') || name.includes('camlosart') || name.includes('osartil') || name.includes('bizoran') || name.includes('angilock')) {
    const highDose = sbp !== null && sbp >= 160;
    return {
      hasAdjustment: true,
      dosage_form: 'Tab',
      strength: med.strength || (highDose ? '10mg' : '5mg'),
      schedule: highDose ? '1+0+1' : '1+0+0',
      meal_timing: 'After Meal',
      duration: '30 Days',
      special_instructions: '',
      reason: isHighBP ? `Stage 2 Hypertension (BP ${sbp}/${dbp} mmHg). Titrated morning regimen.` : 'Daily cardiovascular maintenance dose.',
      badge: isHighBP ? `HTN Titrated (${sbp}/${dbp})` : 'Morning Regimen',
    };
  }

  // 4. Lipid Lowering / Statins (Atorvastatin, Rosuvastatin, Lipitor, Atova, Rosuva)
  if (name.includes('statin') || name.includes('atova') || name.includes('rosuva') || name.includes('lipicon')) {
    return {
      hasAdjustment: true,
      dosage_form: 'Tab',
      strength: med.strength || '10mg',
      schedule: '0+0+1',
      meal_timing: 'After Meal',
      duration: '30 Days',
      special_instructions: '',
      reason: 'Statins have maximal hepatic efficacy when taken at bedtime.',
      badge: 'Bedtime Statin',
    };
  }

  // 5. Antihistamines & Montelukast (Monas, Provair, Fexo, Bilastine, Cetirizine)
  if (name.includes('montelukast') || name.includes('monas') || name.includes('provair')) {
    const pediatricDose = patient.age < 6 ? '4mg' : patient.age < 15 ? '5mg' : '10mg';
    return {
      hasAdjustment: true,
      dosage_form: 'Tab',
      strength: isPediatric ? pediatricDose : (med.strength || '10mg'),
      schedule: '0+0+1',
      meal_timing: 'After Meal',
      duration: '14-30 Days',
      special_instructions: '',
      reason: 'Leukotriene receptor antagonist: evening administration recommended.',
      badge: isPediatric ? `Pediatric ${pediatricDose}` : 'Evening Dose',
    };
  }

  // 6. Antibiotics (Azithromycin, Cefixime, Amoxicillin, Cipro)
  if (name.includes('azithromycin') || name.includes('zithrin') || name.includes('azalide')) {
    if (isPediatric) {
      const azithroSpoon = patientAge < 5 ? '১ চামচ (৫ মি.লি.)' : '১.৫ চামচ (৭.৫ মি.লি.)';
      return {
        hasAdjustment: true,
        dosage_form: 'Syr',
        strength: '200mg/5ml',
        schedule: `${azithroSpoon} করে দিনে ১ বার`,
        meal_timing: 'Before Meal',
        duration: '৩-৫ দিন',
        special_instructions: '',
        reason: `Pediatric Azithromycin calibrated for age ${patientAge} yrs.`,
        badge: 'Pediatric 200mg/5ml OD',
      };
    }
    return {
      hasAdjustment: true,
      dosage_form: 'Tab',
      strength: med.strength || '500mg',
      schedule: '1+0+0',
      meal_timing: 'Before Meal',
      duration: '5 Days',
      special_instructions: '',
      reason: 'Macrolide once-daily 5-day course.',
      badge: 'Once Daily 5-Day',
    };
  }

  // 7. Cefixime (Cef-3, Triocim, Denavir)
  if (name.includes('cefixime') || name.includes('cef-3') || name.includes('triocim')) {
    if (isPediatric) {
      const cefSpoon = patientAge < 5 ? '১ চামচ (৫ মি.লি.)' : '১.৫ চামচ (৭.৫ মি.লি.)';
      return {
        hasAdjustment: true,
        dosage_form: 'Syr',
        strength: '100mg/5ml',
        schedule: `${cefSpoon} করে দিনে ২ বার`,
        meal_timing: 'After Meal',
        duration: '৭ দিন',
        special_instructions: '',
        reason: `Pediatric Cefixime calibrated for age ${patientAge} yrs.`,
        badge: 'Pediatric Cefixime',
      };
    }
    return {
      hasAdjustment: true,
      dosage_form: 'Cap',
      strength: med.strength || '200mg',
      schedule: '1+0+1',
      meal_timing: 'After Meal',
      duration: '7 Days',
      special_instructions: '',
      reason: 'Standard 3rd-generation cephalosporin regimen.',
      badge: 'Cefixime 7-Day',
    };
  }

  // 8. Antiemetic / Domperidone (Omidon, Motigut)
  if (name.includes('domperidone') || name.includes('omidon') || name.includes('motigut')) {
    if (isPediatric) {
      const isDrop = isInfant || patientAge < 1;
      const dompSpoon = patientAge < 5 ? '১ চামচ (৫ মি.লি.)' : '১.৫ চামচ (৭.৫ মি.লি.)';
      return {
        hasAdjustment: true,
        dosage_form: isDrop ? 'Drop' : 'Syr',
        strength: isDrop ? '5mg/ml' : '5mg/5ml',
        schedule: isDrop ? '১০-১৫ ফোঁটা করে দিনে ৩ বার' : `${dompSpoon} করে দিনে ৩ বার`,
        meal_timing: 'Before Meal',
        duration: '৩-৫ দিন',
        special_instructions: '',
        reason: isDrop ? 'Pediatric drops before feeding.' : 'Pediatric syrup before meals.',
        badge: isDrop ? 'Pediatric Drop' : 'Pediatric Syrup',
      };
    }
    return {
      hasAdjustment: true,
      dosage_form: 'Tab',
      strength: '10mg',
      schedule: '1+0+1',
      meal_timing: 'Before Meal',
      duration: '7 Days',
      special_instructions: '',
      reason: 'Upper GI prokinetic motility agent.',
      badge: 'Before Meal',
    };
  }

  // 9. Metformin (Comet)
  if (name.includes('metformin') || name.includes('comet')) {
    return {
      hasAdjustment: true,
      dosage_form: 'Tab',
      strength: med.strength || '500mg',
      schedule: '1+0+1',
      meal_timing: 'With Meal',
      duration: '30 Days',
      special_instructions: '',
      reason: 'First-line biguanide insulin sensitizer.',
      badge: 'With Meal',
    };
  }

  // 10. General Pediatric Fallback (strictly for oral tablets/capsules under 12 years)
  if (isPediatric && category === 'oral_solid') {
    const isDrop = isInfant || patientAge < 1;
    const fallbackSpoon = patientAge < 5 ? '১ চামচ (৫ মি.লি.)' : '১.৫ চামচ (৭.৫ মি.লি.)';
    return {
      hasAdjustment: true,
      dosage_form: isDrop ? 'Drop' : 'Syr',
      strength: med.strength || '',
      schedule: isDrop ? '১০-১৫ ফোঁটা করে দিনে ৩ বার' : `${fallbackSpoon} করে দিনে ৩ বার`,
      meal_timing: 'After Meal',
      duration: '৭ দিন',
      special_instructions: '',
      reason: 'Switched to oral liquid formulation for pediatric safety.',
      badge: isDrop ? 'Pediatric Drops' : 'Pediatric Syrup',
    };
  }

  return { hasAdjustment: false };
}
