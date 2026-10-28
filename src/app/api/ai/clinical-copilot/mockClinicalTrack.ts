/**
 * Comprehensive Clinical Decision Support Rule Engine for Bangladesh Outpatient Practice.
 * Conforms to DGHS, icddr,b (diarrhea), BIRDEM (diabetes), and "Master The Chamber" guidelines.
 */
export function mockClinicalTrack(context: any) {
  const complaints: string[] = context?.current_complaints || [];
  const allergies: string[] = context?.allergies || [];
  const conditions: string[] = context?.chronic_conditions || [];
  const findings: string = context?.clinicalFindings || '';

  const text = `${complaints.join(' ')} ${conditions.join(' ')} ${findings}`.toLowerCase();

  // 1. Acute Gastroenteritis / Diarrhea / Vomiting / Cholera / Food Poisoning
  const isGastro =
    text.includes('vomit') ||
    text.includes('diarrhea') ||
    text.includes('diarrhoea') ||
    text.includes('loose motion') ||
    text.includes('watery') ||
    text.includes('stool') ||
    text.includes('cholera') ||
    text.includes('food poisoning') ||
    text.includes('gastroenteritis') ||
    text.includes('dysentery') ||
    text.includes('বমি') ||
    text.includes('পাতলা পায়খানা') ||
    text.includes('ডায়রিয়া') ||
    text.includes('আমাশয়');

  // 2. Fever / Dengue / Upper Respiratory Infection
  const isFever =
    !isGastro &&
    (text.includes('fever') ||
      text.includes('cough') ||
      text.includes('cold') ||
      text.includes('dengue') ||
      text.includes('sore throat') ||
      text.includes('জ্বর') ||
      text.includes('কাশি') ||
      text.includes('কফ') ||
      text.includes('সর্দি'));

  // 3. Peptic Dyspepsia / GERD / Gastritis / Acid Peptic Disease
  const isGastric =
    !isGastro &&
    (text.includes('gerd') ||
      text.includes('heartburn') ||
      text.includes('acidity') ||
      text.includes('gastric') ||
      text.includes('burning') ||
      text.includes('pud') ||
      text.includes('বুক জ্বালা') ||
      text.includes('টক ঢেকুর') ||
      text.includes('গ্যাস'));

  // 4. Urinary Tract Infection / Dysuria
  const isUTI =
    text.includes('uti') ||
    text.includes('dysuria') ||
    text.includes('burning micturition') ||
    text.includes('urine') ||
    text.includes('প্রস্রাবে জ্বালা');

  // 5. Musculoskeletal / Back Pain / Body Ache / Arthritis
  const isPain =
    text.includes('back pain') ||
    text.includes('body ache') ||
    text.includes('joint pain') ||
    text.includes('arthritis') ||
    text.includes('ব্যথা') ||
    text.includes('বাত');

  // 6. Diabetes Mellitus
  const isDiabetic = text.includes('diabetes') || text.includes('sugar') || text.includes('ডায়াবেটিস');

  // 7. Hypertension / CVD
  const isHTN = text.includes('hypertension') || text.includes('high bp') || text.includes('chest pain') || text.includes('উচ্চ রক্তচাপ');

  const warnings: string[] = [];
  allergies.forEach((a) => warnings.push(`Patient has known allergy to: ${a}. Avoid cross-reactive drug classes.`));
  if (conditions.includes('Hypertension') || isHTN) {
    warnings.push('Avoid NSAIDs if possible to prevent BP elevation or nephrotoxicity.');
  }

  const medications: Array<{
    generic_name: string;
    suggested_brand: string;
    strength: string;
    schedule: string;
    duration: string;
    rationale: string;
  }> = [];
  const questions: Array<{
    id: string;
    question: string;
    options: string[];
    hint: string;
  }> = [];

  if (isGastro) {
    // icddr,b & DGHS Diarrhea / Gastroenteritis Protocol
    medications.push({
      generic_name: 'Oral Rehydration Salts',
      suggested_brand: 'ORS Saline-N',
      strength: '1 Sachet / 500ml',
      schedule: 'SOS',
      duration: '5 Days',
      rationale: 'icddr,b Protocol: Essential fluid & electrolyte replenishment after each watery loose stool.',
    });
    medications.push({
      generic_name: 'Zinc Sulphate',
      suggested_brand: 'Baby Zinc',
      strength: '20 mg',
      schedule: '1+0+0',
      duration: '14 Days',
      rationale: 'DGHS / WHO Protocol: Promotes rapid intestinal mucosal regeneration and reduces recurrence.',
    });
    medications.push({
      generic_name: 'Domperidone',
      suggested_brand: 'Motigut',
      strength: '10 mg',
      schedule: '1+1+1',
      duration: '5 Days',
      rationale: 'Antiemetic and upper GI prokinetic to arrest persistent vomiting so oral fluids are retained.',
    });
    medications.push({
      generic_name: 'Bacillus clausii spores',
      suggested_brand: 'Enterogermina',
      strength: '2 billion / 5ml',
      schedule: '1+0+1',
      duration: '5 Days',
      rationale: 'Restores beneficial gut microflora disrupted by infectious diarrheal purging.',
    });

    questions.push({
      id: 'dehydration_signs',
      question: 'পানির পিপাসা, প্রস্রাবের পরিমাণ বা চোখ বসে যাওয়ার তীব্রতা কেমন? (Dehydration Assessment)',
      options: [
        'তীব্র পিপাসা, চোখ সামান্য বসা ও প্রস্রাব কম (Some Dehydration)',
        'স্বাভাবিক পিপাসা ও পর্যাপ্ত প্রস্রাব (No Dehydration)',
        'চরম নিস্তেজ ভাব, চামড়া ঢিলে ও প্রস্রাব বন্ধ (Severe Dehydration)',
      ],
      hint: 'icddr,b গাইডলাইন অনুযায়ী ওআরএস নাকি হাসপাতালে আইভি স্যালাইনের রেফারেল প্রয়োজন তা নির্ধারণে।',
    });
    questions.push({
      id: 'stool_consistency',
      question: 'পায়খানার ধরন কেমন? শুধুই চাল-ধোয়া পানির মতো নাকি আম/রক্তযুক্ত ও পেটে মোচড় দেয়?',
      options: [
        'প্রচুর চালের মাড়ের মতো পানির মতো পাতলা পায়খানা',
        'রক্ত ও শ্লেষ্মা (আম) যায় ও তীব্র পেট মোচড়ায় (Dysentery)',
        'হলুদাভ আধা-তরল পায়খানা সাথে পেট ফাঁপা',
      ],
      hint: 'ওয়াটারি ডায়রিয়া বনাম ব্যাকটেরিয়াল ব্যাসিলারি আমাশয় (Dysentery) আলাদা করতে।',
    });
    questions.push({
      id: 'prior_allergy',
      question: 'পূর্বে কোনো অ্যান্টিবায়োটিক বা ব্যথানাশক ওষুধ খেয়ে অ্যালার্জি হয়েছিল কি?',
      options: ['না, কোনো অ্যালার্জি নেই', 'সিপ্রোফ্লক্সাসিন বা কুইনোলোন অ্যালার্জি', 'পেনিসিলিন অ্যালার্জি'],
      hint: 'রোগীর ড্রাগ সেফটি নিশ্চিত করতে।',
    });

    warnings.push('WARNING: Strictly avoid anti-motility agents (Loperamide/Imodium) in acute infectious diarrhea as it traps bacterial enterotoxins and risks toxic megacolon.');
  } else if (isFever) {
    // Dengue / Viral Fever Protocol
    medications.push({
      generic_name: 'Paracetamol',
      suggested_brand: 'Napa Extend',
      strength: '665 mg',
      schedule: '1+1+1',
      duration: '5 Days',
      rationale: 'First-line antipyretic & analgesic. Strictly avoid NSAIDs / Steroids due to dengue bleeding risks.',
    });
    medications.push({
      generic_name: 'Fexofenadine',
      suggested_brand: 'Fexo',
      strength: '120 mg',
      schedule: '0+0+1',
      duration: '7 Days',
      rationale: 'Non-sedating antihistamine for allergic rhinitis, sneezing, and runny nose.',
    });
    medications.push({
      generic_name: 'Esomeprazole',
      suggested_brand: 'Maxpro',
      strength: '20 mg',
      schedule: '1+0+1',
      duration: '7 Days',
      rationale: 'Gastroprotection during febrile illness.',
    });

    questions.push({
      id: 'fever_chills',
      question: 'জ্বরের সাথে কাঁপুনি (Chills/Rigor) বা রাতে অতিরিক্ত ঘাম দেওয়ার তীব্রতা কেমন?',
      options: ['স্বাভাবিক জ্বর (কাঁপুনি নেই)', 'তীব্র কাঁপুনি হয় (Chills/Rigor)', 'রাতে বেশি ঘাম হয়'],
      hint: 'ইনফেকশাস বনাম ভাইরাল এটিওলজি মূল্যায়নের জন্য।',
    });
    questions.push({
      id: 'dengue_warning',
      question: 'চোখের পেছনে ব্যথা, গায়ে ফুসকুড়ি বা দাঁতের মাড়ি দিয়ে রক্তপাত আছে কি?',
      options: ['না, কোনো রক্তপাত নেই', 'চোখের পেছনে তীব্র ব্যথা আছে', 'গায়ে লাল ফুসকুড়ি আছে'],
      hint: 'ডেঙ্গু ওয়ার্নিং সাইন মূল্যায়নের জন্য।',
    });
  } else if (isGastric) {
    // GERD / PUD Protocol
    medications.push({
      generic_name: 'Esomeprazole',
      suggested_brand: 'Sergel',
      strength: '20 mg',
      schedule: '1+0+1',
      duration: '14 Days',
      rationale: 'Proton-pump inhibitor for acid suppression and mucosal healing.',
    });
    medications.push({
      generic_name: 'Domperidone',
      suggested_brand: 'Motigut',
      strength: '10 mg',
      schedule: '1+1+1',
      duration: '10 Days',
      rationale: 'Prokinetic to accelerate gastric emptying and reduce reflux.',
    });
    medications.push({
      generic_name: 'Magaldrate + Simethicone',
      suggested_brand: 'Entacyd Plus',
      strength: '200 ml',
      schedule: '2 spoons TDS',
      duration: '7 Days',
      rationale: 'Fast mucosal coating and anti-flatulence relief.',
    });

    questions.push({
      id: 'gastric_relation',
      question: 'বুক জ্বালাপোড়া বা পেটব্যথা কি খাওয়ার পর বেশি হয় নাকি খালি পেটে?',
      options: ['খাওয়ার পর বুক জ্বালা করে', 'খালি পেটে কামড়ায়', 'রাতে ঘুমানোর সময় বাড়ে'],
      hint: 'GERD বনাম গ্যাস্ট্রিক আলসার চিহ্নিত করতে।',
    });
  } else if (isPain) {
    // Musculoskeletal / Back Pain Protocol
    medications.push({
      generic_name: 'Naproxen',
      suggested_brand: 'Napryn',
      strength: '500 mg',
      schedule: '1+0+1',
      duration: '7 Days',
      rationale: 'NSAID for musculoskeletal pain relief.',
    });
    medications.push({
      generic_name: 'Esomeprazole',
      suggested_brand: 'Maxpro',
      strength: '20 mg',
      schedule: '1+0+1',
      duration: '7 Days',
      rationale: 'Mandatory gastroprotection against NSAID ulceration.',
    });
  } else if (isUTI) {
    // UTI Protocol
    medications.push({
      generic_name: 'Cefixime',
      suggested_brand: 'Cef-3',
      strength: '200 mg',
      schedule: '1+0+1',
      duration: '7 Days',
      rationale: 'Empirical cephalosporin for uncomplicated UTI.',
    });
    medications.push({
      generic_name: 'Potassium Citrate',
      suggested_brand: 'Urikal',
      strength: 'Syrup 200ml',
      schedule: '2 spoons TDS',
      duration: '7 Days',
      rationale: 'Urinary alkalizer to relieve burning dysuria.',
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
    // General Chamber Consultation
    medications.push({
      generic_name: 'Paracetamol',
      suggested_brand: 'Fast',
      strength: '500 mg',
      schedule: '1+0+1',
      duration: '5 Days',
      rationale: 'Symptomatic relief as needed.',
    });
  }

  // Filter doctor answers that specifically match current questions
  const answers = context?.doctor_answers;
  const relevantAnswers = Object.entries(answers || {})
    .filter(([qId]) => questions.some((q) => q.id === qId))
    .map(([, ans]) => String(ans));

  const summary = relevantAnswers.length > 0
    ? `ডাক্তারের ইনপুট (${relevantAnswers.join(', ')}) বিশ্লেষণ করে নিখুঁত ক্লিনিক্যাল ট্র্যাক তৈরি করা হয়েছে।`
    : `রোগীর প্রধান উপসর্গ (${complaints.join(', ') || 'উপসর্গ'}) ও ক্লিনিক্যাল প্রোফাইল পর্যালোচনা করে এআই কো-পাইলট প্রস্তাবনা।`;

  const diffs = isGastro
    ? [
        'Acute Watery Diarrhea (AWD) with Mild to Moderate Dehydration',
        'Acute Gastroenteritis (Infectious / Food Poisoning)',
        'Bacillary Dysentery (Shigellosis)',
        'Secretory Diarrhea Syndrome',
      ]
    : isFever
      ? ['Acute Viral Upper Respiratory Tract Infection', 'Dengue Fever Syndrome', 'Seasonal Influenza']
      : isGastric
        ? ['Gastroesophageal Reflux Disease (GERD)', 'Peptic Ulcer Disease (PUD)', 'Functional Dyspepsia']
        : isPain
          ? ['Mechanical Lower Back Pain / Lumbago', 'Musculoskeletal Strain', 'Facet Arthropathy']
          : isUTI
            ? ['Acute Uncomplicated Cystitis (UTI)', 'Lower Urinary Tract Infection']
            : isDiabetic
              ? ['Type 2 Diabetes Mellitus with Metabolic Syndrome', 'Impaired Fasting Glucose']
              : ['General Malaise / Tension Syndrome', 'Non-specific Functional Asthenia'];

  const investigations = isGastro
    ? [
        'Stool for R/M/E & Routine Microscopic Examination (Pus cells, RBC, cysts, trophozoites)',
        'Serum Electrolytes (Na+, K+, Cl-, HCO3-) for dehydration/hypokalemia assessment',
        'Complete Blood Count (CBC) with ESR',
      ]
    : isFever
      ? ['Complete Blood Count (CBC) with Platelets', 'NS1 Ag (if fever within 3 days)', 'Urine R/M/E']
      : isGastric
        ? ['Upper GI Endoscopy (if red flag symptoms present)', 'Serum H. pylori Stool Antigen', 'USG of Whole Abdomen']
        : isUTI
          ? ['Urine R/M/E & Routine Examination', 'Urine Culture & Sensitivity (C/S)']
          : ['Complete Blood Count (CBC)', 'Fasting Blood Sugar & Serum Creatinine'];

  return {
    differential_diagnoses: diffs,
    suggested_medications: medications,
    recommended_investigations: investigations,
    safety_warnings: warnings.length > 0 ? warnings : ['Verify baseline renal and hepatic parameters before long-term therapy.'],
    clinical_questions: questions,
    clinical_summary: summary,
  };
}
