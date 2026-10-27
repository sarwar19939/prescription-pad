import type { DiseaseProtocolTemplate } from './types';

export const NEURO_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'tension-type-headache',
    title: 'Tension-Type Headache (Band-Like Pressure)',
    titleBn: 'টেনশন হেডেক (মাথায় পট্টি বাঁধার মতো ভোঁতা ব্যথা)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['tension headache', 'headache', 'মাথাব্যথা', 'stress headache', 'band like headache'],
    description: 'Simple analgesic (Paracetamol/NSAID) + stress management. Avoid medication overuse.',
    descriptionBn: 'প্যারাসিটামল, মাংসপেশির টান নিরাময় ও পর্যাপ্ত ঘুম।',
    medicines: [
      {
        brand_name: 'Fast',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '2 tabs SOS', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'ব্যথা শুরু হলে একসাথে ২টি ট্যাবলেট ভরা পেটে সেব্য।' },
      },
      {
        brand_name: 'Myonil',
        generic_name: 'Tolperisone',
        adult: { dosage_form: 'Tab', strength: '50 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'ঘাড় ও মাথার পেশির খিঁচুনি কমাতে।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন পর্যাপ্ত (৭-৮ ঘণ্টা) ঘুম নিশ্চিত করুন ও নির্দিষ্ট সময়ে খাবার খান।',
      'অতিরিক্ত ব্যথানাশক বড়ি খাওয়া থেকে বিরত থাকুন (এতে উল্টো ওষুধজনিত ক্রনিক মাথাব্যথা হয়)।',
    ],
  },
  {
    id: 'acute-migraine-abortive',
    title: 'Acute Migraine Attack (Throbbing Hemicranial Pain)',
    titleBn: 'তীব্র মাইগ্রেন অ্যাটাক (মাথার একপাশে দপদপে ব্যথা ও বমি ভাব)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['migraine', 'মাইগ্রেন', 'throbbing headache', 'photophobia headache'],
    description: 'Triptan (Zolmitriptan/Sumatriptan) or Naproxen + Domperidone anti-emetic prokinetic.',
    descriptionBn: 'দপদপে ব্যথায় ট্রিপটান বা ন্যাপ্রক্সেন ও বমি দূরীকরণে ডমপেরিডন।',
    medicines: [
      {
        brand_name: 'Zolmit',
        generic_name: 'Zolmitriptan',
        adult: { dosage_form: 'Tab', strength: '2.5 mg', schedule: '1 tab stat at onset', meal_timing: 'Anytime', duration: 'SOS', special_instructions: 'মাইগ্রেন ব্যথা শুরু হওয়ার সাথে সাথেই ১টি মুখে দেবেন। ২ ঘণ্টা পর না কমলে আরেকটি খেতে পারেন (দিনে সর্বোচ্চ ৫ মিগ্রা)।' },
      },
      {
        brand_name: 'Motigut',
        generic_name: 'Domperidone',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '1 tab stat with painkiller', meal_timing: 'Before Meal', duration: 'SOS', special_instructions: 'বমি বমি ভাব কমাতে ব্যথানাশকের সাথে সেব্য।' },
      },
    ],
    adviceBn: [
      'ব্যথা শুরু হলে দ্রুত একটি অন্ধকার ও শব্দহীন ঠাণ্ডা ঘরে শুয়ে বিশ্রাম নিন।',
      'চকলেট, পনির, কড়া রোদ, অতিরিক্ত সুগন্ধি ও দীর্ঘক্ষণ খালি পেটে থাকা মাইগ্রেনের ট্রিগার—এগুলো এড়িয়ে চলুন।',
    ],
  },
  {
    id: 'migraine-prophylaxis-protocol',
    title: 'Frequent Migraine Prophylaxis (Preventive Protocol)',
    titleBn: 'মাইগ্রেন প্রতিরোধক থেরাপি (ঘন ঘন মাথাব্যথা বন্ধে)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['migraine prophylaxis', 'frequent migraine', 'মাইগ্রেন প্রতিরোধ', 'prevent migraine'],
    description: 'Propranolol / Flunarizine daily maintenance for patients with > 3 disabling attacks/month.',
    descriptionBn: 'ফ্লুনারিজিন বা প্রোপ্রানোলল দিয়ে ঘন ঘন মাথাব্যথা ওঠা বন্ধের দীর্ঘমেয়াদী কোর্স।',
    medicines: [
      {
        brand_name: 'Sibelium',
        generic_name: 'Flunarizine',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '60-90 Days', special_instructions: 'প্রতিদিন রাতে ঘুমানোর পূর্বে ১টি।' },
      },
    ],
    adviceBn: [
      'ওষুধটি ব্যথা শুরু হলে খাওয়ার জন্য নয়, ব্যথা ওঠা বন্ধ করতে প্রতিদিন নিয়মিত খেতে হবে।',
      'একটি হেডেক ডায়েরি (Headache diary) রাখুন এবং কোন খাবারে ব্যথা ওঠে তা চিহ্নিত করুন।',
    ],
  },
  {
    id: 'bppv-benign-vertigo',
    title: 'Benign Paroxysmal Positional Vertigo (BPPV)',
    titleBn: 'ভার্টিগো ও মাথা ঘোরা (বিপিপিভি / বিছানায় এপাশ-ওপাশ করলে মাথা ঘোরা)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['bppv', 'vertigo', 'মাথা ঘোরা', 'dizziness positional', 'spinning head'],
    description: 'Epley maneuver canalith repositioning + short course vestibular suppressant (Cinnarizine).',
    descriptionBn: 'এপলি ম্যানুভার কানের ক্রিস্টাল প্রতিস্থাপন ও সিনারিজিন থেরাপি।',
    medicines: [
      {
        brand_name: 'Vertigon',
        generic_name: 'Cinnarizine',
        adult: { dosage_form: 'Tab', strength: '25 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5-7 Days', special_instructions: 'মাথা ঘোরার তীব্র অবস্থায় সেব্য।' },
      },
    ],
    adviceBn: [
      'বিছানা থেকে হঠাৎ করে মাথা ঝাঁকিয়ে উঠবেন না।',
      'ডাক্তারের নির্দেশনায় কানের ক্রিস্টাল জায়গামতো নেওয়ার জন্য এপলি এক্সারসাইজ (Epley Maneuver) করুন।',
    ],
  },
  {
    id: 'bells-palsy-facial-nerve',
    title: 'Bell\'s Palsy (Idiopathic Acute Facial Nerve Palsy)',
    titleBn: 'মুখ বাঁকা হয়ে যাওয়া (বেল\'স পালসি / মুখের স্নায়ুর দুর্বলতা)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['bells palsy', 'facial palsy', 'মুখ বাঁকা', 'facial weakness one side'],
    description: 'High-dose Prednisolone within 72 hours of onset + eye lubrication and night eye taping.',
    descriptionBn: '৭২ ঘণ্টার মধ্যে প্রেডনিসোলোন স্টেরয়েড ও চোখ সুরক্ষার জন্য ড্রপ/মলম।',
    medicines: [
      {
        brand_name: 'Prednisolone',
        generic_name: 'Prednisolone',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '3 tabs morning (60mg)', meal_timing: 'After Meal', duration: '5 Days then taper', special_instructions: 'সকালে নাস্তার পর ৬০ মিলিগ্রাম ৫ দিন, এরপর ধীরে ধীরে কমিয়ে বন্ধ করুন।' },
      },
      {
        brand_name: 'Tears Natural',
        generic_name: 'Carboxymethylcellulose 0.5% Drops',
        adult: { dosage_form: 'Drop', strength: '0.5%', schedule: '1 drop 2 hourly', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'চোখের পাতা বন্ধ না হলে কর্নিয়া শুকাতে না দেওয়ার জন্য ঘন ঘন দেবেন।' },
      },
    ],
    adviceBn: [
      'রাতে ঘুমানোর সময় আক্রান্ত চোখের ওপর পরিষ্কার গজ ও মাইক্রোপোর টেপ দিয়ে চোখ বন্ধ করে রাখুন।',
      'মুখের পেশি নাড়ানোর হালকা থেরাপি ও আয়নার সামনে হাসার চেষ্টা করুন।',
    ],
  },
  {
    id: 'trigeminal-neuralgia-facial-pain',
    title: 'Trigeminal Neuralgia (Lancinating Electric Facial Pain)',
    titleBn: 'ট্রাইজেমিনাল নিউরালজিয়া (মুখের একপাশে কারেন্টের শকের মতো তীব্র ব্যথা)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['trigeminal neuralgia', 'facial shock pain', 'মুখে কারেন্টের মতো ব্যথা'],
    description: 'First-line Carbamazepine sodium channel blocker titration + avoiding thermal/touch triggers.',
    descriptionBn: 'কার্বামাজেপিন দিয়ে স্নায়ুর সংবেদনশীলতা নিয়ন্ত্রণ।',
    medicines: [
      {
        brand_name: 'Tegretol / Carva',
        generic_name: 'Carbamazepine (Controlled Release)',
        adult: { dosage_form: 'Tab', strength: '200 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '30-60 Days', special_instructions: 'খাবারের পর সকাল ও রাতে সেব্য।' },
      },
    ],
    adviceBn: [
      'মুখে বরফ ঠাণ্ডা বা অতিরিক্ত গরম পানি সরাসরি স্পর্শ করবেন না।',
      'দাঁত মাজার সময় হালকাভাবে নরম ব্রাশ ব্যবহার করুন।',
    ],
  },
  {
    id: 'cervicogenic-headache-occipital',
    title: 'Cervicogenic Headache (Pain Radiating from Neck to Forehead)',
    titleBn: 'সারভাইকোজেনিক হেডেক (ঘাড়ের পেছনের হাড় থেকে কপালের দিকে ওঠা মাথাব্যথা)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['cervicogenic headache', 'occipital headache', 'ঘাড়ের পেছনে মাথাব্যথা'],
    description: 'Postural correction, neck stretching, muscle relaxant and physical therapy.',
    descriptionBn: 'ঘাড়ের টান ও মেরুদণ্ডের সমস্যা থেকে হওয়া মাথাব্যথার নিরাময়।',
    medicines: [
      {
        brand_name: 'Myonil',
        generic_name: 'Tolperisone',
        adult: { dosage_form: 'Tab', strength: '50 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'পেশির টান কমাতে খাবারের পর।' },
      },
      {
        brand_name: 'Napa Extend',
        generic_name: 'Paracetamol Extended Release',
        adult: { dosage_form: 'Tab', strength: '665 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'ভরা পেটে সেব্য।' },
      },
    ],
    adviceBn: [
      'মোবাইল বা স্ক্রিনে দীর্ঘক্ষণ নিচু হয়ে তাকানো বন্ধ করুন।',
      'ঘাড়ের পেছনের অংশে গরম সেঁক দিন।',
    ],
  },
];
