/**
 * MedRecord — static seed payloads for the first-run local database.
 * Master medicine catalog (30 entries) + 2 demo patients with past visits.
 * IDs/timestamps/sync_status are stamped in seed.ts.
 */
import type { DosageForm, MealTiming } from '@/types/schema';

export const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export interface MedicineSeed {
  brand_name: string;
  generic_name: string;
  dosage_form: DosageForm;
  strength: string;
  manufacturer: string;
  contraindications: string[];
}

export interface EncounterSeed {
  visit_date: string;
  chief_complaints: string[];
  vitals: { bp: string; pulse: string; temp: string; weight: string; spo2: string };
  clinical_findings: string;
  diagnosis: string[];
  advice: string[];
  follow_up_date: string | null;
  prescriptions: PrescriptionSeed[];
}

export interface PrescriptionSeed {
  brand_name: string;
  generic_name: string;
  dosage_form: DosageForm;
  strength: string;
  schedule: string;
  meal_timing: MealTiming;
  duration: string;
  special_instructions: string;
}

export interface PatientSeed {
  patient_code: string;
  full_name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  blood_group: string;
  chronic_conditions: string[];
  allergies: string[];
  medical_surgical_history: string;
  encounters: EncounterSeed[];
}

/** Commonly prescribed authentic Bangladesh pharmaceutical brand medicines for offline-first chamber use. */
export const MEDICINE_SEEDS: MedicineSeed[] = [
  // Paracetamol
  { brand_name: 'Napa Extend', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '665mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Severe liver disease', 'Allergy to paracetamol'] },
  { brand_name: 'Napa', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Severe liver disease'] },
  { brand_name: 'Ace', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Severe liver disease'] },
  { brand_name: 'Fast', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '500mg', manufacturer: 'The ACME Laboratories Ltd.', contraindications: ['Severe liver disease'] },

  // Gastric & PPI
  { brand_name: 'Maxpro', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Severe hypomagnesemia'] },
  { brand_name: 'Sergel', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20mg', manufacturer: 'Healthcare Pharmaceuticals Ltd.', contraindications: ['Hypersensitivity to esomeprazole'] },
  { brand_name: 'Nexum', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', contraindications: ['Hypersensitivity'] },
  { brand_name: 'Pantonix', generic_name: 'Pantoprazole', dosage_form: 'Tab', strength: '20mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', contraindications: ['Hypersensitivity'] },
  { brand_name: 'Seclo', generic_name: 'Omeprazole', dosage_form: 'Cap', strength: '20mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Known hypersensitivity'] },
  { brand_name: 'Losectil', generic_name: 'Omeprazole', dosage_form: 'Cap', strength: '20mg', manufacturer: 'Eskayef Pharmaceuticals Ltd.', contraindications: ['Known hypersensitivity'] },

  // Antiemetic & Prokinetic
  { brand_name: 'Motigut', generic_name: 'Domperidone', dosage_form: 'Tab', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Prolactinoma', 'GI hemorrhage'] },
  { brand_name: 'Omidon', generic_name: 'Domperidone', dosage_form: 'Tab', strength: '10mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', contraindications: ['Prolactinoma'] },
  { brand_name: 'Deflux', generic_name: 'Domperidone', dosage_form: 'Tab', strength: '10mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['GI bleeding'] },
  { brand_name: 'Entacyd Plus', generic_name: 'Magaldrate + Simethicone', dosage_form: 'Syr', strength: '200ml', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Severe renal impairment'] },

  // Hypertension & Heart
  { brand_name: 'Amlocard', generic_name: 'Amlodipine', dosage_form: 'Tab', strength: '5mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Severe hypotension', 'Cardiogenic shock'] },
  { brand_name: 'Camlodin', generic_name: 'Amlodipine', dosage_form: 'Tab', strength: '5mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Severe hypotension'] },
  { brand_name: 'Amlopin', generic_name: 'Amlodipine', dosage_form: 'Tab', strength: '5mg', manufacturer: 'The ACME Laboratories Ltd.', contraindications: ['Hypotension'] },
  { brand_name: 'Bisocor', generic_name: 'Bisoprolol', dosage_form: 'Tab', strength: '2.5mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Severe bradycardia', 'Cardiogenic shock', 'Severe asthma'] },
  { brand_name: 'Cardibis', generic_name: 'Bisoprolol', dosage_form: 'Tab', strength: '2.5mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Severe bradycardia'] },
  { brand_name: 'Telmax', generic_name: 'Telmisartan', dosage_form: 'Tab', strength: '40mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Pregnancy', 'Biliary obstruction'] },
  { brand_name: 'Arbitel', generic_name: 'Telmisartan', dosage_form: 'Tab', strength: '40mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Pregnancy'] },
  { brand_name: 'Telsar', generic_name: 'Telmisartan', dosage_form: 'Tab', strength: '40mg', manufacturer: 'The ACME Laboratories Ltd.', contraindications: ['Pregnancy'] },
  { brand_name: 'Angilock', generic_name: 'Losartan Potassium', dosage_form: 'Tab', strength: '50mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Pregnancy'] },
  { brand_name: 'Osartil', generic_name: 'Losartan Potassium', dosage_form: 'Tab', strength: '50mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', contraindications: ['Pregnancy'] },

  // Lipid & Antiplatelet
  { brand_name: 'Rostar', generic_name: 'Rosuvastatin', dosage_form: 'Tab', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Active liver disease', 'Pregnancy'] },
  { brand_name: 'Atova', generic_name: 'Atorvastatin', dosage_form: 'Tab', strength: '10mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Active liver disease'] },
  { brand_name: 'Lipicon', generic_name: 'Rosuvastatin', dosage_form: 'Tab', strength: '10mg', manufacturer: 'The ACME Laboratories Ltd.', contraindications: ['Liver disease'] },
  { brand_name: 'Ecosprin', generic_name: 'Aspirin', dosage_form: 'Tab', strength: '75mg', manufacturer: 'The ACME Laboratories Ltd.', contraindications: ['Active peptic ulcer', 'Bleeding disorders', 'Dengue fever'] },
  { brand_name: 'Anclog', generic_name: 'Clopidogrel', dosage_form: 'Tab', strength: '75mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Active pathological bleeding'] },

  // Respiratory & Antiallergic
  { brand_name: 'Monas', generic_name: 'Montelukast', dosage_form: 'Tab', strength: '10mg', manufacturer: 'The ACME Laboratories Ltd.', contraindications: ['Hypersensitivity'] },
  { brand_name: 'Montene', generic_name: 'Montelukast', dosage_form: 'Tab', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Hypersensitivity'] },
  { brand_name: 'Provair', generic_name: 'Montelukast', dosage_form: 'Tab', strength: '10mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', contraindications: ['Hypersensitivity'] },
  { brand_name: 'Fexo', generic_name: 'Fexofenadine', dosage_form: 'Tab', strength: '120mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Severe renal impairment'] },
  { brand_name: 'Fixal', generic_name: 'Fexofenadine', dosage_form: 'Tab', strength: '120mg', manufacturer: 'The ACME Laboratories Ltd.', contraindications: ['Renal failure'] },
  { brand_name: 'Bilastin', generic_name: 'Bilastine', dosage_form: 'Tab', strength: '20mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Renal impairment'] },
  { brand_name: 'Bilaxten', generic_name: 'Bilastine', dosage_form: 'Tab', strength: '20mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', contraindications: ['Hypersensitivity'] },
  { brand_name: 'Alatrol', generic_name: 'Cetirizine', dosage_form: 'Tab', strength: '10mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Severe renal failure'] },
  { brand_name: 'Azmasol Inhaler', generic_name: 'Salbutamol', dosage_form: 'Drop', strength: '100mcg/puff', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Hypersensitivity'] },

  // Antibiotics
  { brand_name: 'Cef-3', generic_name: 'Cefixime', dosage_form: 'Cap', strength: '200mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Cephalosporin allergy'] },
  { brand_name: 'Kilmax', generic_name: 'Cefuroxime', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Cephalosporin allergy'] },
  { brand_name: 'Curocef', generic_name: 'Cefuroxime', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Cephalosporin allergy'] },
  { brand_name: 'Cerox-A', generic_name: 'Cefuroxime', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', contraindications: ['Cephalosporin allergy'] },
  { brand_name: 'Furocef', generic_name: 'Cefuroxime', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Healthcare Pharmaceuticals Ltd.', contraindications: ['Cephalosporin allergy'] },
  { brand_name: 'Zithrin', generic_name: 'Azithromycin', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Macrolide allergy', 'Hepatic impairment'] },
  { brand_name: 'Tridosil', generic_name: 'Azithromycin', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Macrolide allergy'] },
  { brand_name: 'Moxaclav', generic_name: 'Amoxicillin + Clavulanic Acid', dosage_form: 'Tab', strength: '625mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Penicillin allergy', 'Jaundice history'] },

  // Antidiabetic
  { brand_name: 'Comet', generic_name: 'Metformin', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['eGFR < 30', 'Metabolic acidosis'] },
  { brand_name: 'Daomet', generic_name: 'Metformin', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['eGFR < 30'] },
  { brand_name: 'Metfo', generic_name: 'Metformin', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Incepta Pharmaceuticals Ltd.', contraindications: ['Severe renal impairment'] },
  { brand_name: 'Informet', generic_name: 'Metformin', dosage_form: 'Tab', strength: '500mg', manufacturer: 'The ACME Laboratories Ltd.', contraindications: ['Renal failure'] },

  // Pain & Musculoskeletal
  { brand_name: 'Napryn', generic_name: 'Naproxen', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Active peptic ulcer', 'CKD', 'Dengue'] },
  { brand_name: 'Flexi', generic_name: 'Aceclofenac', dosage_form: 'Tab', strength: '100mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Peptic ulcer disease', 'Renal impairment'] },
  { brand_name: 'Clofenac Gel', generic_name: 'Diclofenac Diethylamine', dosage_form: 'Oint', strength: '1%', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Broken skin'] },

  // Topicals (Creams, Ointments, Gels & Scabies)
  { brand_name: 'Permin', generic_name: 'Permethrin', dosage_form: 'Cream', strength: '5% w/w', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Hypersensitivity to pyrethroids'] },
  { brand_name: 'Afun', generic_name: 'Clotrimazole', dosage_form: 'Cream', strength: '1%', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Hypersensitivity'] },
  { brand_name: 'Halobet', generic_name: 'Halobetasol Propionate', dosage_form: 'Cream', strength: '0.05%', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Viral skin infections', 'Facial rosacea'] },
  { brand_name: 'Halovar', generic_name: 'Halobetasol Propionate', dosage_form: 'Cream', strength: '0.05%', manufacturer: 'Incepta Pharmaceuticals Ltd.', contraindications: ['Viral skin infections', 'Facial rosacea'] },
  { brand_name: 'Dermasol', generic_name: 'Clobetasol Propionate', dosage_form: 'Cream', strength: '0.05%', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Viral skin infections', 'Facial rosacea'] },
  { brand_name: 'Econate Plus', generic_name: 'Econazole Nitrate + Triamcinolone', dosage_form: 'Cream', strength: 'Standard', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Hypersensitivity'] },
  { brand_name: 'Bactroban', generic_name: 'Mupirocin', dosage_form: 'Oint', strength: '2%', manufacturer: 'GSK / Square', contraindications: ['Open extensive burn wounds'] },
  { brand_name: 'Burnsil', generic_name: 'Silver Sulfadiazine', dosage_form: 'Cream', strength: '1%', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Sulfa allergy', 'Late pregnancy'] },

  // Suppositories & Pessaries
  { brand_name: 'Candid-V', generic_name: 'Clotrimazole', dosage_form: 'Pessary', strength: '500mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Hypersensitivity'] },
  { brand_name: 'Glycerin Suppository', generic_name: 'Glycerin', dosage_form: 'Supp', strength: '2.25g', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Acute abdomen'] },
  { brand_name: 'Clofenac Suppository', generic_name: 'Diclofenac Sodium', dosage_form: 'Supp', strength: '50mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Proctitis', 'Active peptic ulcer'] },

  // Injections & Inhalers
  { brand_name: 'Ceftron', generic_name: 'Ceftriaxone', dosage_form: 'Inj', strength: '1g (IV/IM)', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Cephalosporin allergy'] },
  { brand_name: 'Azmasol Inhaler', generic_name: 'Salbutamol', dosage_form: 'Inhaler', strength: '100mcg/puff', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Hypersensitivity'] },
  { brand_name: 'Moxacav Eye Drops', generic_name: 'Moxifloxacin', dosage_form: 'Drop', strength: '0.5%', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Hypersensitivity'] },

  // Vitamins & Supportive
  { brand_name: 'Neuro-B', generic_name: 'Vitamin B1 + B6 + B12', dosage_form: 'Tab', strength: 'Standard', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Levodopa therapy'] },
  { brand_name: 'Filwel Gold', generic_name: 'Multivitamin + Multimineral', dosage_form: 'Tab', strength: 'Standard', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Component hypersensitivity'] },
  { brand_name: 'Bextram Gold', generic_name: 'Multivitamin + Multimineral', dosage_form: 'Tab', strength: 'Standard', manufacturer: 'Beximco Pharmaceuticals Ltd.', contraindications: ['Component hypersensitivity'] },
  { brand_name: 'D-Rise', generic_name: 'Cholecalciferol', dosage_form: 'Cap', strength: '20000 IU', manufacturer: 'The ACME Laboratories Ltd.', contraindications: ['Hypercalcemia'] },
  { brand_name: 'Baby Zinc', generic_name: 'Zinc Sulphate', dosage_form: 'Tab', strength: '20mg', manufacturer: 'Square Pharmaceuticals PLC', contraindications: ['Hypersensitivity'] },
  { brand_name: 'ORS Saline-N', generic_name: 'Oral Rehydration Salts', dosage_form: 'Sachet', strength: '1 Sachet / 500ml', manufacturer: 'SMC / Square Pharmaceuticals PLC', contraindications: ['Intestinal obstruction'] },
];

/** Two demo patients with past visits for immediate testing. */
export const PATIENT_SEEDS: PatientSeed[] = [
  {
    patient_code: 'P-0001',
    full_name: 'আব্দুল করিম (Abdul Karim)',
    age: 52,
    gender: 'male',
    phone: '01711-234567',
    blood_group: 'B+',
    chronic_conditions: ['Type 2 Diabetes', 'Hypertension'],
    allergies: ['Sulfa drugs'],
    medical_surgical_history: 'Hypertension and T2DM under regular medication. On Comet 500mg and Amlocard 5mg.',
    encounters: [
      {
        visit_date: '2024-01-10',
        chief_complaints: ['দুর্বলতা ও ক্লান্তি', 'তৃষ্ণা বৃদ্ধি', 'ঘন ঘন প্রস্রাব'],
        vitals: { bp: '140/88', pulse: '78', temp: '98.4 F', weight: '72 kg', spo2: '98' },
        clinical_findings: 'Overweight, no peripheral edema. FBS 160 mg/dL, PPBS 220 mg/dL.',
        diagnosis: ['Type 2 Diabetes Mellitus - uncontrolled', 'Stage 1 Hypertension'],
        advice: ['চিনি ও মিষ্টি জাতীয় খাবার সম্পূর্ণ বর্জন করুন', 'প্রতিদিন ৩০ মিনিট নিয়মিত হাঁটুন', '৩ মাস পর পর HbA1c পরীক্ষা করুন'],
        follow_up_date: '2024-02-10',
        prescriptions: [
          {
            brand_name: 'Comet',
            generic_name: 'Metformin',
            dosage_form: 'Tab',
            strength: '500mg',
            schedule: '1+0+1',
            meal_timing: 'After Meal',
            duration: '30 Days',
            special_instructions: 'ভরা পেটে খাওয়ার পর ১টি।',
          },
          {
            brand_name: 'Amlocard',
            generic_name: 'Amlodipine',
            dosage_form: 'Tab',
            strength: '5mg',
            schedule: '1+0+0',
            meal_timing: 'Anytime',
            duration: '30 Days',
            special_instructions: 'সকালে নির্দিষ্ট সময়ে ১টি।',
          },
        ],
      },
    ],
  },
  {
    patient_code: 'P-0002',
    full_name: 'মোসাম্মৎ রহিমা বেগম (Mst. Rahima Begum)',
    age: 36,
    gender: 'female',
    phone: '01819-876543',
    blood_group: 'O+',
    chronic_conditions: ['Seasonal allergic rhinitis'],
    allergies: ['Dust', 'Pollen'],
    medical_surgical_history: 'No known surgical history.',
    encounters: [
      {
        visit_date: '2024-01-18',
        chief_complaints: ['নাক দিয়ে পানি পড়া', 'ঘন ঘন হাঁচি', 'চোখে চুলকানি ও লালচে ভাব'],
        vitals: { bp: '115/75', pulse: '76', temp: '98.2 F', weight: '56 kg', spo2: '99' },
        clinical_findings: 'Pale nasal mucosa, clear chest. No wheeze.',
        diagnosis: ['Allergic Rhinitis'],
        advice: ['ধুলোবালি ও ধোঁয়া এড়িয়ে চলুন', 'প্রতিদিন অন্তত দুইবার গরম পানির ভাপ নিন'],
        follow_up_date: '2024-01-25',
        prescriptions: [
          {
            brand_name: 'Monas',
            generic_name: 'Montelukast',
            dosage_form: 'Tab',
            strength: '10mg',
            schedule: '0+0+1',
            meal_timing: 'After Meal',
            duration: '30 Days',
            special_instructions: 'রাতে শোয়ার আগে চিবিয়ে বা গিলে সেব্য।',
          },
          {
            brand_name: 'Fexo',
            generic_name: 'Fexofenadine',
            dosage_form: 'Tab',
            strength: '120mg',
            schedule: '0+0+1',
            meal_timing: 'After Meal',
            duration: '14 Days',
            special_instructions: 'রাতে খাবারের পর ১টি।',
          },
        ],
      },
    ],
  },
];
