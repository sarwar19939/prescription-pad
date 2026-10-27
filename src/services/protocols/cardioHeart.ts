import type { DiseaseProtocolTemplate } from './types';

export const CARDIO_HEART_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'dyslipidemia-hypercholesterolemia',
    title: 'Dyslipidemia / Hypercholesterolemia',
    titleBn: 'রক্তে অতিরিক্ত কোলেস্টেরল ও চর্বি',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['dyslipidemia', 'cholesterol', 'হাই কোলেস্টেরল', 'high ldl', 'hyperlipidemia'],
    description: 'High/moderate-intensity HMG-CoA reductase inhibitor (Statin) therapy.',
    descriptionBn: 'হৃদরোগের ঝুঁকি কমাতে স্ট্যাটিন থেরাপি ও তেলমুক্ত খাদ্যতালিকা।',
    medicines: [
      {
        brand_name: 'Atova',
        generic_name: 'Atorvastatin',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30-90 Days', special_instructions: 'রাতে খাবারের পর ১টি নিয়মিত সেব্য।' },
      },
      {
        brand_name: 'Lipicon',
        generic_name: 'Rosuvastatin',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'রাতে ১টি।' },
      },
    ],
    adviceBn: [
      'গরু-খাসির মাংস, ডিমের কুসুম, চিংড়ি, ঘি, মাখন ও ডালডা সম্পূর্ণ পরিহার করুন।',
      'সয়াবিন তেলের বদলে অলিভ অয়েল বা সরিষার তেল সামান্য পরিমাণে ব্যবহার করুন।',
      'প্রতি ৩ মাস অন্তর লিপিড প্রোফাইল ও এসজিপিটি পরীক্ষা করুন।',
    ],
  },
  {
    id: 'hypertriglyceridemia-severe',
    title: 'Hypertriglyceridemia (High Blood Triglycerides)',
    titleBn: 'রক্তে উচ্চ ট্রাইগ্লিসারাইড (টিজি)',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['triglyceride', 'hypertriglyceridemia', 'high tg', 'উচ্চ ট্রাইগ্লিসারাইড'],
    description: 'Fibrate therapy to prevent acute pancreatitis and cardiovascular risk.',
    descriptionBn: 'প্যানক্রিয়াটাইটিস ও রক্তনালীর চর্বি প্রতিরোধে ফেনোফাইব্রেট থেরাপি।',
    medicines: [
      {
        brand_name: 'Lipirex',
        generic_name: 'Fenofibrate',
        adult: { dosage_form: 'Cap', strength: '145 mg', schedule: '1+0+0', meal_timing: 'With Meal', duration: '60 Days', special_instructions: 'দুপুরে ভারী খাবারের সাথে ১টি।' },
      },
      {
        brand_name: 'Mega-3',
        generic_name: 'Omega-3 Fatty Acids',
        adult: { dosage_form: 'Cap', strength: '1000 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '60 Days', special_instructions: 'খাবারের পর সেব্য।' },
      },
    ],
    adviceBn: [
      'মিষ্টি, কোমল পানীয়, অ্যালকোহল ও অতিরিক্ত ভাত-রুটি সম্পূর্ণ সীমিত করুন।',
      'প্রতিদিন অন্তত ৪০ মিনিট অ্যারোবিক এক্সারসাইজ বা দ্রুত হাঁটুন।',
    ],
  },
  {
    id: 'stable-angina-pectoris',
    title: 'Stable Angina Pectoris (Ischemic Heart Disease)',
    titleBn: 'এনজাইনা / ইসকেমিক হৃদরোগ (বুকে ব্যথা)',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['angina', 'ihd', 'ischemic heart disease', 'হৃদরোগ', 'chest pain on exertion'],
    description: 'Antiplatelet, beta-blocker, statin, and sublingual nitrate for acute episodes.',
    descriptionBn: 'অ্যাসপিরিন, বিটা-ব্লকার এবং নাইট্রোগ্লিসারিন স্প্রে সমৃদ্ধ হৃদরোগ সুরক্ষা।',
    medicines: [
      {
        brand_name: 'Ecosprin',
        generic_name: 'Aspirin (Enteric Coated)',
        adult: { dosage_form: 'Tab', strength: '75 mg', schedule: '0+1+0', meal_timing: 'After Meal', duration: 'Long term', special_instructions: 'দুপুরে ভরা পেটে ১টি।' },
      },
      {
        brand_name: 'Cardibis',
        generic_name: 'Bisoprolol Fumarate',
        adult: { dosage_form: 'Tab', strength: '2.5 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'সকালে নাস্তার পর হৃৎস্পন্দন নিয়ন্ত্রণে।' },
      },
      {
        brand_name: 'Nitrocard Spray',
        generic_name: 'Nitroglycerin Sublingual Spray',
        adult: { dosage_form: 'Drop', strength: '0.4 mg/puff', schedule: '1 puff SOS', meal_timing: 'Anytime', duration: 'As needed', special_instructions: 'বুকে ব্যথা হলে জিহ্বার নিচে ১ চাপ। ৫ মিনিট পর না কমলে আরও ১ চাপ।' },
      },
    ],
    adviceBn: [
      'নাইট্রোগ্লিসারিন স্প্রে সবসময় নিজের সাথে ব্যাগে বা পকেটে রাখুন।',
      'ভারী পরিশ্রম বা দ্রুত দৌড়াদৌড়ি এড়িয়ে চলুন, বুকে চাপ লাগলে বসে পড়ুন।',
      'ব্যথা ১৫ মিনিটের বেশি স্থায়ী হলে অনতিবিলম্বে কার্ডিয়াক হাসপাতালে যান।',
    ],
  },
  {
    id: 'post-mi-secondary-prevention',
    title: 'Post Myocardial Infarction / Post-PCI Secondary Prevention',
    titleBn: 'হার্ট অ্যাটাক পরবর্তী দীর্ঘমেয়াদী চিকিৎসা ও সুরক্ষা',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['post mi', 'myocardial infarction', 'heart attack', 'stent post pci', 'হার্ট অ্যাটাক'],
    description: 'Dual antiplatelet therapy (DAPT), high-intensity statin, ACEI/ARB and beta-blocker.',
    descriptionBn: 'পুনরায় রক্ত জমাট বাঁধা রোধে ডুয়েল অ্যান্টিপ্লাটলেট ও কার্ডিওপ্রোটেক্টিভ কোর্স।',
    medicines: [
      {
        brand_name: 'Anclog-A',
        generic_name: 'Aspirin + Clopidogrel',
        adult: { dosage_form: 'Tab', strength: '75/75 mg', schedule: '0+1+0', meal_timing: 'After Meal', duration: '1 Year', special_instructions: 'দুপুরে ভরা পেটে নিয়মিত সেব্য।' },
      },
      {
        brand_name: 'Atova',
        generic_name: 'Atorvastatin',
        adult: { dosage_form: 'Tab', strength: '40 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: 'Long term', special_instructions: 'উচ্চ মাত্রার স্ট্যাটিন রক্তনালী পরিষ্কার রাখতে সাহায্য করে।' },
      },
      {
        brand_name: 'Cardibis',
        generic_name: 'Bisoprolol',
        adult: { dosage_form: 'Tab', strength: '2.5 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: 'Long term', special_instructions: 'হৃৎস্পন্দন ও রক্তচাপ নিয়ন্ত্রণে সকালে।' },
      },
    ],
    adviceBn: [
      'কোনো ওষুধ ১ দিনের জন্যও ডাক্তারের পরামর্শ ছাড়া বন্ধ করবেন না।',
      'ধূমপান ও জর্দা সম্পূর্ণভাবে ত্যাগ করুন।',
      'নিয়মিত হালকা হাঁটাচলা ও রক্তচাপ পর্যবেক্ষণ করুন।',
    ],
  },
  {
    id: 'heart-failure-supportive-opd',
    title: 'Heart Failure with Reduced Ejection Fraction (Stable OPD)',
    titleBn: 'হার্ট ফেইলিওর (হৃৎপিণ্ডের দুর্বলতা ও পায়ে পানি)',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['heart failure', 'chf', 'হার্ট ফেইলিউর', 'leg edema breathlessness', 'pedal edema'],
    description: 'Loop diuretic congestion relief, SGLT2 inhibitor and mineralocorticoid receptor antagonist.',
    descriptionBn: 'ফুসফুস ও পায়ের পানি কমাতে ডাইইউরেটিক এবং হার্ট সুরক্ষাকারী ওষুধ।',
    medicines: [
      {
        brand_name: 'Frusid',
        generic_name: 'Furosemide',
        adult: { dosage_form: 'Tab', strength: '40 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '14-30 Days', special_instructions: 'সকালে সেব্য প্রস্রাবের মাধ্যমে বাড়তি পানি বের করতে।' },
      },
      {
        brand_name: 'Dapaglif',
        generic_name: 'Dapagliflozin',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'হার্টের পাম্পিং ক্ষমতা ও বেঁচে থাকার সম্ভাবনা বাড়ায়।' },
      },
    ],
    adviceBn: [
      'দিনে সব মিলিয়ে ১ থেকে ১.৫ লিটারের বেশি পানি/তরল খাবার গ্রহণ করবেন না।',
      'প্রতিদিন সকালে একই জামা পরে ওজন মাপুন; ২ দিনে ২ কেজি ওজন বাড়লে পানি জমার লক্ষণ।',
    ],
  },
  {
    id: 'atrial-fibrillation-rate-control',
    title: 'Atrial Fibrillation (Rate Control Strategy)',
    titleBn: 'অ্যাট্রিয়াল ফিব্রিলেশন (অনিয়মিত ও দ্রুত হৃৎস্পন্দন)',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['atrial fibrillation', 'af', 'irregular pulse', 'বুক ধড়ফড়', 'palpitation'],
    description: 'Rate control beta blocker or diltiazem with stroke risk stratification.',
    descriptionBn: 'হার্টবিট নিয়মিত রাখা ও স্ট্রোক ঝুঁকি প্রতিরোধে বিটা ব্লকার।',
    medicines: [
      {
        brand_name: 'Concor',
        generic_name: 'Bisoprolol',
        adult: { dosage_form: 'Tab', strength: '5 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'সকালে ১টি।' },
      },
    ],
    adviceBn: [
      'চা, কফি, জর্দা, সিগারেট ও এনার্জি ড্রিংক সম্পূর্ণ নিষিদ্ধ।',
      'স্ট্রোক প্রতিরোধে কার্ডিওলজিস্টের পরামর্শে রক্ত তরল করার ওষুধ (Anticoagulant) বিবেচনা করুন।',
    ],
  },
  {
    id: 'peripheral-artery-disease',
    title: 'Peripheral Artery Disease / Intermittent Claudication',
    titleBn: 'পায়ের ধমনীতে রক্ত চলাচল কমে যাওয়া (হাঁটলে পায়ে খিল ধরা)',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['peripheral artery disease', 'pad', 'claudication', 'leg pain on walking'],
    description: 'Cilostazol phosphodiesterase inhibitor with antiplatelet therapy.',
    descriptionBn: 'পায়ের রক্তনালী প্রসারক এবং রক্ত জমাট বাঁধা প্রতিরোধ।',
    medicines: [
      {
        brand_name: 'Cilostaz',
        generic_name: 'Cilostazol',
        adult: { dosage_form: 'Tab', strength: '100 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '60 Days', special_instructions: 'খাবারের আধ ঘণ্টা আগে।' },
      },
      {
        brand_name: 'Clopid',
        generic_name: 'Clopidogrel',
        adult: { dosage_form: 'Tab', strength: '75 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '60 Days', special_instructions: 'রাতে খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'ধূমপান সম্পূর্ণ পরিহার না করলে পা পচে গ্যাংগ্রিন হতে পারে।',
      'প্রতিদিন ব্যথার সীমার ভেতরে নিয়মিত হাঁটার অভ্যাস বজায় রাখুন।',
    ],
  },
  {
    id: 'varicose-veins-cvi',
    title: 'Chronic Venous Insufficiency / Varicose Veins',
    titleBn: 'ভেরিকোজ ভেইন (পায়ের স্ফীত ও নীল শিরা)',
    category: 'Cardiovascular & Vaso',
    diagnosisMatch: ['varicose veins', 'cvi', 'venous insufficiency', 'spider veins on legs'],
    description: 'Venoactive flavonoid therapy, compression stockings, and leg elevation.',
    descriptionBn: 'শিরার স্থিতিস্থাপকতা বৃদ্ধি ও কম্প্রেশন মোজা থেরাপি।',
    medicines: [
      {
        brand_name: 'Daflon',
        generic_name: 'Micronized Flavonoid Fraction',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '60-90 Days', special_instructions: 'খাবারের সাথে সকাল ও রাতে।' },
      },
    ],
    adviceBn: [
      'টানা দাঁড়িয়ে বা বসে থাকবেন না, প্রতি ঘণ্টায় অন্তত কয়েক মিনিট হাঁটুন।',
      'রাতে ঘুমানোর সময় পায়ের নিচে ১টি বালিশ দিয়ে পা হার্ট থেকে সামান্য উঁচুতে রাখুন।',
      'দিনে ক্লাস্টার গ্র্যাজুয়েটেড কম্প্রেশন মোজা (Class 2 stockings) ব্যবহার করুন।',
    ],
  },
];
