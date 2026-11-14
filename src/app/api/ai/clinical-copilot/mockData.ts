/**
 * Intelligent Mock Fallbacks Hub for Development & Offline Mode.
 */
export { mockLabAnalysis } from './mockLabAnalysis';
export { mockImageAnalysis } from './mockImageAnalysis';
export { mockClinicalTrack } from './mockClinicalTrack';

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
        { brand_name: 'ORS Saline', generic_name: 'Oral Rehydration Salts', dosage_form: 'Sachet', strength: '1 Sachet / 500ml', schedule: '1+1+1', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রতিদিন অন্তত ২.৫ থেকে ৩ লিটার স্যালাইন ও তরল খাবার পান করুন।' },
      ],
      advice: [
        'প্রচুর পরিমাণে পানি, খাবার স্যালাইন, ডাবের পানি ও ফলের রস পান করুন।',
        'কোনো অবস্থাতেই অ্যাসপিরিন বা ব্যথানাশক (NSAIDs) সেবন করবেন না।',
        'তীব্র পেটব্যথা, অবিরাম বমি বা মাড়ি দিয়ে রক্তক্ষরণ হলে অবিলম্বে হাসপাতালে যোগাযোগ করুন।',
      ],
    };
  }

  // 2. Diarrhea / Gastroenteritis Protocol (icddr,b & Master The Chamber)
  if (
    d.includes('diarrhea') ||
    d.includes('diarrhoea') ||
    d.includes('ডায়রিয়া') ||
    d.includes('পাতলা পায়খানা') ||
    d.includes('gastroenteritis') ||
    d.includes('vomit') ||
    d.includes('বমি') ||
    d.includes('watery') ||
    d.includes('cholera') ||
    d.includes('loose motion')
  ) {
    return {
      diagnosis,
      medicines: [
        { brand_name: 'ORS Saline', generic_name: 'Oral Rehydration Salts', dosage_form: 'Sachet', strength: '1 Sachet / 500ml', schedule: 'SOS', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'প্রতিবার পাতলা পায়খানার পর ১ গ্লাস (২৫০ মিলি) প্রস্তুত স্যালাইন।' },
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

  // 3. Hypertension (উচ্চ রক্তচাপ) Protocol
  if (d.includes('hypertension') || d.includes('htn') || d.includes('উচ্চ রক্তচাপ') || d.includes('high bp')) {
    return {
      diagnosis,
      medicines: [
        { brand_name: 'Camlodin', generic_name: 'Amlodipine', dosage_form: 'Tab', strength: '5 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: 'Continue', special_instructions: 'প্রতিদিন রাতে নির্দিষ্ট সময়ে নিয়মিত সেব্য।' },
        { brand_name: 'Bislol', generic_name: 'Bisoprolol Fumarate', dosage_form: 'Tab', strength: '2.5 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: 'Continue', special_instructions: 'সকালে নাস্তার পর নিয়মিত সেব্য।' },
      ],
      advice: [
        'কাঁচা লবণ খাওয়া সম্পূর্ণ বন্ধ করুন এবং রান্নায় লবণের পরিমাণ সীমিত রাখুন।',
        'প্রতিদিন অন্তত ৩০ মিনিট দ্রুত হাঁটার অভ্যাস গড়ে তুলুন।',
        'প্রতি সপ্তাহে অন্তত একবার রক্তচাপ মেপে লিখে রাখুন।',
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

  // 5. Scabies Protocol (খোসপাঁচড়া)
  if (d.includes('scabies') || d.includes('খোসপাঁচড়া')) {
    return {
      diagnosis,
      medicines: [
        { brand_name: 'Lorex 5% Cream', generic_name: 'Permethrin 5% w/w', dosage_form: 'Oint', strength: '5%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '1 Day (Repeat in 7 days)', special_instructions: 'ঘাড় থেকে পায়ের পাতা পর্যন্ত মেখে ৮-১২ ঘণ্টা পর সাবান দিয়ে ধুয়ে ফেলবেন।' },
        { brand_name: 'Bilastin', generic_name: 'Bilastine', dosage_form: 'Tab', strength: '20 mg', schedule: '0+0+1', meal_timing: 'Before Meal', duration: '10 Days', special_instructions: 'রাতে শোয়ার আগে তীব্র চুলকানি উপশমে।' },
      ],
      advice: [
        'পরিবারের সকল সদস্যের একই রাতে একসাথে চিকিৎসা গ্রহণ করতে হবে।',
        'ব্যবহৃত সকল জামাকাপড় ও বিছানার চাদর ফুটন্ত গরম পানিতে ধুয়ে রোদে শুকান।',
      ],
    };
  }

  // 6. Tinea Corporis / Ringworm Protocol (দাদ)
  if (d.includes('tinea') || d.includes('ringworm') || d.includes('দাদ')) {
    return {
      diagnosis,
      medicines: [
        { brand_name: 'Exifin', generic_name: 'Terbinafine', dosage_form: 'Tab', strength: '250 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '14-21 Days', special_instructions: 'প্রতিদিন দুপুরে খাবারের পর ১টি।' },
        { brand_name: 'Lulizol Cream', generic_name: 'Luliconazole 1% Cream', dosage_form: 'Oint', strength: '1%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '14-21 Days', special_instructions: 'ক্ষতস্থানের অন্তত ১ ইঞ্চি বাইরে পর্যন্ত হালকা মেখে দিন।' },
        { brand_name: 'Alatrol', generic_name: 'Cetirizine', dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'রাতে শোয়ার আগে চুলকানি কমাতে।' },
      ],
      advice: [
        'ক্ষতস্থানে কোনো অবস্থাতেই স্টেরয়েড মলম লাগাবেন না।',
        'ব্যক্তিগত তোয়ালে ও কাপড় ফুটন্ত গরম পানিতে ধুয়ে রোদে শুকান।',
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
