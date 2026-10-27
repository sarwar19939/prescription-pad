import type { DiseaseProtocolTemplate } from './types';

export const ENDOCRINE_METABOLIC_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'primary-hypothyroidism',
    title: 'Primary Hypothyroidism',
    titleBn: 'হাইপোথাইরয়েডিজম (থাইরয়েড হরমোনের ঘাটতি)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['hypothyroidism', 'thyroid', 'হাইপোথাইরয়েড', 'high tsh', 'fatigue weight gain'],
    description: 'Levothyroxine sodium morning replacement, fasting administration counseling.',
    descriptionBn: 'লেভোথাইরক্সিন হরমোন রিপ্লেসমেন্ট থেরাপি ও নিয়মিত টিএসএইচ ফলোআপ।',
    medicines: [
      {
        brand_name: 'Thyrox',
        generic_name: 'Levothyroxine Sodium',
        adult: { dosage_form: 'Tab', strength: '50 mcg', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '90 Days', special_instructions: 'ঘুম থেকে উঠে খালি পেটে ১ গ্লাস পানিসহ। খাওয়ার অন্তত ৪৫ মিনিট পর চা/নাস্তা খাবেন।' },
        pediatric: { dosage_form: 'Tab', strength: '25 mcg', schedule: '1+0+0', meal_timing: 'Before Meal', duration: '90 Days', special_instructions: 'সকালে খালি পেটে।' },
      },
    ],
    adviceBn: [
      'সকালের ওষুধ খাওয়ার অন্তত ৪ ঘণ্টার মধ্যে আয়রন বা ক্যালসিয়ামের বড়ি খাবেন না।',
      'ওষুধ চলাকালীন ৬-৮ সপ্তাহ পর সিরাম টিএসএইচ (TSH) পরীক্ষা করে ডোজ অ্যাডজাস্ট করতে হবে।',
      'লক্ষণ ভালো হলেও ওষুধ বন্ধ করবেন না; এটি শরীরের স্বাভাবিক ঘাটতি পূরণ করে।',
    ],
  },
  {
    id: 'hyperthyroidism-graves',
    title: 'Hyperthyroidism / Toxic Diffuse Goiter (Graves Disease)',
    titleBn: 'হাইপারথাইরয়েডিজম (থাইরয়েড হরমোনের অতিরিক্ত ক্ষরণ ও বুক ধড়ফড়)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['hyperthyroidism', 'graves', 'হাইপারথাইরয়েড', 'low tsh high ft4', 'weight loss palpitation'],
    description: 'Antithyroid thionamide (Carbimazole) titration with beta blocker symptom control.',
    descriptionBn: 'কার্বিমাজোল দিয়ে হরমোন উৎপাদন বন্ধ করা ও হৃদস্পন্দন নিয়ন্ত্রণ।',
    medicines: [
      {
        brand_name: 'Thycab',
        generic_name: 'Carbimazole',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '30-60 Days', special_instructions: 'নিয়মিত ৮ ঘণ্টা পর পর সেব্য।' },
      },
      {
        brand_name: 'Indever',
        generic_name: 'Propranolol',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '14-30 Days', special_instructions: 'বুক ধড়ফড় ও হাতের কাঁপুনি কমাতে।' },
      },
    ],
    adviceBn: [
      'গলা ব্যথা বা জ্বর দেখা দিলে সাথে সাথে রক্তের CBC (শ্বেতকণিকা) পরীক্ষা করাবেন (এগ্রানুলোসাইটোসিস ঝুঁকি)।',
      'প্রতি ৬ সপ্তাহ অন্তর FT4 ও TSH পরীক্ষা করে ডোজ কমাতে হবে।',
    ],
  },
  {
    id: 'acute-gout-flare',
    title: 'Acute Gouty Arthritis Flare',
    titleBn: 'তীব্র গাউট বাত / ইউরিক এসিডের প্রদাহ (পায়ের বুড়ো আঙুলে তীব্র ব্যথা)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['gout', 'gouty arthritis', 'গাউট', 'uric acid', 'podagra', 'big toe severe swelling'],
    description: 'Colchicine low-dose protocol + NSAID/Corticosteroid. Avoid allopurinol during acute flare.',
    descriptionBn: 'কলচিসিন থেরাপি দিয়ে তীব্র ব্যথা উপশম (তীব্র ব্যথার সময় অ্যালোপিউরিনল শুরু করবেন না)।',
    medicines: [
      {
        brand_name: 'Colcin',
        generic_name: 'Colchicine',
        adult: { dosage_form: 'Tab', strength: '0.5 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5-7 Days', special_instructions: 'ব্যথা কমে যাওয়া পর্যন্ত দিনে ২ বার।' },
      },
      {
        brand_name: 'Napryn',
        generic_name: 'Naproxen',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'ভরা পেটে প্রচুর পানিসহ সেব্য।' },
      },
      {
        brand_name: 'Pantil',
        generic_name: 'Pantoprazole',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খালি পেটে সেব্য গ্যাস্ট্রিক সুরক্ষায়।' },
      },
    ],
    adviceBn: [
      'লাল মাংস (গরু, খাসি), কলিজা, পুঁইশাক, পালংশাক, মসুর ডাল, সামুদ্রিক মাছ ও ফুলকপি সাময়িক বর্জন করুন।',
      'প্রতিদিন অন্তত ৩.৫ লিটার পানি পান করুন যাতে অতিরিক্ত ইউরিক এসিড প্রস্রাবের সাথে বের হয়ে যায়।',
      'আক্রান্ত জয়েন্টে বরফ সেঁক দিন, কোনো গরম সেঁক দেবেন না।',
    ],
  },
  {
    id: 'chronic-gout-urate-lowering',
    title: 'Chronic Gout / Hyperuricemia Prophylaxis',
    titleBn: 'ক্রনিক গাউট ও ইউরিক এসিড কমানোর থেরাপি',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['chronic gout', 'hyperuricemia', 'high uric acid', 'tophi'],
    description: 'Febuxostat / Allopurinol xanthine oxidase inhibitor titration with anti-flare prophylaxis.',
    descriptionBn: 'রক্তের ইউরিক এসিড ৬.০ এর নিচে নামিয়ে আনতে ফেবুক্সোস্ট্যাট থেরাপি।',
    medicines: [
      {
        brand_name: 'Feburic',
        generic_name: 'Febuxostat',
        adult: { dosage_form: 'Tab', strength: '40 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '60-90 Days', special_instructions: 'প্রতিদিন দুপুরে খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'ওষুধ শুরুর প্রথম কয়েক সপ্তাহ মৃদু ব্যথা বাড়লে কলচিসিন যুক্ত করুন।',
      'টার্গেট: সিরাম ইউরিক এসিড ৬.০ মিলিগ্রাম/ডেসিলিটারের নিচে রাখা।',
    ],
  },
  {
    id: 'vitamin-d-deficiency-severe',
    title: 'Severe Vitamin D Deficiency / Hypovitaminosis D',
    titleBn: 'ভিটামিন ডি-এর তীব্র ঘাটতি ও শরীর ব্যথা',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['vitamin d', 'hypovitaminosis d', 'ভিটামিন ডি', 'generalized bone pain fatigue'],
    description: 'High-dose 40,000 / 60,000 IU weekly cholecalciferol loading followed by maintenance.',
    descriptionBn: 'উচ্চ মাত্রার ৪০,০০০ বা ৬০,০০০ ইউনিট সাপ্তাহিক চোলক্যালসিফেরল লোডিং ডোজ।',
    medicines: [
      {
        brand_name: 'D-Rise Capsule',
        generic_name: 'Cholecalciferol (Vitamin D3)',
        adult: { dosage_form: 'Cap', strength: '40,000 IU', schedule: '1 cap weekly for 8 weeks', meal_timing: 'With Meal', duration: '8 Weeks', special_instructions: 'সপ্তাহে নির্দিষ্ট একটি দিনে ভারী খাবারের পর ১টি। টানা ৮ সপ্তাহ।' },
      },
      {
        brand_name: 'Calbo-D',
        generic_name: 'Calcium + Vitamin D3',
        adult: { dosage_form: 'Tab', strength: '500mg+200IU', schedule: '0+0+1', meal_timing: 'After Meal', duration: '60 Days', special_instructions: 'রাতে খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন সকাল ১০টা থেকে দুপুর ২টার মধ্যে অন্তত ২০ মিনিট চামড়ায় সরাসরি রোদ লাগান (সানস্ক্রিন ছাড়া)।',
      'ডিমের কুসুম, সামুদ্রিক মাছ ও দুধ নিয়মিত খাদ্যতালিকায় রাখুন।',
    ],
  },
  {
    id: 'postmenopausal-osteoporosis',
    title: 'Postmenopausal Osteoporosis',
    titleBn: 'অস্টিওপোরোসিস (হাড়ের ক্ষয় ও ভঙ্গুরতা)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['osteoporosis', 'হাড় ক্ষয়', 'bone loss', 'dowager hump', 'low dexa score'],
    description: 'Bisphosphonate alendronate weekly dosing with fasting and strict posture rules.',
    descriptionBn: 'হাড়ের পুনর্গঠনে সাপ্তাহিক অ্যালেন্ড্রোনেট বড়ি ও কঠোর অবস্থান নিয়ম।',
    medicines: [
      {
        brand_name: 'Fosamax / Osteofix',
        generic_name: 'Alendronate Sodium',
        adult: { dosage_form: 'Tab', strength: '70 mg', schedule: '1 tab weekly', meal_timing: 'Before Meal', duration: '6 Months', special_instructions: 'সপ্তাহে নির্দিষ্ট দিনে সকালে খালি পেটে ১ গ্লাস সাধারণ পানিসহ। সেবনের পর ৩০ মিনিট সোজা হয়ে বসে বা দাঁড়িয়ে থাকবেন (শোবেন না)।' },
      },
      {
        brand_name: 'Coral-Cal D',
        generic_name: 'Calcium Carbonate (Coral) + Vitamin D3',
        adult: { dosage_form: 'Tab', strength: '500mg+200IU', schedule: '1+0+1', meal_timing: 'After Meal', duration: '90 Days', special_instructions: 'সকাল ও রাতে খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'বাসায় পড়ে যাওয়া রোধে পিচ্ছিল মেঝে ও বাথরুমে সতর্কতা বজায় রাখুন।',
      'প্রতিদিন হালকা ওজনসহ স্ট্রেংথ ও ব্যালেন্স এক্সারসাইজ করুন।',
    ],
  },
  {
    id: 'diabetic-peripheral-neuropathy',
    title: 'Diabetic Peripheral Neuropathy (Burning Feet)',
    titleBn: 'ডায়াবেটিক নিউরোপ্যাথি (পায়ের তালুতে জ্বালাপোড়া ও অবশ ভাব)',
    category: 'Endocrine & Metabolic',
    diagnosisMatch: ['diabetic neuropathy', 'burning feet', 'পা জ্বালাপোড়া', 'peripheral neuropathy diabetes'],
    description: 'Pregabalin/Duloxetine with neurotrophic B-vitamins (Methylcobalamin) and foot care.',
    descriptionBn: 'স্নায়ুর সুরক্ষা, মেথাইলকোবালামিন ও ব্যথানাশক প্রিগাবালিন থেরাপি।',
    medicines: [
      {
        brand_name: 'Prebel',
        generic_name: 'Pregabalin',
        adult: { dosage_form: 'Cap', strength: '50 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30-60 Days', special_instructions: 'রাতের বেলা শোয়ার আগে ১টি।' },
      },
      {
        brand_name: 'Mecolin',
        generic_name: 'Methylcobalamin (Active Vitamin B12)',
        adult: { dosage_form: 'Tab', strength: '500 mcg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '60 Days', special_instructions: 'স্নায়ু পুনর্গঠনে সকাল ও রাতে।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন শোবার আগে পায়ের পাতা ভালো করে পরীক্ষা করুন কোনো কাটা বা ক্ষত আছে কি না।',
      'কখনো খালি পায়ে হাঁটবেন না, আরামদায়ক নরম জুতো ও সুতির মোজা পরুন।',
    ],
  },
];
