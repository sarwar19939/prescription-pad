/**
 * MedEx & Clinical Drug Administration Guidelines Service.
 * Provides synchronized administration guidelines, meal timing, indications,
 * and patient-friendly instructions (কখন খেতে হয়, কীভাবে খেতে হয়) in Bangla & English.
 */

export interface DrugGuideline {
  genericMatch: string;
  indication: string; // রোগের কারণ / নির্দেশনা
  whenToTake: string; // কখন খেতে হয় (খাবারের আগে/পরে/রাতে)
  howToTake: string; // কীভাবে খেতে হয় (গিলে খাবেন/ঝাঁকিয়ে খাবেন)
  specialAdvice: string; // রোগীর সতর্কতা ও বিশেষ উপদেশ
  standardSchedule: string;
  standardMealTiming: 'Before Meal' | 'After Meal' | 'With Meal' | 'Anytime';
}

const DRUG_GUIDELINE_DATABASE: DrugGuideline[] = [
  // 1. PPIs / Antacids (Omeprazole, Esomeprazole, Pantoprazole, Rabeprazole, Dexlansoprazole)
  {
    genericMatch: 'prazole|seclo|maxpro|sergel|finix|pantodac|nexum|esomeprazole|omeprazole|pantoprazole|rabeprazole',
    indication: 'গ্যাস্ট্রিক আলসার, বুকজ্বালা, এসিডিটি ও অ্যাসিড রিফ্লাক্স (GERD & Peptic Ulcer)',
    whenToTake: 'খাবারের ৩০ থেকে ৬০ মিনিট পূর্বে খালি পেটে (সকাল ও রাতে)',
    howToTake: 'সম্পূর্ণ পানি দিয়ে ক্যাপসুল/ট্যাবলেট গিলে খাবেন, চিবানো বা গুঁড়ো করা যাবে না।',
    specialAdvice: 'প্রতিদিন নির্দিষ্ট সময়ে নিয়ম করে সেবন করবেন। অতিরিক্ত তৈলাক্ত, ভাজাপোড়া ও ঝাল খাবার এড়িয়ে চলুন।',
    standardSchedule: '1+0+1',
    standardMealTiming: 'Before Meal',
  },
  // 2. Paracetamol / Analgesics
  {
    genericMatch: 'paracetamol|napa|ace|fast|calpol|pyralgin|renova',
    indication: 'জ্বর, মাথাব্যথা, শরীর ব্যথা ও ঠাণ্ডাজনিত অস্বস্তি (Fever & Pain)',
    whenToTake: 'খাবারের পরে অথবা জ্বর/ব্যথা অনুভূত হলে (SOS)',
    howToTake: 'এক গ্লাস পানি দিয়ে সেব্য। সিরাপের ক্ষেত্রে বোতলটি ভালো করে ঝাঁকিয়ে সঠিক চামচ বা ড্রপার ব্যবহার করুন।',
    specialAdvice: '২৪ ঘণ্টায় ৪ গ্রামের বেশি (৮টি ৫০০ মি.গ্রা. ট্যাবলেট) খাবেন না। ডেঙ্গু মৌসুমে প্যারাসিটামলই নিরাপদ।',
    standardSchedule: '1+1+1',
    standardMealTiming: 'After Meal',
  },
  // 3. NSAIDs / Painkillers
  {
    genericMatch: 'ibuprofen|naproxen|diclofenac|ketorolac|aceclofenac|meloxicam|etoricoxib|indometacin|anflam|rolac|xenapro|flexi',
    indication: 'তীব্র বা মাঝারি অস্থিসন্ধি ব্যথা, বাতের ব্যথা ও প্রদাহ (Musculoskeletal Pain & Arthritis)',
    whenToTake: 'অবশ্যই ভরা পেটে অথবা খাবারের ঠিক পরপরই',
    howToTake: 'পর্যাপ্ত পানি সহ সেব্য। কখনোই খালি পেটে খাবেন না। সাথে গ্যাস্ট্রিকের ওষুধ নেওয়া নিরাপদ।',
    specialAdvice: 'ডেঙ্গু সন্দেহ বা পেপটিক আলসারের ইতিহাস থাকলে কোনো অবস্থাতেই সেবন করবেন না।',
    standardSchedule: '1+0+1',
    standardMealTiming: 'After Meal',
  },
  // 4. Antihypertensives (BP Medicines)
  {
    genericMatch: 'amlodipine|losartan|telmisartan|bisoprolol|atenolol|olmesartan|camlosart|osartil|bizoran|angilock|ramipril|carvedilol',
    indication: 'উচ্চ রক্তচাপ নিয়ন্ত্রণ ও হৃদরোগের ঝুঁকি হ্রাস (Essential Hypertension & CVD Protection)',
    whenToTake: 'প্রতিদিন সকালবেলা নাস্তার পর নির্দিষ্ট সময়ে',
    howToTake: 'প্রতিদিন একই সময়ে পানি দিয়ে নিয়মিত সেব্য। চিকিৎসকের পরামর্শ ছাড়া হঠাৎ বন্ধ করবেন না।',
    specialAdvice: 'খাবারে বাড়তি কাঁচা লবণ বর্জন করুন এবং সপ্তাহে অন্তত একবার রক্তচাপ মেপে লিখে রাখুন।',
    standardSchedule: '1+0+0',
    standardMealTiming: 'After Meal',
  },
  // 5. Statins / Cholesterol
  {
    genericMatch: 'statin|atorvastatin|rosuvastatin|atova|rosuva|lipicon|atorva|lipitor',
    indication: 'রক্তে অতিরিক্ত কোলেস্টেরল নিয়ন্ত্রণ ও রক্তনালীর ব্লকেজ প্রতিরোধ (Dyslipidemia)',
    whenToTake: 'প্রতিদিন রাতে খাবারের পর শোবার পূর্বে',
    howToTake: 'এক গ্লাস পানি সহ রাতে শোবার সময় সেব্য (রাতে যকৃতে কোলেস্টেরল সংশ্লেষণ বেশি হয়)।',
    specialAdvice: 'খাবারে চর্বিযুক্ত ও তৈলাক্ত খাদ্য পরিহার করুন। পেশীতে তীব্র ব্যথা বা দুর্বলতা দেখা দিলে ডাক্তারকে জানান।',
    standardSchedule: '0+0+1',
    standardMealTiming: 'After Meal',
  },
  // 6. Antidiabetics (Metformin & Oral Glycemics)
  {
    genericMatch: 'metformin|comet|glipizide|gliclazide|linagliptin|vildagliptin|sitagliptin|empagliflozin|dapagliflozin|gluconor|daonil',
    indication: 'টাইপ-২ ডায়াবেটিসে রক্তে শর্করার মাত্রা নিয়ন্ত্রণ (Type 2 Diabetes Mellitus)',
    whenToTake: 'প্রধান খাবারের ঠিক মাঝখানে অথবা খাবারের সাথে সাথে',
    howToTake: 'খাবারের সাথে গ্রহণ করলে পেটের অস্বস্তি বা গ্যাস্ট্রিকের অনুভূতি কম হয়।',
    specialAdvice: 'নিয়মিত সময়মতো খাবার গ্রহণ করুন যাতে রক্তে সুগার অতিরিক্ত কমে না যায়। চিনি ও মিষ্টি পরিহার করুন।',
    standardSchedule: '1+0+1',
    standardMealTiming: 'With Meal',
  },
  // 7. Antihistamines & Montelukast
  {
    genericMatch: 'montelukast|monas|provair|fexofenadine|fexo|bilastine|cetirizine|desloratadine|rupatadine|alavert|bila',
    indication: 'অ্যালার্জিজনিত সর্দি, হাঁচি, ত্বকের চুলকানি ও শ্বাসকষ্ট প্রতিরোধ (Allergic Rhinitis & Asthma)',
    whenToTake: 'প্রতিদিন সন্ধ্যায় অথবা রাতে শোবার পূর্বে',
    howToTake: 'পানি দিয়ে সেব্য। মন্টেলুকাস্ট প্রতিদিন নির্দিষ্ট সময়ে নিয়মিত চালিয়ে যাওয়া জরুরি।',
    specialAdvice: 'কিছু অ্যান্টিহিস্টামিনে ঘুম ঘুম ভাব হতে পারে, তাই সেবনের পর ড্রাইভিং বা সতর্কতামূলক কাজে সাবধান থাকুন।',
    standardSchedule: '0+0+1',
    standardMealTiming: 'After Meal',
  },
  // 8. Antibiotics
  {
    genericMatch: 'azithromycin|zithrin|cefixime|cef-3|ciprofloxacin|ciprocin|amoxicillin|moxaclav|clavamox|ceftriaxone|cefuroxime|kilbac|furocef',
    indication: 'ব্যাকটেরিয়াল সংক্রমণ (শ্বাসতন্ত্র, মূত্রনালী, কান, গলা ও টাইফয়েড সংক্রমণ)',
    whenToTake: 'এজিথ্রোমাইসিন খাবারের ১ ঘণ্টা পূর্বে অথবা ২ ঘণ্টা পরে; সেফিক্সিম ও অন্যান্য খাবারের পরে',
    howToTake: 'নির্দিষ্ট সময়ের ব্যবধান (যেমন প্রতি ১২ ঘণ্টা বা ২৪ ঘণ্টায়) কঠোরভাবে বজায় রেখে সেবন করুন।',
    specialAdvice: 'উপসর্গ ভালো হয়ে গেলেও চিকিৎসকের নির্ধারিত পূর্ণ মেয়াদের অ্যান্টিবায়োটিক কোর্স শেষ করুন।',
    standardSchedule: '1+0+1',
    standardMealTiming: 'After Meal',
  },
  // 9. Antiemetic / Prokinetic (Domperidone, Ondansetron)
  {
    genericMatch: 'domperidone|motigut|omidon|ondansetron|emistat|onfran|meclizine',
    indication: 'বমি ভাব, বমি ও খাবার পর পেট ভারী লাগা (Nausea, Vomiting & Dyspepsia)',
    whenToTake: 'খাবারের ১৫ থেকে ৩০ মিনিট পূর্বে',
    howToTake: 'সামান্য পানি দিয়ে খাবারের পূর্বে সেবন করুন।',
    specialAdvice: 'বমির সাথে পানিশূন্যতা দেখা দিলে ওআরএস স্যালাইন গ্রহণ করুন।',
    standardSchedule: '1+0+1',
    standardMealTiming: 'Before Meal',
  },
  // 10. Antispasmodics (Timonium, Mebeverine, Alverine)
  {
    genericMatch: 'timonium|visceral|mebeverine|colospa|duspatalin|alverine|spasmonil',
    indication: 'পেট মোচড়ানো ব্যথা, পেটে কামড়ানো ও আইবিএস (Abdominal Spasm & Irritable Bowel Syndrome)',
    whenToTake: 'খাবারের পূর্বে অথবা পেট ব্যথার সময় (SOS)',
    howToTake: 'পর্যাপ্ত পানি সহ সেব্য। ব্যথা কমে গেলে নিয়মিত সেবনের প্রয়োজন নেই।',
    specialAdvice: 'পেট ব্যথার সাথে জ্বর বা রক্ত পায়খানা দেখা দিলে অবিলম্বে হাসপাতালে যোগাযোগ করুন।',
    standardSchedule: '1+0+1',
    standardMealTiming: 'Before Meal',
  },
  // 11. Muscle Relaxants
  {
    genericMatch: 'tolperisone|myolax|myonil|baclofen|eperisone|muscoflex',
    indication: 'পেশির তীব্র টান, ঘাড় ও পিঠের পেশি ব্যথা (Muscle Spasm & Stiffness)',
    whenToTake: 'খাবারের পরে (সাধারণত সকাল ও রাতে)',
    howToTake: 'ভরা পেটে এক গ্লাস পানি সহ সেবন করুন।',
    specialAdvice: 'পেশি শিথিলকারক ওষুধ খেলে কিছুটা ঝিমুনি হতে পারে। বিশ্রাম নেওয়া বাঞ্ছনীয়।',
    standardSchedule: '1+0+1',
    standardMealTiming: 'After Meal',
  },
  // 12. Cough & Mucolytics
  {
    genericMatch: 'ambroxol|ambrox|mucospas|bromhexine|butamirate|mirapex|dextromethorphan|adrylex',
    indication: 'বুকে জমা কফ তরল করা ও শুষ্ক খুসখুসে কাশি উপশম (Cough & Bronchial Secretion)',
    whenToTake: 'খাবারের পরে দিনে ২ থেকে ৩ বার',
    howToTake: 'সিরাপ খাওয়ার পর সাথে সাথে প্রচুর পানি পান করা উচিত নয়; তবে সারাদিনে পর্যাপ্ত উষ্ণ পানি পান করুন।',
    specialAdvice: 'কাশি ৩ সপ্তাহের বেশি থাকলে বা কাশির সাথে রক্ত গেলে চিকিৎসকের বিশেষ পরামর্শ নিন।',
    standardSchedule: '1+1+1',
    standardMealTiming: 'After Meal',
  },
  // 13. Oral Rehydration & Zinc
  {
    genericMatch: 'ors|zinc|saline|baby zinc|oral rehydration',
    indication: 'ডায়রিয়া, পাতলা পায়খানা ও পানিশূন্যতা প্রতিরোধ (Dehydration & Diarrhea)',
    whenToTake: 'প্রতিবার পাতলা পায়খানার পর পর্যাপ্ত পরিমাণে ওআরএস দ্রবণ',
    howToTake: 'আধ লিটার ফুটানো ঠাণ্ডা পানিতে পুরো ১ প্যাকেট স্যালাইন ভালোভাবে গুলিয়ে ১২ ঘণ্টার মধ্যে পান করুন।',
    specialAdvice: 'শিশুদের ডায়রিয়ায় জিঙ্ক সিরাপ টানা ১০–১৪ দিন খাওয়াতে হবে যাতে পরবর্তীতে ডায়রিয়ার ঝুঁকি কমে।',
    standardSchedule: '1+1+1',
    standardMealTiming: 'Anytime',
  },
];

/**
 * Retrieves the MedEx patient administration guideline for any medicine
 * by matching its brand name or generic name against verified clinical families.
 */
export function getDrugGuideline(medicineName?: string): DrugGuideline | null {
  if (!medicineName) return null;
  const lower = medicineName.toLowerCase();

  for (const guide of DRUG_GUIDELINE_DATABASE) {
    const regex = new RegExp(`(${guide.genericMatch})`, 'i');
    if (regex.test(lower)) {
      return guide;
    }
  }

  return null;
}
