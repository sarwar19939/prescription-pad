/**
 * AI-Assisted Smart Dosing & Chronotherapy Engine.
 * Calibrates dosage, formulation, and timing by age (<12 pediatric), weight, and vitals.
 */
import type { MealTiming, Patient, PrescriptionItem, Vitals } from '@/types/schema';
import { parseBP } from './vitalsService';

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
  const isFever = temp !== null && (temp > 45 ? temp >= 100 : temp >= 37.8);
  const { sbp, dbp } = parseBP(vitals?.bp);
  const isHighBP = (sbp !== null && sbp >= 140) || (dbp !== null && dbp >= 90);
  const pulse = parseNum(vitals?.pulse);
  const isTachycardia = pulse !== null && pulse > 100;

  // 1. Paracetamol / Acetaminophen (Ace, Napa, Fast, Parapyrol)
  if (name.includes('paracetamol') || name.includes('napa') || name.includes('ace') || name.includes('fast')) {
    if (isPediatric) {
      if (isInfant || (weight !== null && weight < 10)) {
        const doseMg = weight !== null ? Math.round(weight * 15) : 60;
        const drops = Math.round((doseMg / 80) * 0.8 * 20);
        return {
          hasAdjustment: true,
          dosage_form: 'Drop',
          strength: '80mg/0.8ml',
          schedule: '1+1+1 (every 6-8 hrs SOS)',
          meal_timing: 'After Meal',
          duration: '3 Days',
          special_instructions: weight !== null ? `Infant weight ${weight}kg: ~${drops} drops (${doseMg}mg) during fever` : 'Infant drop during fever',
          reason: 'Paediatric infant drops calibrated for age < 2.',
          badge: 'Infant Drops',
        };
      }
      if (weight !== null) {
        const doseMg = Math.round(weight * 15);
        const ml = Math.round((doseMg / 120) * 5 * 10) / 10;
        return {
          hasAdjustment: true,
          dosage_form: 'Syr',
          strength: '120mg/5ml',
          schedule: '1+1+1 (every 6-8 hrs SOS)',
          meal_timing: 'After Meal',
          duration: '3 Days',
          special_instructions: `Weight-based pediatric dose: ${doseMg}mg (~${ml} ml) during fever`,
          reason: `Pediatric weight ${weight}kg: calibrated 15 mg/kg per dose.`,
          badge: `Pediatric ${doseMg}mg (~${ml}ml)`,
        };
      }
      return {
        hasAdjustment: true,
        dosage_form: 'Syr',
        strength: '120mg/5ml',
        schedule: '1+1+1 (SOS)',
        meal_timing: 'After Meal',
        duration: '3 Days',
        special_instructions: 'Pediatric paracetamol syrup for fever or pain.',
        reason: 'Age-appropriate pediatric oral suspension.',
        badge: 'Pediatric Syrup',
      };
    }

    if (isFever) {
      return {
        hasAdjustment: true,
        dosage_form: 'Tab',
        strength: med.strength || '500mg',
        schedule: '1+1+1+1 (every 6 hrs)',
        meal_timing: 'After Meal',
        duration: '3-5 Days',
        special_instructions: 'Take with full glass of water during fever. Max 4g/day.',
        reason: `Active fever detected (${temp}°F). QDS adult schedule indicated.`,
        badge: 'Fever SOS Dosing',
      };
    }
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
      special_instructions: 'Take 30 to 60 minutes before breakfast and dinner',
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
      special_instructions: 'Take regularly every morning after breakfast. Monitor BP weekly.',
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
      special_instructions: 'Take once daily at bedtime (peak cholesterol synthesis occurs at night)',
      reason: 'Statins have maximal hepatic efficacy when taken at bedtime.',
      badge: 'Bedtime Statin',
    };
  }

  // 5. Antihistamines & Montelukast (Monas, Provair, Fexo, Bilastine, Cetirizine)
  if (name.includes('montelukast') || name.includes('monas') || name.includes('provair')) {
    const pediatricDose = patient.age < 6 ? '4mg' : patient.age < 15 ? '5mg' : '10mg';
    return {
      hasAdjustment: true,
      dosage_form: isPediatric ? 'Tab' : 'Tab',
      strength: isPediatric ? pediatricDose : (med.strength || '10mg'),
      schedule: '0+0+1',
      meal_timing: 'After Meal',
      duration: '14-30 Days',
      special_instructions: 'Take in the evening or at bedtime',
      reason: 'Leukotriene receptor antagonist: evening administration recommended.',
      badge: isPediatric ? `Pediatric ${pediatricDose}` : 'Evening Dose',
    };
  }

  // 6. Antibiotics (Azithromycin, Cefixime, Amoxicillin, Cipro)
  if (name.includes('azithromycin') || name.includes('zithrin') || name.includes('azalide')) {
    if (isPediatric && weight !== null) {
      const azithroMg = Math.round(weight * 10);
      return {
        hasAdjustment: true,
        dosage_form: 'Syr',
        strength: '200mg/5ml',
        schedule: '1+0+0',
        meal_timing: 'Before Meal',
        duration: '3-5 Days',
        special_instructions: `Pediatric dose: 10mg/kg (${azithroMg}mg once daily). 1 hr before or 2 hrs after meal.`,
        reason: `Pediatric Azithromycin 10mg/kg for weight ${weight}kg.`,
        badge: `10mg/kg (${azithroMg}mg OD)`,
      };
    }
    return {
      hasAdjustment: true,
      dosage_form: 'Tab',
      strength: med.strength || '500mg',
      schedule: '1+0+0',
      meal_timing: 'Before Meal',
      duration: '5 Days',
      special_instructions: 'Take once daily 1 hour before or 2 hours after meal',
      reason: 'Macrolide once-daily 5-day course.',
      badge: 'Once Daily 5-Day',
    };
  }

  // 7. Cefixime (Cef-3, Triocim, Denavir)
  if (name.includes('cefixime') || name.includes('cef-3') || name.includes('triocim')) {
    if (isPediatric && weight !== null) {
      const cefMg = Math.round(weight * 8);
      const ml = Math.round((cefMg / 100) * 5 * 10) / 10;
      return {
        hasAdjustment: true,
        dosage_form: 'Syr',
        strength: '100mg/5ml',
        schedule: '1+0+1',
        meal_timing: 'After Meal',
        duration: '7 Days',
        special_instructions: `Pediatric 8mg/kg (${cefMg}mg/day): ~${Math.round((ml / 2) * 10) / 10} ml BD`,
        reason: `Pediatric Cefixime 8mg/kg for weight ${weight}kg.`,
        badge: `8mg/kg (~${ml}ml/day)`,
      };
    }
    return {
      hasAdjustment: true,
      dosage_form: 'Cap',
      strength: med.strength || '200mg',
      schedule: '1+0+1',
      meal_timing: 'After Meal',
      duration: '7 Days',
      special_instructions: 'Complete the full 7-day course',
      reason: 'Standard 3rd-generation cephalosporin regimen.',
      badge: 'Cefixime 7-Day',
    };
  }

  // 8. Antiemetic / Domperidone (Omidon, Motigut)
  if (name.includes('domperidone') || name.includes('omidon') || name.includes('motigut')) {
    if (isPediatric) {
      const isDrop = isInfant || (weight !== null && weight < 10);
      return {
        hasAdjustment: true,
        dosage_form: isDrop ? 'Drop' : 'Syr',
        strength: isDrop ? '5mg/ml' : '5mg/5ml',
        schedule: '1+0+1',
        meal_timing: 'Before Meal',
        duration: '3-5 Days',
        special_instructions: isDrop ? 'Take 15-30 minutes before feed' : 'Take 15-30 minutes before meal for nausea/vomiting',
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
      special_instructions: 'Take 15-30 minutes before meal',
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
      special_instructions: 'Take in the middle of principal meals to prevent GI upset',
      reason: 'First-line biguanide insulin sensitizer.',
      badge: 'With Meal',
    };
  }

  // 10. General Pediatric Fallback (strictly under 12 years)
  if (isPediatric) {
    return {
      hasAdjustment: true,
      dosage_form: isInfant ? 'Drop' : 'Syr',
      strength: med.strength || '',
      schedule: '1+0+1',
      meal_timing: 'After Meal',
      duration: '7 Days',
      special_instructions: weight ? `Pediatric patient (Weight: ${weight}kg, Age: ${patient.age} yrs)` : `Pediatric patient (Age: ${patient.age} yrs)`,
      reason: 'Switched to oral liquid formulation for pediatric safety.',
      badge: isInfant ? 'Pediatric Drops' : 'Pediatric Syrup',
    };
  }

  return { hasAdjustment: false };
}
