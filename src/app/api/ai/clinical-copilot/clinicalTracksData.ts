/**
 * Disease-Specific Clinical Knowledge Protocols for Outpatient Practice in Bangladesh.
 * Follows DGHS, icddr,b, BIRDEM, and Master The Chamber protocols.
 */
import type { ClinicalQuestion, SuggestedMedication } from '@/services/aiClinicalCopilot';

export interface CategoryTrackData {
  category: string;
  defaultProbable: string;
  differentials: string[];
  medications: SuggestedMedication[];
  questions: ClinicalQuestion[];
  investigations: string[];
  warnings: string[];
}

export const GASTRO_TRACK: CategoryTrackData = {
  category: 'gastro',
  defaultProbable: 'Acute Watery Diarrhea (AWD) with Dehydration',
  differentials: [
    'Acute Watery Diarrhea (AWD) with Mild to Moderate Dehydration',
    'Acute Gastroenteritis (Food Poisoning / Viral)',
    'Bacillary Dysentery (Shigellosis)',
    'Secretory Diarrhea Syndrome',
  ],
  medications: [
    {
      generic_name: 'Oral Rehydration Salts',
      suggested_brand: 'ORS Saline-N',
      strength: '1 Sachet / 500ml',
      schedule: 'SOS',
      duration: '5 Days',
      rationale: 'icddr,b Protocol: Essential fluid & electrolyte replenishment after each watery loose stool.',
    },
    {
      generic_name: 'Zinc Sulphate',
      suggested_brand: 'Baby Zinc',
      strength: '20 mg',
      schedule: '1+0+0',
      duration: '14 Days',
      rationale: 'DGHS / WHO Protocol: Promotes rapid intestinal mucosal regeneration and reduces recurrence.',
    },
    {
      generic_name: 'Domperidone',
      suggested_brand: 'Motigut',
      strength: '10 mg',
      schedule: '1+1+1',
      duration: '5 Days',
      rationale: 'Antiemetic and upper GI prokinetic to arrest persistent vomiting so oral fluids are retained.',
    },
    {
      generic_name: 'Bacillus clausii spores',
      suggested_brand: 'Enterogermina',
      strength: '2 billion / 5ml',
      schedule: '1+0+1',
      duration: '5 Days',
      rationale: 'Restores beneficial gut microflora disrupted by infectious diarrheal purging.',
    },
  ],
  questions: [
    {
      id: 'dehydration_signs',
      question: 'পানির পিপাসা, প্রস্রাবের পরিমাণ বা চোখ বসে যাওয়ার তীব্রতা কেমন? (Dehydration Assessment)',
      options: [
        'তীব্র পিপাসা, চোখ সামান্য বসা ও প্রস্রাব কম (Some Dehydration)',
        'স্বাভাবিক পিপাসা ও পর্যাপ্ত প্রস্রাব (No Dehydration)',
        'চরম নিস্তেজ ভাব, চামড়া ঢিলে ও প্রস্রাব বন্ধ (Severe Dehydration)',
      ],
      hint: 'icddr,b গাইডলাইন অনুযায়ী ওআরএস নাকি হাসপাতালে আইভি স্যালাইনের রেফারেল প্রয়োজন তা নির্ধারণে।',
    },
    {
      id: 'stool_consistency',
      question: 'পায়খানার ধরন কেমন? শুধুই চাল-ধোয়া পানির মতো নাকি আম/রক্তযুক্ত ও পেটে মোচড় দেয়?',
      options: [
        'প্রচুর চালের মাড়ের মতো পানির মতো পাতলা পায়খানা',
        'রক্ত ও শ্লেষ্মা (আম) যায় ও তীব্র পেট মোচড়ায় (Dysentery)',
        'হলুদাভ আধা-তরল পায়খানা সাথে পেট ফাঁপা',
      ],
      hint: 'ওয়াটারি ডায়রিয়া বনাম ব্যাকটেরিয়াল ব্যাসিলারি আমাশয় (Dysentery) আলাদা করতে।',
    },
    {
      id: 'prior_allergy',
      question: 'পূর্বে কোনো অ্যান্টিবায়োটিক বা ব্যথানাশক ওষুধ খেয়ে অ্যালার্জি হয়েছিল কি?',
      options: ['না, কোনো অ্যালার্জি নেই', 'সিপ্রোফ্লক্সাসিন বা কুইনোলোন অ্যালার্জি', 'পেনিসিলিন অ্যালার্জি'],
      hint: 'রোগীর ড্রাগ সেফটি নিশ্চিত করতে।',
    },
  ],
  investigations: [
    'Stool for R/M/E & Routine Microscopic Examination (Pus cells, RBC, cysts, trophozoites)',
    'Serum Electrolytes (Na+, K+, Cl-, HCO3-) for dehydration/hypokalemia assessment',
    'Complete Blood Count (CBC) with ESR',
  ],
  warnings: [
    'WARNING: Strictly avoid anti-motility agents (Loperamide/Imodium) in acute infectious diarrhea as it traps bacterial enterotoxins and risks toxic megacolon.',
  ],
};

export const FEVER_TRACK: CategoryTrackData = {
  category: 'fever',
  defaultProbable: 'Acute Viral Upper Respiratory Tract Infection (URTI)',
  differentials: [
    'Acute Viral Upper Respiratory Tract Infection',
    'Dengue Fever Syndrome (Early Phase)',
    'Enteric (Typhoid) Fever',
    'Seasonal Influenza Syndrome',
  ],
  medications: [
    {
      generic_name: 'Paracetamol',
      suggested_brand: 'Napa Extend',
      strength: '665 mg',
      schedule: '1+1+1',
      duration: '5 Days',
      rationale: 'First-line antipyretic & analgesic. Avoid NSAIDs / Steroids due to dengue bleeding risks.',
    },
    {
      generic_name: 'Fexofenadine',
      suggested_brand: 'Fexo',
      strength: '120 mg',
      schedule: '0+0+1',
      duration: '7 Days',
      rationale: 'Non-sedating antihistamine for allergic rhinitis, sneezing, and runny nose.',
    },
    {
      generic_name: 'Esomeprazole',
      suggested_brand: 'Maxpro',
      strength: '20 mg',
      schedule: '1+0+1',
      duration: '7 Days',
      rationale: 'Gastroprotection during febrile illness.',
    },
  ],
  questions: [
    {
      id: 'fever_chills',
      question: 'জ্বরের সাথে কাঁপুনি (Chills/Rigor) বা রাতে অতিরিক্ত ঘাম দেওয়ার তীব্রতা কেমন?',
      options: ['স্বাভাবিক জ্বর (কাঁপুনি নেই)', 'তীব্র কাঁপুনি হয় (Chills/Rigor)', 'রাতে বেশি ঘাম হয়'],
      hint: 'ইনফেকশাস বনাম ভাইরাল এটিওলজি মূল্যায়নের জন্য।',
    },
    {
      id: 'dengue_warning',
      question: 'চোখের পেছনে ব্যথা, গায়ে ফুসকুড়ি বা দাঁতের মাড়ি দিয়ে রক্তপাত আছে কি?',
      options: ['না, কোনো রক্তপাত নেই', 'চোখের পেছনে তীব্র ব্যথা আছে', 'গায়ে লাল ফুসকুড়ি আছে'],
      hint: 'ডেঙ্গু ওয়ার্নিং সাইন মূল্যায়নের জন্য।',
    },
  ],
  investigations: [
    'Complete Blood Count (CBC) with Platelets',
    'NS1 Ag (if fever within 3 days)',
    'Urine R/M/E',
  ],
  warnings: [
    'Avoid Aspirin or NSAIDs (Naproxen, Aceclofenac) until Dengue is ruled out by normal platelet count.',
  ],
};

export const GASTRIC_TRACK: CategoryTrackData = {
  category: 'gastric',
  defaultProbable: 'Gastroesophageal Reflux Disease (GERD) & Peptic Dyspepsia',
  differentials: [
    'Gastroesophageal Reflux Disease (GERD)',
    'Peptic Ulcer Disease (PUD)',
    'Functional Dyspepsia',
    'Non-Ulcer Stomach Fullness',
  ],
  medications: [
    {
      generic_name: 'Esomeprazole',
      suggested_brand: 'Sergel',
      strength: '20 mg',
      schedule: '1+0+1',
      duration: '14 Days',
      rationale: 'Proton-pump inhibitor for acid suppression and mucosal healing.',
    },
    {
      generic_name: 'Domperidone',
      suggested_brand: 'Motigut',
      strength: '10 mg',
      schedule: '1+1+1',
      duration: '10 Days',
      rationale: 'Prokinetic to accelerate gastric emptying and reduce reflux.',
    },
    {
      generic_name: 'Magaldrate + Simethicone',
      suggested_brand: 'Entacyd Plus',
      strength: '200 ml',
      schedule: '2 spoons TDS',
      duration: '7 Days',
      rationale: 'Fast mucosal coating and anti-flatulence relief.',
    },
  ],
  questions: [
    {
      id: 'gastric_relation',
      question: 'বুক জ্বালাপোড়া বা পেটব্যথা কি খাওয়ার পর বেশি হয় নাকি খালি পেটে?',
      options: ['খাওয়ার পর বুক জ্বালা করে', 'খালি পেটে কামড়ায়', 'রাতে ঘুমানোর সময় বাড়ে'],
      hint: 'GERD বনাম গ্যাস্ট্রিক আলসার চিহ্নিত করতে।',
    },
    {
      id: 'alarm_symptoms',
      question: 'কালো পায়খানা, রক্তবমি বা ওজন কমে যাওয়ার কোনো ইতিহাস আছে কি?',
      options: ['না, কোনো অ্যালার্ম লক্ষণ নেই', 'কালো পায়খানা বা রক্তবমি হয়েছিল', 'খাবারে তীব্র অরুচি'],
      hint: 'আপার জিআই রক্তক্ষরণ বা আলসার জটিলতা মূল্যায়নে।',
    },
  ],
  investigations: [
    'Upper GI Endoscopy (if red flag symptoms present)',
    'Serum H. pylori Stool Antigen',
    'USG of Whole Abdomen',
  ],
  warnings: [
    'Avoid lying down immediately after meals. Elevate head of bed by 6 inches.',
  ],
};
