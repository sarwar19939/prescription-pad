import type { DiseaseProtocolTemplate } from './types';

export const NEPHRO_RENAL_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'acute-renal-colic-urolithiasis',
    title: 'Acute Renal Colic / Nephrolithiasis (Kidney Stone Pain)',
    titleBn: 'কিডনিতে পাথর ও তীব্র মূত্রনালীর ব্যথা (রেনাল কলিক)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['renal colic', 'kidney stone', 'পাথর', 'loin to groin pain', 'urolithiasis', 'nephrolithiasis'],
    description: 'Alpha-1 blocker (Tamsulosin) medical expulsive therapy + parenteral/oral NSAID + hydration.',
    descriptionBn: 'পাথর দ্রুত বের করতে ট্যামসুলোসিন ও ব্যথানাশক থেরাপি।',
    medicines: [
      {
        brand_name: 'Uromax',
        generic_name: 'Tamsulosin Hydrochloride',
        adult: { dosage_form: 'Cap', strength: '0.4 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '14-28 Days', special_instructions: 'রাতে শোয়ার আধ ঘণ্টা পর ১টি।' },
      },
      {
        brand_name: 'Ketorol',
        generic_name: 'Ketorolac Tromethamine',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1+0+1 (SOS)', meal_timing: 'After Meal', duration: '3-5 Days', special_instructions: 'তীব্র ব্যথায় ভরা পেটে সেব্য। ৫ দিনের বেশি খাবেন না।' },
      },
      {
        brand_name: 'Maxpro',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খালি পেটে সেব্য।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন অন্তত ৩.৫ থেকে ৪ লিটার পানি পান করুন যাতে দিনে ২.৫ লিটারের বেশি প্রস্রাব হয়।',
      'প্রস্রাব করার সময় ছাঁকনি দিয়ে লক্ষ্য রাখুন কোনো ছোট পাথর বা কণা বের হয়ে আসে কি না।',
      'তীব্র জ্বর, কাঁপুনি বা প্রস্রাব সম্পূর্ণ বন্ধ হয়ে গেলে জরুরি হাসপাতালে যাবেন।',
    ],
  },
  {
    id: 'uric-acid-kidney-stones',
    title: 'Uric Acid Nephrolithiasis (Urine Alkalinization Therapy)',
    titleBn: 'ইউরিক এসিড পাথর গলানো ও মূত্র ক্ষারীয়করণ (পটাশিয়াম সাইট্রেট)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['uric acid stone', 'urine alkalinization', 'potassium citrate stone'],
    description: 'Potassium citrate urinary alkalinization to target urine pH 6.5-7.0 and dissolve stones.',
    descriptionBn: 'পটাশিয়াম সাইট্রেট দ্রবণ দিয়ে প্রস্রাবের পিএইচ স্বাভাবিক রেখে পাথর দ্রবীভূতকরণ।',
    medicines: [
      {
        brand_name: 'Urocit-K',
        generic_name: 'Potassium Citrate Oral Solution',
        adult: { dosage_form: 'Syr', strength: 'Standard', schedule: '2 spoons TDS with water', meal_timing: 'After Meal', duration: '60 Days', special_instructions: '১ গ্লাস পানির সাথে মিশিয়ে খাওয়ার ৩০ মিনিটের মধ্যে পান করবেন।' },
      },
    ],
    adviceBn: [
      'লাল মাংস, পালংশাক, মসুর ডাল ও কোমল পানীয় বর্জন করুন।',
      'লেবুর শরবত ও সাইট্রিক এসিডযুক্ত ফলের রস নিয়মিত পান করুন।',
    ],
  },
  {
    id: 'ckd-stage-1-3-supportive',
    title: 'Chronic Kidney Disease (Stage 1-3 Early Renoprotection)',
    titleBn: 'ক্রনিক কিডনি ডিজিজ (সিকেডি প্রাথমিক পর্যায় ও কিডনি রক্ষা)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['ckd', 'chronic kidney disease', 'কিডনি রোগ', 'high creatinine early', 'microalbuminuria ckd'],
    description: 'SGLT2 inhibitor + ARB blood pressure control, sodium and dietary protein optimization.',
    descriptionBn: 'কিডনির ছাঁকন ক্ষমতা দীর্ঘস্থায়ী রাখতে ডাপাগ্লিফ্লোজিন ও রক্তচাপ নিয়ন্ত্রণ।',
    medicines: [
      {
        brand_name: 'Dapaglif',
        generic_name: 'Dapagliflozin',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '90 Days', special_instructions: 'সকালে খাবারের পর নিয়মিত সেব্য।' },
      },
      {
        brand_name: 'Telmi',
        generic_name: 'Telmisartan',
        adult: { dosage_form: 'Tab', strength: '40 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '90 Days', special_instructions: 'রক্তচাপ ও প্রস্রাবের প্রোটিন কমাতে।' },
      },
    ],
    adviceBn: [
      'ব্যথানাশক ওষুধ (ডাইক্লোফেনাক, ন্যাপ্রক্সেন, আইবুপ্রোফেন) সম্পূর্ণ নিষিদ্ধ (কিডনি বিকল করে দেয়)।',
      'অতিরিক্ত প্রোটিন ও অতিরিক্ত লবণ খাওয়া পরিহার করুন।',
      'প্রতি ৩ মাস অন্তর সিরাম ক্রিয়েটিনিন ও ইলেক্ট্রোলাইট পরীক্ষা করুন।',
    ],
  },
  {
    id: 'acute-pyelonephritis-mild',
    title: 'Acute Uncomplicated Pyelonephritis (Mild Outpatient)',
    titleBn: 'কিডনির তীব্র সংক্রমণ (পাইলোনেফ্রাইটিস ও কাঁপুনি দিয়ে জ্বর)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['pyelonephritis', 'kidney infection', 'fever flank pain', 'chills urine infection'],
    description: 'Empirical fluoroquinolone (Ciprofloxacin) or Cefixime + urine culture follow-up.',
    descriptionBn: 'কোমরের পেছনে ব্যথা ও জ্বরে সিপ্রোফ্লক্সাসিন ১৪ দিনের সম্পূর্ণ অ্যান্টিবায়োটিক কোর্স।',
    medicines: [
      {
        brand_name: 'Ciprocin',
        generic_name: 'Ciprofloxacin',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '10-14 Days', special_instructions: 'প্রচুর পানিসহ সকাল ও রাতে সেব্য।' },
      },
      {
        brand_name: 'Fast',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'জ্বর ও কাঁপুনিতে সেব্য।' },
      },
    ],
    adviceBn: [
      'অবশ্যই প্রস্রাবের কালচার ও সেনসিটিভিটি (Urine C/S) পরীক্ষা করিয়ে রিপোর্ট দেখান।',
      'প্রচুর পরিমাণে পানি পান করুন ও সম্পূর্ণ বিশ্রাম নিন।',
    ],
  },
  {
    id: 'overactive-bladder-syndrome',
    title: 'Overactive Bladder Syndrome (Urgency & Frequency)',
    titleBn: 'ওভারঅ্যাক্টিভ ব্লাডার (বারবার প্রস্রাবের তীব্র বেগ ও বেগ ধরে রাখতে না পারা)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['overactive bladder', 'oab', 'ঘন ঘন প্রস্রাবের বেগ', 'urinary urgency'],
    description: 'Beta-3 adrenergic agonist (Mirabegron) or antimuscarinic + bladder retraining.',
    descriptionBn: 'মিরাবেগ্রন দিয়ে মূত্রথলির মাংসপেশি শিথিলকরণ ও প্রস্রাব নিয়ন্ত্রণের প্রশিক্ষণ।',
    medicines: [
      {
        brand_name: 'Mirago',
        generic_name: 'Mirabegron (Extended Release)',
        adult: { dosage_form: 'Tab', strength: '25 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '30-60 Days', special_instructions: 'প্রতিদিন সকালে নাস্তার পর ১টি।' },
      },
    ],
    adviceBn: [
      'চা, কফি, অ্যালকোহল ও কৃত্রিম মিষ্টি বর্জন করুন (এগুলো প্রস্রাবের বেগ বাড়িয়ে দেয়)।',
      'প্রস্রাবের বেগ হলে সাথে সাথে না গিয়ে ৫-১০ মিনিট ধৈর্য ধরে পেটের পেশি চেপে রাখার অভ্যাস করুন।',
    ],
  },
  {
    id: 'stress-urinary-incontinence',
    title: 'Stress Urinary Incontinence (Cough / Sneeze Leakage)',
    titleBn: 'কাশি বা হাঁচি দিলে প্রস্রাব লিক হওয়া (স্ট্রেস ইউরিনারি ইনকনটিনেন্স)',
    category: 'Nephrology & Urology',
    diagnosisMatch: ['stress incontinence', 'urine leak coughing', 'হাঁচি দিলে প্রস্রাব ঝরা', 'incontinence'],
    description: 'Structured pelvic floor muscle training (Kegel exercises) and weight reduction.',
    descriptionBn: 'কীগেল পেলভিক ফ্লোর ব্যায়াম ও মূত্রথলির পেশী শক্তিশালীকরণ।',
    medicines: [
      {
        brand_name: 'Ceevit',
        generic_name: 'Ascorbic Acid (Vitamin C)',
        adult: { dosage_form: 'Tab', strength: '250 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'পেশী ও কোলাজেন সুরক্ষায়।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন ৩ বার ১০ মিনিট করে কীগেল ব্যায়াম (পেলভিক ফ্লোর মাংসপেশি ৫ সেকেন্ড চেপে ধরে রেখে ছাড়া) করুন।',
      'কোষ্ঠকাঠিন্য ও দীর্ঘস্থায়ী কাশি নিয়ন্ত্রণ করুন যাতে পেটে অতিরিক্ত চাপ না পড়ে।',
    ],
  },
];
