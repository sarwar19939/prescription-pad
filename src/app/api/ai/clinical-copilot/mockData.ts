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

export function mockFullPrescription(diagnosis: string) {
  const d = diagnosis.toLowerCase();

  // 1. Dengue / Viral Fever Protocol (DGHS & Master The Chamber)
  if (d.includes('dengue') || d.includes('fever') || d.includes('জ্বর')) {
    return {
      diagnosis,
      medicines: [
        { brand_name: 'Napa Extend', generic_name: 'Paracetamol Extended Release', dosage_form: 'Tab', strength: '665 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'জ্বর ও ব্যথায় সেব্য। দিনে ৩টির বেশি খাবেন না।' },
        { brand_name: 'Maxpro', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খাবারের ২০ মিনিট পূর্বে খালি পেটে।' },
        { brand_name: 'Ceevit', generic_name: 'Ascorbic Acid (Vitamin C)', dosage_form: 'Tab', strength: '250 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'চিবিয়ে সেবনযোগ্য ট্যাবলেট।' },
        { brand_name: 'ORS Saline', generic_name: 'Oral Rehydration Salts', dosage_form: 'Syr', strength: '500 ml', schedule: '1+1+1', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রতিদিন অন্তত ২.৫ থেকে ৩ লিটার স্যালাইন ও তরল খাবার পান করুন।' },
      ],
      advice: [
        'প্রচুর পরিমাণে পানি, খাবার স্যালাইন, ডাবের পানি ও ফলের রস পান করুন।',
        'কোনো অবস্থাতেই অ্যাসপিরিন বা ব্যথানাশক (NSAIDs) সেবন করবেন না।',
        'তীব্র পেটব্যথা, অবিরাম বমি বা মাড়ি দিয়ে রক্তক্ষরণ হলে অবিলম্বে হাসপাতালে যোগাযোগ করুন।',
      ],
    };
  }

  // 2. Diarrhea / Gastroenteritis Protocol (icddr,b & Master The Chamber)
  if (d.includes('diarrhea') || d.includes('diarrhoea') || d.includes('ডায়রিয়া') || d.includes('পাতলা পায়খানা') || d.includes('gastroenteritis')) {
    return {
      diagnosis,
      medicines: [
        { brand_name: 'ORS Saline', generic_name: 'Oral Rehydration Salts', dosage_form: 'Syr', strength: '500 ml', schedule: 'SOS', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রতিবার পাতলা পায়খানার পর ১ গ্লাস (২৫০ মিলি) প্রস্তুত স্যালাইন।' },
        { brand_name: 'Baby Zinc', generic_name: 'Zinc Sulphate', dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'ডায়রিয়া ভালো হয়ে গেলেও টানা ১৪ দিন সম্পূর্ণ কোর্স শেষ করুন।' },
        { brand_name: 'Motigut', generic_name: 'Domperidone', dosage_form: 'Tab', strength: '10 mg', schedule: '1+1+1', meal_timing: 'Before Meal', duration: '5 Days', special_instructions: 'খাবারের ১৫ মিনিট পূর্বে বমি ভাব উপশমে।' },
        { brand_name: 'Enterogermina', generic_name: 'Bacillus clausii spores', dosage_form: 'Syr', strength: '2 billion/5 ml', schedule: '1+0+1', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'অন্ত্রের স্বাভাবিক ব্যাকটেরিয়া রক্ষায় সরাসরি পান করুন।' },
      ],
      advice: [
        'স্যালাইন বানানোর ১২ ঘণ্টার পর ফেলে দিয়ে নতুন স্যালাইন প্রস্তুত করুন।',
        'চিঁড়ার পানি, ডাবের পানি, কাঁচকলা জাউ ভাত ও পর্যাপ্ত তরল খাবার খান।',
      ],
    };
  }

  // 3. Peptic Ulcer Disease / GERD / Gastritis (Master The Chamber)
  if (d.includes('pud') || d.includes('gerd') || d.includes('gastric') || d.includes('গ্যাস্ট্রিক') || d.includes('acidity') || d.includes('বুক জ্বালা')) {
    return {
      diagnosis,
      medicines: [
        { brand_name: 'Sergel', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'খাবারের ৩০ মিনিট পূর্বে খালি পেটে।' },
        { brand_name: 'Motigut', generic_name: 'Domperidone', dosage_form: 'Tab', strength: '10 mg', schedule: '1+1+1', meal_timing: 'Before Meal', duration: '10 Days', special_instructions: 'খাবারের ১৫ মিনিট পূর্বে সেব্য।' },
        { brand_name: 'Entacyd Plus', generic_name: 'Magaldrate + Simethicone', dosage_form: 'Syr', strength: '200 ml', schedule: '2 spoons TDS', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'খাবারের ১ ঘণ্টা পর এবং রাতে শোয়ার সময় ২ চামচ।' },
      ],
      advice: [
        'খাওয়ার পরপরই শুয়ে পড়বেন না, অন্তত ২ ঘণ্টা পর ঘুমাতে যান।',
        'চা, কফি, অতিরিক্ত ভাজাপোড়া ও মসলাযুক্ত খাবার বর্জন করুন।',
        'রাতে ঘুমানোর সময় মাথার দিক সামান্য উঁচু রাখুন।',
      ],
    };
  }

  // 4. Musculoskeletal / Back Pain / Joint Pain Protocol
  if (d.includes('back pain') || d.includes('pain') || d.includes('ব্যথা') || d.includes('arthritis') || d.includes('joint')) {
    return {
      diagnosis,
      medicines: [
        { brand_name: 'Napryn', generic_name: 'Naproxen', dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'ভরা পেটে প্রচুর পানিসহ সেব্য।' },
        { brand_name: 'Sergel', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'ব্যথানাশকের সাথে গ্যাস্ট্রিক সুরক্ষায় খালি পেটে।' },
        { brand_name: 'Myonil', generic_name: 'Tolperisone Hydrochloride', dosage_form: 'Tab', strength: '50 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'মাংসপেশির টান ও খিঁচুনি উপশমে।' },
      ],
      advice: [
        'ভারী কোনো বস্তু ঝুঁকিয়ে তুলবেন না, হাঁটু ভাঁজ করে তুলুন।',
        'শক্ত সমান বিছানায় শোয়ার অভ্যাস করুন।',
        'ব্যথা বেশি থাকা অবস্থায় পর্যাপ্ত বিশ্রাম নিন।',
      ],
    };
  }

  // Standard OPD Chamber Fallback
  return {
    diagnosis,
    medicines: [
      { brand_name: 'Maxpro', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'খাবারের ২০ মিনিট পূর্বে খালি পেটে সেব্য।' },
      { brand_name: 'Napa Extend', generic_name: 'Paracetamol Extended Release', dosage_form: 'Tab', strength: '665 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'ভরা পেটে প্রয়োজন অনুযায়ী সেব্য।' },
    ],
    advice: [
      'সময়মতো পুষ্টিকর খাবার গ্রহণ করুন ও পর্যাপ্ত বিশ্রাম নিন।',
      'প্রয়োজনে ৭ দিন পর পুনরায় চেম্বারে যোগাযোগ করুন।',
    ],
  };
}

export function mockImageAnalysis(payload: any) {
  const notes = (payload?.clinicalNotes || '').toLowerCase();
  const isAcne = notes.includes('acne') || notes.includes('ব্রণ') || notes.includes('pimple');

  if (isAcne) {
    return {
      observed_features: [
        'Inflammatory erythematous papules and open comedones',
        'Facial distribution predominantly across cheeks and forehead',
      ],
      differential_diagnoses: [
        'Acne Vulgaris (Grade II Moderate)',
        'Rosacea (Papulopustular)',
        'Folliculitis',
      ],
      primary_diagnosis: 'Acne Vulgaris',
      recommended_workup: ['Clinical evaluation of severity grade'],
      suggested_treatment: {
        medicines: [
          { brand_name: 'A-Ret Gel', generic_name: 'Tretinoin 0.05% Gel', dosage_form: 'Oint', strength: '0.05%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '60 Days', special_instructions: 'রাতে ঘুমানোর পূর্বে মুখ ধুয়ে শুকিয়ে শুধু ব্রণের জায়গায় হালকা লাগাবেন।' },
          { brand_name: 'Clinda Gel', generic_name: 'Clindamycin 1% Gel', dosage_form: 'Oint', strength: '1%', schedule: '1+0+0', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'সকালে গোসলের পর লাগাবেন।' },
        ],
        advice: [
          'বারবার মুখে হাত দেওয়া বা ব্রণ খোঁটা সম্পূর্ণ বন্ধ করুন।',
          'নন-কমেডোজেনিক মৃদু ফেসওয়াশ দিয়ে দিনে ২ বার মুখ পরিষ্কার করুন।',
        ],
      },
      safety_warnings: ['রেটিনয়েড জেল ব্যবহারের পর রোদে যাওয়ার সময় সানস্ক্রিন ব্যবহার করুন।'],
    };
  }

  return {
    observed_features: [
      'Annular erythematous scaly plaque with active raised borders and central clearing',
      'Mild excoriation marks secondary to intense pruritus',
    ],
    differential_diagnoses: [
      'Tinea Corporis / Ringworm (দাদ)',
      'Nummular Eczema',
      'Psoriasis (Plaque type)',
      'Contact Dermatitis',
    ],
    primary_diagnosis: 'Tinea Corporis (দাদ)',
    recommended_workup: ['10% KOH skin scraping examination for fungal hyphae'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Exifin', generic_name: 'Terbinafine', dosage_form: 'Tab', strength: '250 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '14-21 Days', special_instructions: 'প্রতিদিন দুপুরে খাবারের পর ১টি।' },
        { brand_name: 'Lulizol Cream', generic_name: 'Luliconazole 1% Cream', dosage_form: 'Oint', strength: '1%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '14-21 Days', special_instructions: 'ক্ষতস্থানের অন্তত ১ ইঞ্চি বাইরে পর্যন্ত হালকা মেখে দিন।' },
        { brand_name: 'Alatrol', generic_name: 'Cetirizine', dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'রাতে শোয়ার আগে চুলকানি কমাতে।' },
      ],
      advice: [
        'ক্ষতস্থানে কোনো অবস্থাতেই স্টেরয়েড মলম (যেমন: ডার্মোমিক্স, পেভিসন, ক্লোবেটাসল) লাগাবেন না।',
        'ব্যক্তিগত তোয়ালে, বিছানার চাদর ও কাপড় আলাদা রাখুন ও ফুটন্ত পানিতে ধুয়ে রোদে শুকান।',
        'স্থানটি সবসময় শুকনো ও পরিষ্কার রাখুন।',
      ],
    },
    safety_warnings: [
      'স্টেরয়েডযুক্ত মলম ব্যবহারের ফলে ছত্রাক ছড়িয়ে গিয়ে Tinea Incognito হতে পারে—স্টেরয়েড সম্পূর্ণ নিষিদ্ধ।',
    ],
  };
}
