/**
 * Comprehensive Mock Protocols for Blood, Urine, USG & Pathology Investigations.
 * Covers CBC, LFT, Lipid Profile, Urine R/M/E, Dengue NS1, Thyroid Profile, Electrolytes, USG.
 */

export function getCbcProtocol(combined: string) {
  const isDengue = combined.includes('dengue') || combined.includes('platelet') || combined.includes('থ্রম্বো') || combined.includes('প্লাটিলেট') || combined.includes('leukopenia');
  if (isDengue) {
    return {
      report_type: 'lab_report' as const,
      test_name: 'Complete Blood Count (CBC) with Platelets',
      clinical_impression: 'Severe Thrombocytopenia with Leukopenia (High suspicion of Dengue / Viral Hemorrhagic Fever)',
      key_findings: [
        'Total Platelet Count: 68,000 /cu.mm (Normal: 150,000 - 450,000)',
        'Total WBC Count: 3,200 /cu.mm (Leukopenia)',
        'Hematocrit (HCT): 44.8% (Borderline hemoconcentration)',
      ],
      extracted_metrics: { 'Platelet Count': '68,000 /cu.mm', 'WBC Count': '3,200 /cu.mm', 'Hematocrit': '44.8%', 'Hemoglobin': '13.2 g/dL' },
      abnormality_flags: ['CRITICAL ALERT: Thrombocytopenia (<100,000)', 'Leukopenia (WBC <4,000)'],
      suggested_diagnosis: 'Dengue Fever with Thrombocytopenia (DGHS Red Alert)',
      recommended_actions: ['প্রতি ২৪ ঘণ্টায় সিবিসি ও হেমাটোক্রিট মনিটরিং', 'পর্যাপ্ত ওরাল স্যালাইন ও ডাবের পানি', 'NSAIDs / ব্যথানাশক সম্পূর্ণ নিষিদ্ধ'],
      ai_summary: 'সিবিসি রিপোর্টে প্লাটিলেট আশঙ্কাজনকভাবে কমে ৬৮,০০০-এ নেমেছে এবং শ্বেতরক্তকণিকা কম (৩,২০০), যা ডেঙ্গু নির্দেশ করে।',
    };
  }

  const isAnemia = combined.includes('anemia') || combined.includes('hemoglobin') || combined.includes('hb') || combined.includes('রক্তস্বল্পতা');
  if (isAnemia) {
    return {
      report_type: 'lab_report' as const,
      test_name: 'Complete Blood Count (CBC)',
      clinical_impression: 'Moderate Microcytic Hypochromic Anemia (Iron Deficiency Anemia)',
      key_findings: [
        'Hemoglobin (Hb): 8.6 g/dL (Normal: 12.0 - 16.0 g/dL)',
        'MCV: 68 fL (Low, Microcytic)',
        'MCH: 22 pg (Low, Hypochromic)',
      ],
      extracted_metrics: { 'Hemoglobin': '8.6 g/dL', 'MCV': '68 fL', 'MCH': '22 pg', 'Platelet Count': '240,000 /cu.mm' },
      abnormality_flags: ['Moderate Anemia (Hb 8.6 g/dL)', 'Microcytosis & Hypochromia'],
      suggested_diagnosis: 'Iron Deficiency Anemia (লৌহ ঘাটতিজনিত রক্তস্বল্পতা)',
      recommended_actions: ['ওরাল আয়রন থেরাপি (Iron Polymaltose Complex)', 'Serum Ferritin পরীক্ষা', 'আয়রনসমৃদ্ধ পুষ্টিকর খাবার'],
      ai_summary: 'হিমোগ্লোবিন ৮.৬ গ্রাম/ডিএল-এ নেমে এসেছে যা মাঝারি মাত্রার মাইক্রোসাইটিক হাইপোক্রোমিক রক্তস্বল্পতা নির্দেশ করে।',
    };
  }

  // Normal CBC
  return {
    report_type: 'lab_report' as const,
    test_name: 'Complete Blood Count (CBC)',
    clinical_impression: 'সিবিসি রিপোর্ট সম্পূর্ণ স্বাভাবিক: হিমোগ্লোবিন, শ্বেতরক্তকণিকা ও প্লাটিলেট স্বাভাবিক সীমার মধ্যে রয়েছে।',
    key_findings: ['Hemoglobin: 13.8 g/dL', 'Total WBC: 7,400 /cu.mm', 'Platelets: 260,000 /cu.mm', 'ESR: 12 mm in 1st hour'],
    extracted_metrics: { 'Hemoglobin': '13.8 g/dL', 'Total WBC': '7,400 /cu.mm', 'Platelets': '260,000 /cu.mm', 'ESR': '12 mm' },
    abnormality_flags: [],
    suggested_diagnosis: '',
    recommended_actions: ['রুটিন পর্যবেক্ষণ।'],
    ai_summary: 'রক্তের সাধারণ পরীক্ষা সম্পূর্ণ স্বাভাবিক সীমার মধ্যে রয়েছে।',
  };
}

export function getLftProtocol(combined: string) {
  const isHigh = combined.includes('alt') || combined.includes('sgpt') || combined.includes('jaundice') || combined.includes('bilirubin') || combined.includes('জন্ডিস') || combined.includes('লিভার');
  if (isHigh) {
    return {
      report_type: 'lab_report' as const,
      test_name: 'Liver Function Test (LFT)',
      clinical_impression: 'Acute Hepatocellular Injury / Acute Viral Hepatitis (Significantly elevated transaminases)',
      key_findings: [
        'Serum ALT (SGPT): 215 U/L (Normal: up to 45 U/L)',
        'Serum AST (SGOT): 180 U/L (Normal: up to 40 U/L)',
        'Total Serum Bilirubin: 2.8 mg/dL (Normal: 0.2 - 1.2 mg/dL)',
      ],
      extracted_metrics: { 'ALT (SGPT)': '215 U/L', 'AST (SGOT)': '180 U/L', 'Total Bilirubin': '2.8 mg/dL', 'Alkaline Phosphatase': '110 U/L' },
      abnormality_flags: ['Significantly Elevated ALT/SGPT (215 U/L)', 'Hyperbilirubinemia (Jaundice)'],
      suggested_diagnosis: 'Acute Viral Hepatitis (হেপাটাইটিস / লিভার প্রদাহ)',
      recommended_actions: ['Viral Hepatitis Serology (HBsAg, Anti-HCV, Anti-HAV IgM)', 'হেপাটোটক্সিক ওষুধ ও তৈলাক্ত খাবার পরিহার', 'পর্যাপ্ত বিশ্রাম'],
      ai_summary: 'লিভারের এনজাইম ALT/SGPT মাত্রাতিরিক্ত (২১৫ U/L) এবং বিলিরুবিন বেশি, যা হেপাটাইটিস বা লিভার প্রদাহ নির্দেশ করে।',
    };
  }
  return {
    report_type: 'lab_report' as const,
    test_name: 'Liver Function Test (LFT)',
    clinical_impression: 'লিভার ফাংশন টেস্ট স্বাভাবিক: বিলিরুবিন ও এসজিপিটি প্রমিত সীমার মধ্যে রয়েছে।',
    key_findings: ['Serum ALT (SGPT): 28 U/L', 'Serum AST (SGOT): 25 U/L', 'Total Bilirubin: 0.8 mg/dL'],
    extracted_metrics: { 'ALT (SGPT)': '28 U/L', 'Total Bilirubin': '0.8 mg/dL' },
    abnormality_flags: [],
    suggested_diagnosis: '',
    recommended_actions: ['সুষম খাবার গ্রহণ করুন।'],
    ai_summary: 'লিভারের কার্যক্ষমতা স্বাভাবিক রয়েছে।',
  };
}

export function getLipidProtocol(combined: string) {
  const isHigh = combined.includes('cholesterol') || combined.includes('triglyceride') || combined.includes('lipid') || combined.includes('ldl') || combined.includes('লিপিড');
  if (isHigh) {
    return {
      report_type: 'lab_report' as const,
      test_name: 'Lipid Profile',
      clinical_impression: 'Mixed Dyslipidemia with High Atherogenic Risk',
      key_findings: [
        'Total Cholesterol: 248 mg/dL (Desirable: <200 mg/dL)',
        'Triglycerides (TG): 260 mg/dL (Normal: <150 mg/dL)',
        'LDL Cholesterol: 162 mg/dL (Optimal: <100 mg/dL)',
        'HDL Cholesterol: 38 mg/dL (Low: <40 mg/dL)',
      ],
      extracted_metrics: { 'Total Cholesterol': '248 mg/dL', 'Triglycerides': '260 mg/dL', 'LDL': '162 mg/dL', 'HDL': '38 mg/dL' },
      abnormality_flags: ['Hypercholesterolemia (248 mg/dL)', 'Elevated Triglycerides (260 mg/dL)', 'High LDL (162 mg/dL)'],
      suggested_diagnosis: 'Mixed Dyslipidemia (উচ্চ কোলেস্টেরল ও রক্তে চর্বি)',
      recommended_actions: ['স্ট্যাটিন থেরাপি (Atorvastatin 10-20mg)', 'চর্বিযুক্ত খাবার, ফাস্টফুড ও ঘি-মাখন সম্পূর্ণ বর্জন', 'প্রতিদিন ৪৫ মিনিট দ্রুত হাঁটা'],
      ai_summary: 'রক্তে ক্ষতিকর চর্বি এলডিএল (১৬২) ও ট্রাইগ্লিসারাইড (২৬০) বিপজ্জনক মাত্রায় বেশি পাওয়া গেছে।',
    };
  }
  return {
    report_type: 'lab_report' as const,
    test_name: 'Lipid Profile',
    clinical_impression: 'লিপিড প্রোফাইল স্বাভাবিক: রক্তে কোলেস্টেরল ও ট্রাইগ্লিসারাইড প্রমিত সীমার মধ্যে।',
    key_findings: ['Total Cholesterol: 175 mg/dL', 'Triglycerides: 130 mg/dL', 'LDL: 95 mg/dL', 'HDL: 48 mg/dL'],
    extracted_metrics: { 'Total Cholesterol': '175 mg/dL', 'Triglycerides': '130 mg/dL', 'LDL': '95 mg/dL', 'HDL': '48 mg/dL' },
    abnormality_flags: [],
    suggested_diagnosis: '',
    recommended_actions: ['স্বাস্থ্যকর খাদ্যাভ্যাস বজায় রাখুন।'],
    ai_summary: 'লিপিড প্রোফাইল স্বাভাবিক সীমার মধ্যে রয়েছে।',
  };
}

export function getUrineProtocol(combined: string) {
  const isUti = combined.includes('pus') || combined.includes('uti') || combined.includes('urine') || combined.includes('প্রস্রাব') || combined.includes('infection') || combined.includes('protein');
  if (isUti) {
    return {
      report_type: 'lab_report' as const,
      test_name: 'Urine Routine & Microscopic Examination (R/M/E)',
      clinical_impression: 'Active Urinary Tract Infection (Pyuria & Bacteriuria)',
      key_findings: [
        'Pus Cells: 18-22 /HPF (Significantly elevated; Normal: 0-4)',
        'Epithelial Cells: 8-10 /HPF',
        'RBC: 2-4 /HPF',
        'Nitrite: Positive (+)',
        'Protein (Albumin): Trace / 1+',
      ],
      extracted_metrics: { 'Pus Cells': '18-22 /HPF', 'Epithelial Cells': '8-10 /HPF', 'Nitrite': 'Positive', 'Protein': '1+' },
      abnormality_flags: ['Significant Pyuria (Pus cells 18-22)', 'Positive Nitrite (UTI)'],
      suggested_diagnosis: 'Urinary Tract Infection (UTI / মূত্রনালীর সংক্রমণ)',
      recommended_actions: ['Urine Culture & Sensitivity (C/S)', 'উপযুক্ত অ্যান্টিবায়োটিক (Cefixime / Nitrofurantoin)', 'প্রতিদিন ৩ লিটার পানি পান'],
      ai_summary: 'প্রস্রাবের পরীক্ষায় পাস সেল ১৮-২২ পাওয়া গেছে যা সক্রিয় প্রস্রাবের ইনফেকশন নির্দেশ করে।',
    };
  }
  return {
    report_type: 'lab_report' as const,
    test_name: 'Urine R/M/E',
    clinical_impression: 'প্রস্রাবের রুটিন পরীক্ষা স্বাভাবিক: কোনো পুঁজ, প্রোটিন বা সংক্রমণ পাওয়া যায়নি।',
    key_findings: ['Pus Cells: 1-2 /HPF (Normal)', 'RBC: Nil', 'Albumin: Nil', 'Sugar: Nil'],
    extracted_metrics: { 'Pus Cells': '1-2 /HPF', 'Sugar': 'Nil', 'Albumin': 'Nil' },
    abnormality_flags: [],
    suggested_diagnosis: '',
    recommended_actions: ['পর্যাপ্ত পানি পানের অভ্যাস রাখুন।'],
    ai_summary: 'প্রস্রাবের রিপোর্ট সম্পূর্ণ স্বাভাবিক।',
  };
}

export function getThyroidProtocol(combined: string) {
  const isHypo = combined.includes('tsh') || combined.includes('thyroid') || combined.includes('থাইরয়েড') || combined.includes('ft4');
  if (isHypo) {
    return {
      report_type: 'lab_report' as const,
      test_name: 'Thyroid Function Profile (Serum TSH & FT4)',
      clinical_impression: 'Primary Hypothyroidism (Elevated TSH with low-normal Free T4)',
      key_findings: [
        'Serum TSH: 8.85 mIU/L (Significantly elevated; Normal: 0.4 - 4.5)',
        'Free T4 (FT4): 0.82 ng/dL (Low-normal; Normal: 0.9 - 1.7)',
      ],
      extracted_metrics: { 'TSH': '8.85 mIU/L', 'Free T4': '0.82 ng/dL' },
      abnormality_flags: ['Elevated Serum TSH (8.85 mIU/L)', 'Primary Hypothyroidism'],
      suggested_diagnosis: 'Primary Hypothyroidism (হাইপোথাইরয়েডিজম)',
      recommended_actions: ['Levothyroxine (Thyrox 25-50 mcg) সকালে খালি পেটে', '৬-৮ সপ্তাহ পর TSH পুনরায় পরীক্ষা'],
      ai_summary: 'রক্তে TSH মাত্রা বেশি (৮.৮৫) পাওয়া গেছে যা হাইপোথাইরয়েডিজম নির্দেশ করে।',
    };
  }
  return {
    report_type: 'lab_report' as const,
    test_name: 'Thyroid Profile',
    clinical_impression: 'থাইরয়েড হরমোন স্বাভাবিক সীমার মধ্যে রয়েছে।',
    key_findings: ['Serum TSH: 2.4 mIU/L (Normal: 0.4 - 4.5)', 'Free T4: 1.2 ng/dL (Normal)'],
    extracted_metrics: { 'TSH': '2.4 mIU/L', 'FT4': '1.2 ng/dL' },
    abnormality_flags: [],
    suggested_diagnosis: '',
    recommended_actions: ['রুটিন পর্যবেক্ষণ।'],
    ai_summary: 'থাইরয়েড ফাংশন সম্পূর্ণ স্বাভাবিক।',
  };
}

export function getUsgProtocol(combined: string) {
  const isFatty = combined.includes('usg') || combined.includes('ultrasound') || combined.includes('fatty') || combined.includes('আল্ট্রাসাউন্ড') || combined.includes('gallbladder') || combined.includes('লিভার');
  if (isFatty) {
    return {
      report_type: 'other' as const,
      test_name: 'USG of Whole Abdomen',
      clinical_impression: 'Grade-II Fatty Liver (Hepatic Steatosis) with Normal Biliary System',
      key_findings: [
        'Diffuse increased parenchymal echogenicity of the liver with posterior acoustic attenuation',
        'Liver size mildly enlarged (15.2 cm)',
        'Gallbladder, spleen, pancreas, and kidneys appear sonographically normal',
      ],
      extracted_metrics: { 'Liver Size': '15.2 cm', 'Fatty Liver': 'Grade-II', 'Gallbladder': 'Normal' },
      abnormality_flags: ['Grade-II Fatty Infiltration of Liver'],
      suggested_diagnosis: 'Non-Alcoholic Fatty Liver Disease (Grade-II NAFLD)',
      recommended_actions: ['খাদ্যাভ্যাস নিয়ন্ত্রণ ও ওজন কমানো', 'নিয়মিত শরীরচর্চা ও হাঁটা', 'মিষ্টি ও অতিরিক্ত তৈলাক্ত খাবার বর্জন'],
      ai_summary: 'আল্ট্রাসনোগ্রাফিতে গ্রেড-২ ফ্যাটি লিভার শনাক্ত হয়েছে। ওজন নিয়ন্ত্রণ ও ডায়েট জরুরি।',
    };
  }
  return {
    report_type: 'other' as const,
    test_name: 'USG of Whole Abdomen',
    clinical_impression: 'আল্ট্রাসনোগ্রাফি স্বাভাবিক: পেটের প্রধান অঙ্গসমূহ স্বাভাবিক সীমার মধ্যে রয়েছে।',
    key_findings: ['Liver, Gallbladder, Pancreas, Spleen and Kidneys are sonographically normal.'],
    extracted_metrics: { 'Abdominal Organs': 'Normal' },
    abnormality_flags: [],
    suggested_diagnosis: '',
    recommended_actions: ['রুটিন স্বাস্থ্যবিধি বজায় রাখুন।'],
    ai_summary: 'পেটের আল্ট্রাসনোগ্রাম পরীক্ষায় কোনো অস্বাভাবিকতা পাওয়া যায়নি।',
  };
}
