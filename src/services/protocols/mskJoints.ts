import type { DiseaseProtocolTemplate } from './types';

export const MSK_JOINTS_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'knee-osteoarthritis-degenerative',
    title: 'Knee Osteoarthritis (Degenerative Joint Disease)',
    titleBn: 'হাঁটুর ক্ষয়রোগ ও বাত (অস্টিওআর্থ্রাইটিস)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['osteoarthritis', 'knee pain', 'হাঁটু ব্যথা', 'বাত', 'knee arthritis', 'crepitus knee'],
    description: 'Quadriceps strengthening, weight reduction, topical NSAID, and Diacerein/Glucosamine.',
    descriptionBn: 'হাঁটুর জয়েন্টের ক্ষয়রোধে ডায়াসেরিন, ওজন কমানো ও উরুর পেশীর ব্যায়াম।',
    medicines: [
      {
        brand_name: 'Cartilex',
        generic_name: 'Diacerein + Glucosamine Sulphate',
        adult: { dosage_form: 'Tab', strength: '50/750 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '60-90 Days', special_instructions: 'খাবারের পর সকাল ও রাতে সেব্য।' },
      },
      {
        brand_name: 'Voltalin Emulgel',
        generic_name: 'Diclofenac Diethylamine 1% Gel',
        adult: { dosage_form: 'Oint', strength: '1%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'হাঁটুর চারপাশে দিনে ২-৩ বার আলতো করে মেখে দিন।' },
      },
      {
        brand_name: 'Ace Plus',
        generic_name: 'Paracetamol + Caffeine',
        adult: { dosage_form: 'Tab', strength: '500/65 mg', schedule: '1+0+1 (SOS)', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'তীব্র হাঁটু ব্যথায় সেব্য।' },
      },
    ],
    adviceBn: [
      'নিচু হয়ে পিঁড়িতে বসা ও মেঝেতে আসন গেড়ে বসা বন্ধ করুন; হাই-কমোড ব্যবহার করুন।',
      'নামাজের সময় চেয়ারে বসে রুকু-সিজদা আদায় করুন।',
      'শরীরের বাড়তি ওজন কমান (১ কেজি ওজন কমলে হাঁটুতে ৪ কেজি চাপ কমে)।',
    ],
  },
  {
    id: 'plantar-fasciitis-heel-pain',
    title: 'Plantar Fasciitis (Morning Heel Pain / Calcaneal Spur)',
    titleBn: 'পায়ের গোড়ালি ব্যথা (সকালে মাটিতে পা ফেলতে তীব্র ব্যথা)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['plantar fasciitis', 'heel pain', 'গোড়ালি ব্যথা', 'calcaneal spur'],
    description: 'Silicon heel pad, frozen water bottle rolling stretch, and short NSAID.',
    descriptionBn: 'সিলিকন হিল প্যাড, বরফ বোতল রোলিং ও কাফ মাসল স্ট্রেচিং ব্যায়াম।',
    medicines: [
      {
        brand_name: 'Napryn Gel',
        generic_name: 'Naproxen Gel / Diclofenac Gel',
        adult: { dosage_form: 'Oint', strength: 'Standard', schedule: '1+0+1', meal_timing: 'Anytime', duration: '14 Days', special_instructions: 'গোড়ালির নিচে ও পেছনের অংশে মালিশ করুন।' },
      },
      {
        brand_name: 'Fast',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'ব্যথা বেশি হলে সেব্য।' },
      },
    ],
    adviceBn: [
      'জুতার ভেতরে নরম সিলিকন হিল কাপ (Silicon Heel Cushion) ব্যবহার করুন।',
      'ফ্রিজে জমানো পানির বোতলের ওপর পায়ের পাতা রেখে দিনে ২ বার ১০ মিনিট রোলিং করুন।',
      'কখনই খালি পায়ে শক্ত মেঝেতে হাঁটবেন না।',
    ],
  },
  {
    id: 'adhesive-capsulitis-frozen-shoulder',
    title: 'Adhesive Capsulitis (Frozen Shoulder / Stiff Shoulder)',
    titleBn: 'ফ্রোজেন শোল্ডার (কাঁধ শক্ত হয়ে যাওয়া ও হাত ওপরে তুলতে তীব্র ব্যথা)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['frozen shoulder', 'adhesive capsulitis', 'কাঁধ ব্যথা', 'stiff shoulder pain'],
    description: 'Pendulum exercise, finger ladder climbing, NSAID and intra-articular steroid if early.',
    descriptionBn: 'পেন্ডুলাম এক্সারসাইজ, আঙুল দিয়ে দেওয়ালে ওঠা ব্যায়াম ও ব্যথানাশক।',
    medicines: [
      {
        brand_name: 'Aceclofenac',
        generic_name: 'Aceclofenac',
        adult: { dosage_form: 'Tab', strength: '100 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '10 Days', special_instructions: 'ভরা পেটে সেব্য।' },
      },
      {
        brand_name: 'Maxpro',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '10 Days', special_instructions: 'খালি পেটে সেব্য।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন দেওয়ালে আঙুল বেয়ে হাত ওপরে তোলার ব্যায়াম (Finger ladder) দিনে ৩ বার করুন।',
      'সামনে ঝুঁকে হাতটি দোলকের মতো ঘোরানোর (Pendulum exercise) অভ্যাস করুন।',
      'ডায়াবেটিস থাকলে কঠোর নিয়ন্ত্রণে রাখুন (ডায়াবেটিস রোগীদের কাঁধ দ্রুত জমে যায়)।',
    ],
  },
  {
    id: 'lateral-epicondylitis-tennis-elbow',
    title: 'Lateral Epicondylitis (Tennis Elbow)',
    titleBn: 'টেনিস এলবো (কনুইয়ের বাইরের অংশে তীব্র ব্যথা)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['tennis elbow', 'lateral epicondylitis', 'কনুই ব্যথা', 'elbow pain gripping'],
    description: 'Counterforce forearm brace, eccentric extensor tendon stretching and topical NSAID.',
    descriptionBn: 'কনুইয়ের ফোরআর্ম ব্রেস ব্যবহার, ভারী বস্তু না তোলা ও ব্যথানাশক জেল।',
    medicines: [
      {
        brand_name: 'Voltalin Emulgel',
        generic_name: 'Diclofenac Diethylamine Gel',
        adult: { dosage_form: 'Oint', strength: '1%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '14 Days', special_instructions: 'কনুইয়ের বাইরের ব্যথার স্থানে মেখে দিন।' },
      },
    ],
    adviceBn: [
      'কনুইয়ের নিচে কাউন্টার-ফোর্স টেনিস এলবো স্ট্র্যাপ পরে কাজ করুন।',
      'ভারী শপিং ব্যাগ এক হাতে বহন করা বা কাপড় মোচড়ানো সম্পূর্ণ পরিহার করুন।',
    ],
  },
  {
    id: 'carpal-tunnel-syndrome',
    title: 'Carpal Tunnel Syndrome (Median Nerve Entrapment)',
    titleBn: 'কার্পাল টানেল সিন্ড্রোম (হাতের তালু ও আঙুলে অবশ ভাব বা ঝিঁঝি ধরা)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['carpal tunnel', 'cts', 'হাতে ঝিঁঝি ধরা', 'median nerve wrist pain'],
    description: 'Neutral wrist splint overnight, methylcobalamin and ergonomic typing position.',
    descriptionBn: 'রাতে কব্জিতে স্প্লিন্ট পরিধান ও স্নায়ু সুরক্ষা ওষুধ।',
    medicines: [
      {
        brand_name: 'Recon',
        generic_name: 'Pregabalin',
        adult: { dosage_form: 'Cap', strength: '50 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'রাতে শোয়ার আগে ১টি।' },
      },
      {
        brand_name: 'Mecolin',
        generic_name: 'Methylcobalamin',
        adult: { dosage_form: 'Tab', strength: '500 mcg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'সকাল ও রাতে খাবারের পর।' },
      },
    ],
    adviceBn: [
      'রাতে ঘুমানোর সময় নিউট্রাল রিস্ট স্প্লিন্ট (Wrist Splint) পরে ঘুমান।',
      'কম্পিউটারে টাইপ করার সময় কব্জি বেশি বাঁকা না করে সোজা রাখুন।',
    ],
  },
  {
    id: 'ankle-sprain-acute-rice',
    title: 'Acute Ankle Sprain / Inversion Injury',
    titleBn: 'পায়ের গোড়ালি মচকানো (হঠাৎ গোড়ালি ফুলে তীব্র ব্যথা)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['ankle sprain', 'twisted ankle', 'পা মচকানো', 'swollen ankle injury'],
    description: 'RICE protocol: Rest, Ice, Compression with crepe bandage, Elevation + short NSAID.',
    descriptionBn: 'রাইস (RICE) পদ্ধতি: বিশ্রাম, বরফ সেঁক, ক্রেপ ব্যান্ডেজ ও পা উঁচুতে রাখা।',
    medicines: [
      {
        brand_name: 'Napryn',
        generic_name: 'Naproxen',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'ভরা পেটে সেব্য।' },
      },
      {
        brand_name: 'Sergel',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '5 Days', special_instructions: 'ব্যথানাশক চলাকালীন গ্যাস্ট্রিকের সুরক্ষায় খালি পেটে সেব্য।' },
      },
      {
        brand_name: 'Fast',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'ব্যথায় সেব্য।' },
      },
    ],
    adviceBn: [
      'প্রথম ৪৮ ঘণ্টা কোনো অবস্থাতেই গরম সেঁক বা মালিশ করবেন না; বরফ সেঁক দিন প্রতি ২-৩ ঘণ্টা পর পর ১৫ মিনিট।',
      'ইলাস্টিক ক্রেপ ব্যান্ডেজ দিয়ে মাঝারি চাপে গোড়ালি বেঁধে রাখুন ও শোয়ার সময় পা বালিশের ওপর উঁচুতে রাখুন।',
    ],
  },
  {
    id: 'rheumatoid-arthritis-initial',
    title: 'Rheumatoid Arthritis (Symmetric Small Joint Polyarthritis)',
    titleBn: 'রিউমাটয়েড আর্থ্রাইটিস (হাতের আঙুলের ছোট ছোট গিঁটে ব্যথা ও সকালে শক্ত হওয়া)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['rheumatoid arthritis', 'ra', 'রিউমাটয়েড বাত', 'joint stiffness morning fingers'],
    description: 'Low-dose bridge steroid, DMARD (Methotrexate/Hydroxychloroquine) rheumatologist referral.',
    descriptionBn: 'হাইড্রোঅক্সিক্লোরোকুইন থেরাপি ও জয়েন্টের বিকৃতি প্রতিরোধ।',
    medicines: [
      {
        brand_name: 'Plaquex',
        generic_name: 'Hydroxychloroquine Sulphate',
        adult: { dosage_form: 'Tab', strength: '200 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '90 Days', special_instructions: 'দুপুরে খাবারের পর ১টি।' },
      },
      {
        brand_name: 'Napryn',
        generic_name: 'Naproxen',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'ভরা পেটে সেব্য।' },
      },
      {
        brand_name: 'Sergel',
        generic_name: 'Esomeprazole',
        adult: { dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'খালি পেটে নিয়মিত গ্যাস্ট্রিক প্রতিরোধে।' },
      },
    ],
    adviceBn: [
      'সকালে কুসুম গরম পানিতে হাত-পা ৫ মিনিট ডুবিয়ে রেখে আঙুল নাড়াচাড়ার হালকা ব্যায়াম করুন।',
      'প্রতি ৬ মাস অন্তর চোখের রেটিনা পরীক্ষা করান।',
    ],
  },
  {
    id: 'trigger-finger-tenosynovitis',
    title: 'Trigger Finger / Stenosing Tenosynovitis (Locked Finger)',
    titleBn: 'ট্রিগার ফিঙ্গার (হাতের আঙুল বাঁকা হয়ে আটকে যাওয়া)',
    category: 'Musculoskeletal & Joint',
    diagnosisMatch: ['trigger finger', 'locked finger', 'আঙুল আটকে যাওয়া', 'tenosynovitis'],
    description: 'Finger splinting, topical anti-inflammatory gel and local steroid injection if refractory.',
    descriptionBn: 'আঙুল সোজা রাখার স্প্লিন্ট ও ব্যথানাশক জেল প্রয়োগ।',
    medicines: [
      {
        brand_name: 'Voltalin Gel',
        generic_name: 'Diclofenac Diethylamine Gel',
        adult: { dosage_form: 'Oint', strength: '1%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '14 Days', special_instructions: 'আঙুলের গোড়ার ফোলার ওপর হালকা মেখে দিন।' },
      },
    ],
    adviceBn: [
      'আঙুল জোরে বারবার মুঠো করা থেকে বিরত থাকুন।',
      'রাতে ঘুমানোর সময় আঙুলটি অ্যালুমিনিয়াম স্প্লিন্ট দিয়ে সোজা রেখে ঘুমান।',
    ],
  },
];
