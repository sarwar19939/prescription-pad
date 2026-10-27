import type { DiseaseProtocolTemplate } from './types';

export const EYE_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'allergic-conjunctivitis',
    title: 'Allergic Conjunctivitis (Itchy Red Eyes & Rubbing)',
    titleBn: 'অ্যালার্জিক চোখ ওঠা ও চোখ চুলকানো',
    category: 'ENT & Eye',
    diagnosisMatch: ['allergic conjunctivitis', 'eye allergy', 'চোখ চুলকানি', 'itchy red eyes'],
    description: 'Dual-action mast cell stabilizer + antihistamine eye drops (Olopatadine).',
    descriptionBn: 'ওলোপ্যাটাডিন চোখের ড্রপ দিয়ে চোখের লালচে ভাব ও চুলকানি নিরাময়।',
    medicines: [
      {
        brand_name: 'Patadin Eye Drops',
        generic_name: 'Olopatadine 0.1% Eye Drops',
        adult: { dosage_form: 'Drop', strength: '0.1%', schedule: '1 drop BD', meal_timing: 'Anytime', duration: '14-30 Days', special_instructions: 'দুই চোখে ১ ফোঁটা করে দিনে ২ বার।' },
        pediatric: { dosage_form: 'Drop', strength: '0.1%', schedule: '1 drop BD', meal_timing: 'Anytime', duration: '14 Days', special_instructions: 'দুই চোখে ১ ফোঁটা করে।' },
      },
      {
        brand_name: 'Tears Natural',
        generic_name: 'Carboxymethylcellulose 0.5% Lubricant',
        adult: { dosage_form: 'Drop', strength: '0.5%', schedule: '1 drop QDS', meal_timing: 'Anytime', duration: 'Ongoing', special_instructions: 'চোখ ঠাণ্ডা রাখতে ড্রপ দিন।' },
      },
    ],
    adviceBn: [
      'চোখ কোনোভাবেই হাত বা কাপড় দিয়ে রগড়াবেন না (কর্নিয়ার মারাত্মক ক্ষতি হয়)।',
      'চোখে ঠাণ্ডা পানির ঝাঁপটা দিন বা ঠাণ্ডা কাপড়ের সেঁক দিন।',
    ],
  },
  {
    id: 'bacterial-conjunctivitis-pink-eye',
    title: 'Acute Bacterial Conjunctivitis (Sticky Yellow Pus Eyes)',
    titleBn: 'ব্যাকটেরিয়াল চোখ ওঠা (চোখে আঠালো হলুদ পিঁচুটি জমা)',
    category: 'ENT & Eye',
    diagnosisMatch: ['conjunctivitis', 'pink eye', 'চোখ ওঠা', 'purulent eye discharge', 'sticky eyes'],
    description: 'Broad-spectrum topical fluoroquinolone or aminoglycoside eye drops.',
    descriptionBn: 'মক্সিফ্লক্সাসিন বা টোব্রামাইসিন ড্রপ ও চোখ জীবাণুমুক্ত রাখার নিয়ম।',
    medicines: [
      {
        brand_name: 'Moxiflox Eye Drops',
        generic_name: 'Moxifloxacin 0.5% Eye Drops',
        adult: { dosage_form: 'Drop', strength: '0.5%', schedule: '1 drop TDS', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'আক্রান্ত চোখে ১ ফোঁটা করে দিনে ৩ বার।' },
        pediatric: { dosage_form: 'Drop', strength: '0.5%', schedule: '1 drop TDS', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'দিনে ৩ বার ১ ফোঁটা।' },
      },
    ],
    adviceBn: [
      'রোগীর ব্যবহৃত তোয়ালে, বালিশের চাদর বা হাত অন্য কেউ স্পর্শ করবেন না (সংক্রামক রোগ)।',
      'জীবাণুমুক্ত তুলা ও কুসুম গরম পানি দিয়ে চোখের পিঁচুটি পরিষ্কার করুন।',
      'চিকিৎসা চলাকালীন কন্ট্যাক্ট লেন্স ব্যবহার সম্পূর্ণ নিষিদ্ধ।',
    ],
  },
  {
    id: 'dry-eye-computer-vision',
    title: 'Dry Eye Disease / Computer Vision Syndrome',
    titleBn: 'ড্রাই আই / চোখের শুষ্কতা (কম্পিউটার স্ক্রিনের কারণে চোখে জ্বালাপোড়া)',
    category: 'ENT & Eye',
    diagnosisMatch: ['dry eye', 'computer vision', 'চোখ জ্বালাপোড়া', 'burning gritty eyes', 'eye strain'],
    description: 'Preservative-free artificial tears and the 20-20-20 screen break rule.',
    descriptionBn: 'কৃত্রিম চোখের পানি (লুব্রিকেন্ট) ও স্ক্রিন বিরতির ২০-২০-২০ নিয়ম।',
    medicines: [
      {
        brand_name: 'Teargel / Optive',
        generic_name: 'Carboxymethylcellulose + Glycerin Eye Drops',
        adult: { dosage_form: 'Drop', strength: '0.5%', schedule: '1 drop 4-6 times daily', meal_timing: 'Anytime', duration: 'Ongoing', special_instructions: 'চোখে শুষ্কতা বা খচখচ অনুভূত হলে প্রতিবার ১ ফোঁটা।' },
      },
    ],
    adviceBn: [
      'প্রতি ২০ মিনিট স্ক্রিনে তাকানোর পর ২০ ফুট দূরের কোনো বস্তুর দিকে ২০ সেকেন্ড তাকিয়ে থাকুন (২০-২০-২০ নিয়ম)।',
      'স্ক্রিনে কাজ করার সময় ঘন ঘন চোখের পলক ফেলুন।',
    ],
  },
  {
    id: 'hordeolum-stye-eyelid',
    title: 'Acute Internal/External Hordeolum (Eyelid Stye)',
    titleBn: 'অঞ্জনি / চোখের পাতায় ফোড়া (স্টাই বা হরডিওলাম)',
    category: 'ENT & Eye',
    diagnosisMatch: ['stye', 'hordeolum', 'অঞ্জনি', 'eyelid boil', 'painful eyelid bump'],
    description: 'Frequent warm compresses with topical antibiotic ointment.',
    descriptionBn: 'ঘন ঘন গরম ভাপ এবং অ্যান্টিবায়োটিক চোখের মলম।',
    medicines: [
      {
        brand_name: 'Tobracin Eye Ointment',
        generic_name: 'Tobramycin 0.3% Eye Ointment',
        adult: { dosage_form: 'Oint', strength: '0.3%', schedule: 'Apply inside eyelid at night', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'রাতে ঘুমানোর সময় চোখের পাতার ভেতরে সামান্য মেখে দিন।' },
      },
      {
        brand_name: 'Napa',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'চোখের পাতার ব্যথায় সেব্য।' },
      },
    ],
    adviceBn: [
      'দিনে ৪-৫ বার পরিষ্কার কাপড়ে গরম পানির ভাপ ১০ মিনিট করে অঞ্জনির ওপর দিন (পুঁজ গলে বের হয়ে যাবে)।',
      'অঞ্জনি হাত দিয়ে খুঁটবেন না বা ফাটানোর চেষ্টা করবেন না।',
    ],
  },
  {
    id: 'subconjunctival-hemorrhage',
    title: 'Subconjunctival Hemorrhage (Blood Patch in Eye)',
    titleBn: 'চোখের সাদা অংশে রক্ত জমা (সাবকনজাঙ্কটাইভাল হেমোরেজ)',
    category: 'ENT & Eye',
    diagnosisMatch: ['subconjunctival hemorrhage', 'blood in eye', 'চোখে রক্ত জমা', 'red patch in white of eye'],
    description: 'Reassurance of benign spontaneous resolution within 2 weeks, lubricating drops, blood pressure check.',
    descriptionBn: 'আতঙ্ক নিরসন, রক্তচাপ পরীক্ষা ও ২ সপ্তাহের মধ্যে স্বাভাবিকভাবে রক্ত মিলিয়ে যাওয়া।',
    medicines: [
      {
        brand_name: 'Tears Natural',
        generic_name: 'Carboxymethylcellulose Eye Drops',
        adult: { dosage_form: 'Drop', strength: '0.5%', schedule: '1 drop TDS', meal_timing: 'Anytime', duration: '14 Days', special_instructions: 'চোখের আরাম ও আর্দ্রতায় ১ ফোঁটা করে।' },
      },
    ],
    adviceBn: [
      'এটি একটি মৃদু রক্তনালী ফাটার কারণে হয় যা কোনো দৃষ্টিশক্তির ক্ষতি ছাড়া ২ সপ্তাহের মধ্যে নিজ থেকেই ঠিক হয়ে যায়।',
      'অবশ্যই ব্লাড প্রেশার (রক্তচাপ) মেপে দেখুন নিয়ন্ত্রণে আছে কি না।',
    ],
  },
  {
    id: 'blepharitis-eyelid-crust',
    title: 'Chronic Blepharitis (Eyelid Margin Crust & Flaking)',
    titleBn: 'চোখের পাতার খুশকি ও প্রদাহ (ব্লেফারাইটিস)',
    category: 'ENT & Eye',
    diagnosisMatch: ['blepharitis', 'eyelid crusting', 'চোখের পাতায় ময়লা', 'eyelash dandruff'],
    description: 'Eyelid hygiene with diluted baby shampoo, warm compress and erythromycin ointment.',
    descriptionBn: 'বেবি শ্যাম্পু দিয়ে চোখের পাতা পরিষ্কার ও উষ্ণ সেঁক।',
    medicines: [
      {
        brand_name: 'E-Mycin Eye Ointment',
        generic_name: 'Erythromycin Eye Ointment',
        adult: { dosage_form: 'Oint', strength: '0.5%', schedule: 'Apply at night', meal_timing: 'Anytime', duration: '14 Days', special_instructions: 'রাতে শোয়ার আগে চোখের পাতার কিনারায় পাতলা করে লাগিয়ে দিন।' },
      },
    ],
    adviceBn: [
      'কুসুম গরম পানিতে তুলসি বা বেবি শ্যাম্পুর ১ ফোঁটা মিশিয়ে কটন বাড দিয়ে পাতার কিনারা পরিষ্কার করুন।',
      'চোখের মেকআপ বা কাজল ব্যবহার পরিহার করুন।',
    ],
  },
  {
    id: 'corneal-irritation-foreign-body',
    title: 'Superficial Eye Irritation / Dust Scratch',
    titleBn: 'চোখে ধুলাবালি বা খোঁচা লাগা (কর্নিয়াল অস্বস্তি)',
    category: 'ENT & Eye',
    diagnosisMatch: ['eye dust', 'foreign body sensation eye', 'চোখে খোঁচা লাগা', 'cornea scratch'],
    description: 'Prophylactic topical antibiotic drops to prevent bacterial keratitis + lubrication.',
    descriptionBn: 'ইনফেকশন প্রতিরোধে মক্সিফ্লক্সাসিন ড্রপ ও চোখ রগড়ানো নিষেধ।',
    medicines: [
      {
        brand_name: 'Moxiflox',
        generic_name: 'Moxifloxacin Eye Drops',
        adult: { dosage_form: 'Drop', strength: '0.5%', schedule: '1 drop TDS', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'চোখে ১ ফোঁটা দিনে ৩ বার।' },
      },
    ],
    adviceBn: [
      'চোখ কোনোভাবেই ঘষবেন না (এতে কর্নিয়া ছিঁড়ে যেতে পারে)।',
      'প্রচুর পরিষ্কার পানি দিয়ে চোখ ধুয়ে নিন এবং অস্বস্তি না কমলে চক্ষু বিশেষজ্ঞকে দেখান।',
    ],
  },
];
