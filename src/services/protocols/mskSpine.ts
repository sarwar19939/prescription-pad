import type { DiseaseProtocolTemplate } from './types';

export const MSK_SPINE_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'mechanical-low-back-pain',
    title: 'Acute Mechanical Low Back Pain (Lumbago)',
    titleBn: 'কোমরে তীব্র ব্যথা (লুম্বাগো ও মাংসপেশির টান)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['back pain', 'lumbago', 'কোমর ব্যথা', 'low back pain', 'muscle spasm back'],
    description: 'NSAID + Muscle relaxant (Tolperisone/Thiocolchicoside) with active movement.',
    descriptionBn: 'ব্যথানাশক, মাংসপেশি শিথিলকারক ওষুধ ও শক্ত বিছানায় শোয়ার পরামর্শ।',
    medicines: [
      {
        brand_name: 'Napryn',
        generic_name: 'Naproxen',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5-7 Days', special_instructions: 'ভরা পেটে প্রচুর পানিসহ সেব্য।' },
      },
      {
        brand_name: 'Myonil',
        generic_name: 'Tolperisone Hydrochloride',
        adult: { dosage_form: 'Tab', strength: '50 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'পেশীর টান ও খিঁচুনি কমাতে।' },
      },
      {
        brand_name: 'Maxpro',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খালি পেটে সেব্য।' },
      },
    ],
    adviceBn: [
      'টানা ৩ দিনের বেশি সম্পূর্ণ বিছানায় শুয়ে থাকবেন না; হালকা চলাফেরা করলে ব্যথা দ্রুত সারে।',
      'ভারী কোনো বস্তু ঝুঁকে তুলবেন না, হাঁটু ভাঁজ করে বসুন।',
      'শক্ত সমান তোশক বিছানায় ঘুমাবেন।',
    ],
  },
  {
    id: 'cervical-spondylosis-neck-pain',
    title: 'Cervical Spondylosis (Neck Pain & Radiating Arm Numbness)',
    titleBn: 'ঘাড় ব্যথা ও সারভাইকাল স্পন্ডাইলোসিস (হাতে ঝিমঝিম করা)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['cervical spondylosis', 'neck pain', 'ঘাড় ব্যথা', 'arm numbness neck'],
    description: 'NSAID + Gabapentinoid / B-vitamins with isometric neck exercises and ergonomic pillow.',
    descriptionBn: 'ঘাড়ের হাড়ের ক্ষয়ে ব্যথানাশক, স্নায়ুর ওষুধ ও ঘাড়ের আইসোমেট্রিক ব্যায়াম।',
    medicines: [
      {
        brand_name: 'Celeb',
        generic_name: 'Celecoxib',
        adult: { dosage_form: 'Cap', strength: '200 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '10 Days', special_instructions: 'ভরা পেটে সেব্য।' },
      },
      {
        brand_name: 'Sergel',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '10 Days', special_instructions: 'খাবারের ২০ মিনিট পূর্বে খালি পেটে।' },
      },
      {
        brand_name: 'Recon',
        generic_name: 'Pregabalin',
        adult: { dosage_form: 'Cap', strength: '50 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '14-30 Days', special_instructions: 'হাতে অবশ ভাব বা ঝিনঝিনে রাতে ১টি।' },
      },
    ],
    adviceBn: [
      'মোবাইল বা ল্যাপটপে কাজ করার সময় মাথা দীর্ঘক্ষণ ঝুঁকিয়ে রাখবেন না।',
      'ঘুমানোর সময় খুব উঁচু বা অতিরিক্ত নরম বালিশ বর্জন করুন (সারভাইকাল পিলো ব্যবহার করুন)।',
      'মাথায় কোনো ভারী বোঝা বহন করবেন না।',
    ],
  },
  {
    id: 'sciatica-lumbar-radiculopathy',
    title: 'Sciatica / Lumbar Radiculopathy (Leg Shooting Pain)',
    titleBn: 'সায়াটিকা (কোমর থেকে পায়ের নিচ পর্যন্ত নেমে যাওয়া তীব্র টান ও ব্যথা)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['sciatica', 'lumbar radiculopathy', 'সায়াটিকা', 'leg pain shooting from back'],
    description: 'Neuropathic agent (Pregabalin), NSAID, short steroid burst if severe, and physio guidance.',
    descriptionBn: 'সায়াটিক নার্ভের চাপে প্রিগাবালিন, ব্যথানাশক ও নিউরোলজিক্যাল ব্যায়াম।',
    medicines: [
      {
        brand_name: 'Prebel',
        generic_name: 'Pregabalin',
        adult: { dosage_form: 'Cap', strength: '75 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'রাতের বেলা শোবার পূর্বে ১টি।' },
      },
      {
        brand_name: 'Napryn',
        generic_name: 'Naproxen',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'ভরা পেটে সেব্য।' },
      },
      {
        brand_name: 'Sergel',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'ব্যথানাশকজনিত অ্যাসিডিটি প্রতিরোধে খালি পেটে।' },
      },
    ],
    adviceBn: [
      'সামনে ঝুঁকে কাজ করা সম্পূর্ণ নিষেধ; কোমর সোজা রাখার জন্য লাম্বার কর্সেট বেল্ট ব্যবহার করতে পারেন।',
      'প্রস্রাব বা পায়খানার ওপর নিয়ন্ত্রণ হারালে দ্রুত জরুরি ভিত্তিতে স্পাইন সার্জনের কাছে যেতে হবে।',
    ],
  },
  {
    id: 'ankylosing-spondylitis-early',
    title: 'Ankylosing Spondylitis (Morning Stiffness in Spine)',
    titleBn: 'অ্যাঙ্কাইলোজিং স্পন্ডিলাইটিস (সকালে মেরুদণ্ড শক্ত হয়ে থাকা ও ব্যথা)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['ankylosing spondylitis', 'as spine', 'মেরুদণ্ড শক্ত হয়ে থাকা', 'morning spine stiffness'],
    description: 'Continuous NSAID therapy (Naproxen/Celecoxib), spine mobility exercises and rheumatology referral.',
    descriptionBn: 'মেরুদণ্ডের নমনীয়তা ধরে রাখতে নিয়মিত স্ট্রেচিং ও অ্যান্টি-ইনফ্ল্যামেটরি কোর্স।',
    medicines: [
      {
        brand_name: 'Napryn',
        generic_name: 'Naproxen',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'খাবারের পর সেব্য প্রদাহ কমাতে।' },
      },
      {
        brand_name: 'Pantobex',
        generic_name: 'Pantoprazole',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '30 Days', special_instructions: 'খালি পেটে সেব্য।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন সকালে নিয়ম করে ৩০ মিনিট ব্যাক-স্ট্রেচিং ও সাঁতার কাটুন।',
      'ধূমপান সম্পূর্ণ পরিহার করুন (ধূমপান মেরুদণ্ড দ্রুত জমার প্রধান কারণ)।',
    ],
  },
  {
    id: 'fibromyalgia-widespread-pain',
    title: 'Fibromyalgia / Chronic Widespread Pain Syndrome',
    titleBn: 'ফাইব্রোমায়ালজিয়া (সারা শরীরে মাংসপেশির ক্রনিক ব্যথা ও ক্লান্তি)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['fibromyalgia', 'সারা শরীর ব্যথা', 'chronic muscle ache fatigue', 'tender points body'],
    description: 'Central sensitization relief with Duloxetine/Pregabalin, aerobic walking, sleep hygiene.',
    descriptionBn: 'স্নায়বিক ব্যথা নিরাময়ে ডুলোক্সেটিন, হালকা হাঁটা ও নিয়মিত ঘুম।',
    medicines: [
      {
        brand_name: 'Dulojoy',
        generic_name: 'Duloxetine',
        adult: { dosage_form: 'Cap', strength: '30 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '60 Days', special_instructions: 'সকালে নাস্তার পর ১টি।' },
      },
      {
        brand_name: 'Prebel',
        generic_name: 'Pregabalin',
        adult: { dosage_form: 'Cap', strength: '50 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'রাতে শোয়ার আগে।' },
      },
    ],
    adviceBn: [
      'হঠাৎ অতিরিক্ত ব্যায়াম না করে প্রতিদিন অল্প অল্প করে হাঁটার গতি বাড়ান।',
      'মানসিক চাপ কমান ও গভীর ঘুমের পরিবেশ নিশ্চিত করুন।',
    ],
  },
];
