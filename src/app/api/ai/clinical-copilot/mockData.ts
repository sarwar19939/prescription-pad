/**
 * Intelligent Mock Fallbacks for Development & Offline Demo.
 */
export function mockLabAnalysis(payload: { content: string }) {
  const text = payload?.content || '';
  const isDiabetes = /sugar|glucose|hba1c/i.test(text);
  const isKidney = /creatinine|urea|egfr/i.test(text);

  if (isDiabetes) {
    return {
      test_name: 'Glycemic Profile',
      extracted_metrics: {
        'HbA1c': '7.8 %',
        'Fasting Blood Sugar': '142 mg/dL',
        'Post-Prandial Blood Sugar': '210 mg/dL',
      },
      abnormality_flags: ['High HbA1c (7.8%)', 'Elevated Fasting Glucose (142 mg/dL)'],
      ai_summary: 'Suboptimal glycemic control indicating active diabetes progression. Lifestyle and pharmacotherapy review indicated.',
    };
  }

  if (isKidney) {
    return {
      test_name: 'Renal Function Test (RFT)',
      extracted_metrics: {
        'Serum Creatinine': '1.6 mg/dL',
        'Blood Urea Nitrogen': '28 mg/dL',
        'eGFR': '54 mL/min/1.73m²',
      },
      abnormality_flags: ['Elevated Serum Creatinine (1.6 mg/dL)', 'Reduced eGFR (Stage 3a CKD)'],
      ai_summary: 'Mild renal impairment observed. Monitor hydration and adjust dosages of renally-cleared medications.',
    };
  }

  return {
    test_name: 'Comprehensive Health Panel',
    extracted_metrics: {
      'Hemoglobin': '11.8 g/dL',
      'Total Cholesterol': '225 mg/dL',
      'Serum Creatinine': '1.1 mg/dL',
      'HbA1c': '6.4 %',
    },
    abnormality_flags: ['Borderline Total Cholesterol (225 mg/dL)', 'Pre-diabetic HbA1c (6.4%)'],
    ai_summary: 'Borderline dyslipidemia and pre-diabetes noted. Recommend dietary lifestyle modifications and 3-month lipid re-evaluation.',
  };
}

export function mockClinicalTrack(context: any) {
  const complaints: string[] = context?.current_complaints || [];
  const allergies: string[] = context?.allergies || [];
  const conditions: string[] = context?.chronic_conditions || [];

  const text = `${complaints.join(' ')} ${conditions.join(' ')}`.toLowerCase();

  const isFever = text.includes('fever') || text.includes('cough') || text.includes('cold');
  const isHTN = text.includes('hypertension') || text.includes('bp') || text.includes('chest pain');
  const isDiabetic = text.includes('diabetes') || text.includes('sugar');

  const warnings: string[] = [];
  allergies.forEach((a) => warnings.push(`Patient has known allergy to: ${a}. Avoid related cross-reactive drug classes.`));
  if (conditions.includes('Hypertension') || isHTN) {
    warnings.push('Avoid NSAIDs if possible to prevent BP elevation or nephrotoxicity.');
  }

  const medications = [];

  if (isFever) {
    medications.push({
      generic_name: 'Paracetamol',
      suggested_brand: 'Napa',
      strength: '500 mg',
      schedule: '1+1+1',
      duration: '5 Days',
      rationale: 'Antipyretic and analgesic for fever and cold symptoms (avoid NSAIDs if dengue is endemic).',
    });
    medications.push({
      generic_name: 'Fexofenadine',
      suggested_brand: 'Fexo',
      strength: '120 mg',
      schedule: '0+0+1',
      duration: '5 Days',
      rationale: 'Second-generation non-sedating antihistamine for allergic rhinitis and sneezing.',
    });
  } else if (isDiabetic) {
    medications.push({
      generic_name: 'Metformin',
      suggested_brand: 'Comet',
      strength: '500 mg',
      schedule: '1+0+1',
      duration: '30 Days',
      rationale: 'First-line biguanide for glycemic management.',
    });
  } else {
    medications.push({
      generic_name: 'Esomeprazole',
      suggested_brand: 'Maxpro',
      strength: '20 mg',
      schedule: '1+0+1',
      duration: '14 Days',
      rationale: 'Proton-pump inhibitor for gastroprotection and acid reflux.',
    });
  }

  return {
    differential_diagnoses: isFever
      ? ['Acute Viral Upper Respiratory Tract Infection', 'Dengue Fever (Early Stage)', 'Enteric Fever']
      : isDiabetic
        ? ['Type 2 Diabetes Mellitus with Metabolic Syndrome', 'Impaired Fasting Glucose']
        : ['General Malaise / Tension Syndrome', 'Gastroesophageal Reflux Disease (GERD)'],
    suggested_medications: medications,
    recommended_investigations: isFever
      ? ['Complete Blood Count (CBC) with Platelets', 'NS1 Ag (if fever within 3 days)', 'Urine R/M/E']
      : ['HbA1c & Fasting Blood Sugar', 'Lipid Profile', 'Serum Creatinine & Electrolytes'],
    safety_warnings: warnings.length > 0 ? warnings : ['Verify baseline renal and hepatic parameters before long-term therapy.'],
  };
}
