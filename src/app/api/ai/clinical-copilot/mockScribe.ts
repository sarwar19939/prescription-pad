/**
 * Mock Ambient Scribe Handler for Offline Fallback & Testing.
 * Provides standard Medical English chief complaints, history notes, and examination findings.
 */
import type { ScribeExtractionResult } from '@/services/aiScribeService';

export function mockAmbientScribe(payload: any): ScribeExtractionResult {
  const text = (payload?.transcript || '').toLowerCase();

  const isFever = text.includes('জ্বর') || text.includes('fever') || text.includes('গরম');
  const isCough = text.includes('কাশি') || text.includes('cough') || text.includes('কফ');
  const isGastric = text.includes('গ্যাস') || text.includes('বুক জ্বালা') || text.includes('gastric') || text.includes('acidity');

  if (isFever && isCough) {
    return {
      chief_complaints: ['High-grade continuous fever for 3 days', 'Dry irritating cough', 'Generalized body ache & myalgia'],
      vitals_mentioned: { temp: '101°F', pulse: '84 bpm' },
      history_notes: ['No prior history of bronchial asthma, wheezing, or known drug allergies', 'Took paracetamol with transient antipyretic relief'],
      examination_findings: 'Pharynx congested. Chest is clinically clear with bilateral vesicular breath sounds. No ronchi or crepitations.',
      differential_diagnoses: [
        'Acute Viral Upper Respiratory Infection (URTI)',
        'Acute Pharyngotonsillitis',
        'Seasonal Influenza Syndrome',
      ],
      primary_diagnosis: 'Acute Viral URTI (Upper Respiratory Tract Infection)',
      suggested_medicines: [
        { brand_name: 'Napa Extend', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '665 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'Take after principal meals for fever and body ache.' },
        { brand_name: 'Maxpro', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'Take 20 minutes before meals on empty stomach.' },
        { brand_name: 'Montene-FX', generic_name: 'Montelukast + Fexofenadine', dosage_form: 'Tab', strength: '10/120 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '10 Days', special_instructions: 'Take once daily at bedtime for cough.' },
        { brand_name: 'Ambrox Syrup', generic_name: 'Ambroxol Hydrochloride', dosage_form: 'Syr', strength: '15 mg/5 ml', schedule: '2 spoons TDS', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'Take 2 spoonfuls 3 times daily after meal.' },
      ],
      advice: [
        'কুসুম গরম পানিতে লেবু ও মধু মিশিয়ে দিনে ২-৩ বার পান করুন।',
        'লবণ-গরম পানি দিয়ে নিয়মিত গড়গড়া করুন ও ফুটন্ত পানির ভাপ নিন।',
        'ঠাণ্ডা পানি ও আইসক্রিম সম্পূর্ণ পরিহার করুন।',
        'জ্বর ৩ দিনের বেশি স্থায়ী হলে সিবিসি ও ডেঙ্গু এনএস১ টেস্ট করান।',
      ],
      summary: 'Patient presented with 3-day history of febrile illness and cough. Supportive symptomatic care indicated.',
    };
  }

  if (isGastric) {
    return {
      chief_complaints: ['Severe retrosternal burning pain (Heartburn)', 'Postprandial upper abdominal distension & fullness', 'Acid regurgitation & sour eructation'],
      vitals_mentioned: { bp: '120/80', pulse: '76 bpm' },
      history_notes: ['Symptoms aggravated following consumption of heavy, oily hotel food', 'No history of hematemesis, melena, or unintentional weight loss'],
      examination_findings: 'Abdomen: Soft, non-distended, mild epigastric tenderness on deep palpation. Normal bowel sounds.',
      differential_diagnoses: [
        'Gastroesophageal Reflux Disease (GERD)',
        'Peptic Ulcer Disease (PUD)',
        'Functional Dyspepsia',
      ],
      primary_diagnosis: 'GERD & Peptic Dyspepsia',
      suggested_medicines: [
        { brand_name: 'Sergel', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'Take 30 minutes before breakfast and dinner.' },
        { brand_name: 'Motigut', generic_name: 'Domperidone', dosage_form: 'Tab', strength: '10 mg', schedule: '1+1+1', meal_timing: 'Before Meal', duration: '10 Days', special_instructions: 'Take 15 minutes before principal meals.' },
        { brand_name: 'Entacyd Plus', generic_name: 'Magaldrate + Simethicone', dosage_form: 'Syr', strength: '200 ml', schedule: '2 spoons TDS', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'Take 2 spoons 1 hour after meals and at bedtime.' },
      ],
      advice: [
        'খাওয়ার পরপরই শুয়ে পড়বেন না, অন্তত ২ ঘণ্টা পর ঘুমাতে যান।',
        'চা, কফি, ভাজাপোড়া ও অতিরিক্ত মসলাযুক্ত খাবার বর্জন করুন।',
        'রাতে ঘুমানোর সময় মাথার দিক সামান্য উঁচু রাখুন।',
      ],
      summary: 'Patient presents with severe acid reflux and dyspepsia following dietary indiscretion. Triple mucosal protection indicated.',
    };
  }

  return {
    chief_complaints: ['Generalized fatigue & weakness for 1 week', 'Diffuse body ache & malaise'],
    vitals_mentioned: { bp: '120/80', pulse: '74 bpm', temp: '98.4°F' },
    history_notes: ['Sedentary working lifestyle with inadequate hydration and irregular sleep pattern'],
    examination_findings: 'Patient alert and oriented. Systemic clinical examination unremarkable.',
    differential_diagnoses: [
      'Generalized Malaise & Fatigue Syndrome',
      'Mild Tension & Physical Exhaustion',
    ],
    primary_diagnosis: 'Generalized Malaise & Asthenia',
    suggested_medicines: [
      { brand_name: 'Fast', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'Take after meal for pain if needed.' },
      { brand_name: 'Maxpro', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'Take before meal.' },
      { brand_name: 'Bextram Gold', generic_name: 'Multivitamin + Multimineral', dosage_form: 'Tab', strength: 'Standard', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'Take 1 tablet at night after dinner.' },
    ],
    advice: [
      'প্রতিদিন অন্তত ৮ গ্লাস নিরাপদ বিশুদ্ধ পানি পান করুন।',
      'প্রতি রাতে পর্যাপ্ত ৭-৮ ঘণ্টা গভীর ঘুম নিশ্চিত করুন।',
      'পুষ্টিকর ও সতেজ শাকসবজি এবং ফলমূল নিয়মিত গ্রহণ করুন।',
    ],
    summary: 'Non-specific generalized fatigue. Supportive lifestyle modification and nutritional replenishment indicated.',
  };
}
