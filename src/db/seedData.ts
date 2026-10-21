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

/** 30 commonly prescribed medicines for offline-first use. */
export const MEDICINE_SEEDS: MedicineSeed[] = [
  { brand_name: 'Dolo', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '650mg', manufacturer: 'Micro Labs', contraindications: ['Severe liver disease', 'Allergy to paracetamol'] },
  { brand_name: 'Crocin Advance', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '500mg', manufacturer: 'GSK', contraindications: ['Severe liver disease'] },
  { brand_name: 'Calpol', generic_name: 'Paracetamol', dosage_form: 'Syr', strength: '125mg/5ml', manufacturer: 'GSK', contraindications: ['Severe liver disease'] },
  { brand_name: 'Augmentin', generic_name: 'Amoxicillin + Clavulanic Acid', dosage_form: 'Tab', strength: '625mg', manufacturer: 'GSK', contraindications: ['Penicillin allergy', 'History of cholestatic jaundice'] },
  { brand_name: 'Azithral', generic_name: 'Azithromycin', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Alembic', contraindications: ['Macrolide allergy', 'Severe hepatic impairment'] },
  { brand_name: 'Taxim-O', generic_name: 'Cefixime', dosage_form: 'Tab', strength: '200mg', manufacturer: 'Alkem', contraindications: ['Cephalosporin allergy'] },
  { brand_name: 'Monocef', generic_name: 'Ceftriaxone', dosage_form: 'Inj', strength: '1g', manufacturer: 'Aristo', contraindications: ['Cephalosporin allergy', 'Neonates with hyperbilirubinemia'] },
  { brand_name: 'Ciplox', generic_name: 'Ciprofloxacin', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Cipla', contraindications: ['Quinolone allergy', 'Myasthenia gravis'] },
  { brand_name: 'Pan-D', generic_name: 'Pantoprazole + Domperidone', dosage_form: 'Cap', strength: '40mg/30mg', manufacturer: 'Alkem', contraindications: ['Severe hepatic impairment', 'Prolactinoma'] },
  { brand_name: 'Omez', generic_name: 'Omeprazole', dosage_form: 'Cap', strength: '20mg', manufacturer: 'Dr. Reddy\'s', contraindications: ['Omeprazole allergy'] },
  { brand_name: 'Rantac', generic_name: 'Ranitidine', dosage_form: 'Tab', strength: '150mg', manufacturer: 'JB Chemicals', contraindications: ['Known hypersensitivity'] },
  { brand_name: 'Digene Gel', generic_name: 'Antacid Combo', dosage_form: 'Syr', strength: '10ml', manufacturer: 'Abbott', contraindications: ['Severe renal failure'] },
  { brand_name: 'Montair LC', generic_name: 'Montelukast + Levocetirizine', dosage_form: 'Tab', strength: '10mg/5mg', manufacturer: 'Cipla', contraindications: ['Neuropsychiatric history on montelukast'] },
  { brand_name: 'Allegra', generic_name: 'Fexofenadine', dosage_form: 'Tab', strength: '120mg', manufacturer: 'Sanofi', contraindications: ['Severe renal impairment'] },
  { brand_name: 'Asthalin HFA', generic_name: 'Salbutamol', dosage_form: 'Inj', strength: '100mcg/puff', manufacturer: 'Cipla', contraindications: ['Hypersensitivity to salbutamol'] },
  { brand_name: 'Medimet', generic_name: 'Metformin', dosage_form: 'Tab', strength: '500mg', manufacturer: 'USV', contraindications: ['eGFR < 30', 'Acute metabolic acidosis'] },
  { brand_name: 'Glycomet GP2', generic_name: 'Metformin + Glimepiride', dosage_form: 'Tab', strength: '500mg/2mg', manufacturer: 'USV', contraindications: ['Severe renal impairment', 'Sulfonylurea allergy'] },
  { brand_name: 'Amlong', generic_name: 'Amlodipine', dosage_form: 'Tab', strength: '5mg', manufacturer: 'Micro Labs', contraindications: ['Severe hypotension', 'Amlodipine allergy'] },
  { brand_name: 'Telma 40', generic_name: 'Telmisartan', dosage_form: 'Tab', strength: '40mg', manufacturer: 'Glenmark', contraindications: ['Pregnancy', 'Biliary obstruction'] },
  { brand_name: 'Atorva', generic_name: 'Atorvastatin', dosage_form: 'Tab', strength: '20mg', manufacturer: 'Zydus', contraindications: ['Active liver disease', 'Pregnancy'] },
  { brand_name: 'Ecosprin', generic_name: 'Aspirin', dosage_form: 'Tab', strength: '75mg', manufacturer: 'USV', contraindications: ['Active peptic ulcer', 'Bleeding disorder', 'Children < 16 with viral illness'] },
  { brand_name: 'Eliquis', generic_name: 'Apixaban', dosage_form: 'Tab', strength: '5mg', manufacturer: 'Pfizer', contraindications: ['Active bleeding', 'Severe hepatic impairment'] },
  { brand_name: 'Thyronorm', generic_name: 'Levothyroxine', dosage_form: 'Tab', strength: '50mcg', manufacturer: 'Abbott', contraindications: ['Uncorrected adrenal insufficiency'] },
  { brand_name: 'Neurobion Forte', generic_name: 'Vitamin B-Complex', dosage_form: 'Tab', strength: 'BL', manufacturer: 'Merck', contraindications: ['Levodopa therapy (pyridoxine)'] },
  { brand_name: 'Calcirol', generic_name: 'Cholecalciferol', dosage_form: 'Syr', strength: '60000 IU/5ml', manufacturer: 'Cadila', contraindications: ['Hypercalcemia', 'Vitamin D toxicity'] },
  { brand_name: 'Zincovit', generic_name: 'Multivitamin + Zinc', dosage_form: 'Tab', strength: 'BL', manufacturer: 'Apex Labs', contraindications: ['Hypersensitivity to components'] },
  { brand_name: 'Ornigreat', generic_name: 'Ornidazole', dosage_form: 'Tab', strength: '500mg', manufacturer: 'Intas', contraindications: ['Nitroimidazole allergy', 'First trimester pregnancy'] },
  { brand_name: 'O2', generic_name: 'Ofloxacin + Ornidazole', dosage_form: 'Tab', strength: '200mg/500mg', manufacturer: 'FDC', contraindications: ['Quinolone allergy', 'Epilepsy history'] },
  { brand_name: 'Solvin', generic_name: 'Bromhexine', dosage_form: 'Syr', strength: '100ml', manufacturer: 'Ipca', contraindications: ['Peptic ulcer disease'] },
  { brand_name: 'Volini Gel', generic_name: 'Diclofenac Diethylamine', dosage_form: 'Oint', strength: '1.16%', manufacturer: 'Sun Pharma', contraindications: ['NSAID allergy', 'Broken/infected skin'] },
];

/** Two demo patients with past visits for immediate testing. */
export const PATIENT_SEEDS: PatientSeed[] = [
  {
    patient_code: 'P-0001',
    full_name: 'Ramesh Kumar',
    age: 46,
    gender: 'male',
    phone: '+91-98765-43210',
    blood_group: 'B+',
    chronic_conditions: ['Type 2 Diabetes', 'Hypertension'],
    allergies: ['Sulfa drugs'],
    medical_surgical_history: 'Appendectomy 2014. On Metformin 500mg BD and Amlodipine 5mg OD.',
    encounters: [
      {
        visit_date: '2024-01-10',
        chief_complaints: ['Fatigue', 'Increased thirst', 'Frequent urination'],
        vitals: { bp: '148/92', pulse: '82', temp: '98.4 F', weight: '78 kg', spo2: '98' },
        clinical_findings: 'Overweight, no peripheral edema. FBS 176 mg/dL, PPBS 245 mg/dL.',
        diagnosis: ['Type 2 Diabetes Mellitus - uncontrolled', 'Stage 1 Hypertension'],
        advice: ['Reduce sugar intake', '30 min daily walk', 'Repeat HbA1c in 3 months'],
        follow_up_date: '2024-02-10',
        prescriptions: [
          {
            brand_name: 'Medimet',
            generic_name: 'Metformin',
            dosage_form: 'Tab',
            strength: '500mg',
            schedule: '1+0+1',
            meal_timing: 'After Meal',
            duration: '30 Days',
            special_instructions: 'Report back if excessive weakness or nausea.',
          },
          {
            brand_name: 'Amlong',
            generic_name: 'Amlodipine',
            dosage_form: 'Tab',
            strength: '5mg',
            schedule: '1+0+0',
            meal_timing: 'Anytime',
            duration: '30 Days',
            special_instructions: '',
          },
        ],
      },
    ],
  },
  {
    patient_code: 'P-0002',
    full_name: 'Sunita Devi',
    age: 34,
    gender: 'female',
    phone: '+91-91234-56780',
    blood_group: 'O+',
    chronic_conditions: ['Seasonal allergic rhinitis'],
    allergies: ['Dust', 'Pollen'],
    medical_surgical_history: 'No known surgical history.',
    encounters: [
      {
        visit_date: '2024-01-18',
        chief_complaints: ['Runny nose', 'Sneezing', 'Itchy eyes'],
        vitals: { bp: '118/76', pulse: '76', temp: '98.2 F', weight: '58 kg', spo2: '99' },
        clinical_findings: 'Pale nasal mucosa, clear chest. No wheeze.',
        diagnosis: ['Allergic Rhinitis'],
        advice: ['Avoid dust exposure', 'Steam inhalation twice daily'],
        follow_up_date: '2024-01-25',
        prescriptions: [
          {
            brand_name: 'Montair LC',
            generic_name: 'Montelukast + Levocetirizine',
            dosage_form: 'Tab',
            strength: '10mg/5mg',
            schedule: '0+0+1',
            meal_timing: 'After Meal',
            duration: '7 Days',
            special_instructions: 'May cause drowsiness — avoid night driving.',
          },
        ],
      },
    ],
  },
];
