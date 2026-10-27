import type { DiseaseProtocolTemplate } from './types';

export const ENT_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'acute-otitis-media',
    title: 'Acute Otitis Media (Middle Ear Infection & Earache)',
    titleBn: 'কানের তীব্র ইনফেকশন ও কান ব্যথা (অটাইটিস মিডিয়া)',
    category: 'ENT & Eye',
    diagnosisMatch: ['otitis media', 'ear infection', 'কান ব্যথা', 'earache', 'aom'],
    description: 'High-dose oral amoxicillin-clavulanate with analgesic pain control.',
    descriptionBn: 'কান ব্যথায় প্যারাসিটামল ও ব্যাকটিরিয়াল সংক্রমণে উপযুক্ত অ্যান্টিবায়োটিক।',
    medicines: [
      {
        brand_name: 'Moxaclav',
        generic_name: 'Amoxicillin + Clavulanic Acid',
        adult: { dosage_form: 'Tab', strength: '625 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '7-10 Days', special_instructions: 'খাবারের শুরুতে ১টি।' },
        pediatric: { dosage_form: 'Syr', strength: '156.25 mg/5 ml', schedule: '1+0+1', meal_timing: 'With Meal', duration: '7-10 Days', special_instructions: 'খাবারের শুরুতে পরিমাপ অনুযায়ী।' },
      },
      {
        brand_name: 'Fast',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '3-5 Days', special_instructions: 'কান ব্যথায় নিয়মিত সেব্য।' },
        pediatric: { dosage_form: 'Syr', strength: '120 mg/5 ml', schedule: '1+1+1', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'ব্যথা উপশমে।' },
      },
    ],
    adviceBn: [
      'কানের ভেতরে কোনো কাঠি, তেল, পাতার রস বা হাইড্রোজেন পারক্সাইড দেবেন না।',
      'গোসল করার সময় কানে যেন কোনোভাবেই পানি না ঢোকে (তুলায় সামান্য ভ্যাসলিন লাগিয়ে কানে দিন)।',
    ],
  },
  {
    id: 'acute-otitis-externa-swimmer',
    title: 'Acute Otitis Externa (Swimmer\'s Ear / Ear Canal Pain)',
    titleBn: 'বহিঃকর্ণের প্রদাহ (সুইমার্স ইয়ার / কানে আঙুল দেওয়া বা খোঁচানোর ব্যথা)',
    category: 'ENT & Eye',
    diagnosisMatch: ['otitis externa', 'swimmers ear', 'কানের নালী ফোলা ব্যথা', 'ear canal pain on pulling pinna'],
    description: 'Topical ciprofloxacin + dexamethasone ear drops and keeping the ear dry.',
    descriptionBn: 'সিপ্রোফ্লক্সাসিন ড্রপ এবং কান সম্পূর্ণ শুষ্ক রাখার নির্দেশিকা।',
    medicines: [
      {
        brand_name: 'Ciprocin-D Ear Drop',
        generic_name: 'Ciprofloxacin 0.3% + Dexamethasone 0.1%',
        adult: { dosage_form: 'Drop', strength: 'Standard', schedule: '3 drops BD', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'আক্রান্ত কানে ৩ ফোঁটা দিয়ে ৫ মিনিট শুয়ে থাকুন।' },
      },
    ],
    adviceBn: [
      'কান চুলকাতে কটন বাড বা ধাতব ক্লিপ ব্যবহার করবেন না (ইনফেকশন আরও ভেতরে ছড়িয়ে পড়ে)।',
      'সাঁতার কাটা বন্ধ রাখুন এবং গোসলের সময় কান শুকনো রাখুন।',
    ],
  },
  {
    id: 'otomycosis-fungal-ear',
    title: 'Otomycosis (Fungal Ear Infection with Severe Itching)',
    titleBn: 'কানে ছত্রাক বা ফাঙ্গাস ইনফেকশন (অটোমাইকোসিস ও তীব্র চুলকানি)',
    category: 'ENT & Eye',
    diagnosisMatch: ['otomycosis', 'ear fungal', 'কানে চুলকানি', 'ear fungus'],
    description: 'Aural toilet / ear canal cleansing and topical clotrimazole antifungal drops.',
    descriptionBn: 'কান পরিষ্কার ও ক্লোট্রিমাজোল ফাঙ্গাল ড্রপ প্রয়োগ।',
    medicines: [
      {
        brand_name: 'Candid Ear Drops',
        generic_name: 'Clotrimazole 1% Ear Drops',
        adult: { dosage_form: 'Drop', strength: '1%', schedule: '4 drops TDS', meal_timing: 'Anytime', duration: '14 Days', special_instructions: 'কানে ৪ ফোঁটা দিয়ে মাথা কাত করে রাখুন।' },
      },
    ],
    adviceBn: [
      'কখনই ভেজা অবস্থায় কান বন্ধ রাখবেন না, ফ্যান বা হেয়ার ড্রায়ারের বাতাসে দূর থেকে শুকান।',
      'কোনো অ্যান্টিবায়োটিক বা স্টেরয়েড ড্রপ দেবেন না (ছত্রাক আরও দ্রুত বাড়ে)।',
    ],
  },
  {
    id: 'impacted-cerumen-ear-wax',
    title: 'Impacted Cerumen (Hard Ear Wax & Hearing Loss)',
    titleBn: 'কানে শক্ত খইল জমা ও কানে কম শোনা',
    category: 'ENT & Eye',
    diagnosisMatch: ['ear wax', 'impacted cerumen', 'কানের খইল', 'ear blockage', 'wax in ear'],
    description: 'Cerumenolytic softening drops for 5-7 days prior to gentle syringing.',
    descriptionBn: 'খইল গলানোর ড্রপ ব্যবহার করে কান নিরাপদে পরিষ্কার করা।',
    medicines: [
      {
        brand_name: 'Soluwax / Waxsol',
        generic_name: 'Docusate Sodium / Hydrogen Peroxide Drops',
        adult: { dosage_form: 'Drop', strength: 'Standard', schedule: '3-4 drops at night', meal_timing: 'Anytime', duration: '5-7 Days', special_instructions: 'রাতে ঘুমানোর আগে কানে ৪ ফোঁটা দিয়ে তুলা গুঁজে রাখুন খইল নরম হওয়ার জন্য।' },
      },
    ],
    adviceBn: [
      'কটন বাড দিয়ে খইল বের করার চেষ্টা করবেন না (খইল আরও কানের পর্দার কাছে আটকে যায়)।',
      '৫-৭ দিন ড্রপ দেওয়ার পর নরম হলে ডাক্তারের কাছে গিয়ে সিরিঞ্জিং করিয়ে নিন।',
    ],
  },
  {
    id: 'aphthous-stomatitis-canker-sores',
    title: 'Recurrent Aphthous Stomatitis (Mouth Ulcers)',
    titleBn: 'মুখের ঘা / ক্ষত (অ্যাফথাস আলসার ও খাবার খেতে জ্বালাপোড়া)',
    category: 'ENT & Eye',
    diagnosisMatch: ['aphthous', 'mouth ulcer', 'মুখের ঘা', 'canker sore', 'tongue ulcer'],
    description: 'Topical triamcinolone acetonide dental paste and antiseptic mouthwash.',
    descriptionBn: 'ট্রায়ামসিনোলোন ডেন্টাল পেস্ট দিয়ে দ্রুত ক্ষত নিরাময় ও ভিটামিন থেরাপি।',
    medicines: [
      {
        brand_name: 'Kenalog in Orabase',
        generic_name: 'Triamcinolone Acetonide 0.1% Dental Paste',
        adult: { dosage_form: 'Oint', strength: '0.1%', schedule: 'Apply TDS after meals', meal_timing: 'Anytime', duration: '5-7 Days', special_instructions: 'খাবার শেষে মুখ কুলকুচি করে আঙুল দিয়ে ঘায়ের ওপর পেস্টের মতো প্রলেপ দিন (ঘষবেন না)।' },
      },
      {
        brand_name: 'Becovit / B-50',
        generic_name: 'Vitamin B-Complex + Zinc',
        adult: { dosage_form: 'Tab', strength: 'Standard', schedule: '1+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'সকাল ও রাতে খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'অতিরিক্ত গরম, ঝাল ও টক খাবার ক্ষত ভালো না হওয়া পর্যন্ত পরিহার করুন।',
      'পর্যাপ্ত পানি পান করুন ও দাঁত মাজার সময় নরম টুথব্রাশ ব্যবহার করুন।',
    ],
  },
  {
    id: 'epistaxis-anterior-nosebleed',
    title: 'Anterior Epistaxis (Nosebleed First Aid Protocol)',
    titleBn: 'নাক দিয়ে রক্ত পড়া (এপিস্ট্যাক্সিস প্রাথমিক চিকিৎসা)',
    category: 'ENT & Eye',
    diagnosisMatch: ['epistaxis', 'nosebleed', 'নাক দিয়ে রক্ত পড়া', 'bleeding from nose'],
    description: 'Trotter\'s method: lean forward, pinch soft anterior nose for 10-15 mins + oxymetazoline.',
    descriptionBn: 'সামনে ঝুঁকে নাকের নরম অংশ ১০-১৫ মিনিট চেপে ধরা ও রক্ত বন্ধের স্প্রে।',
    medicines: [
      {
        brand_name: 'Afrin Nasal Spray',
        generic_name: 'Oxymetazoline 0.05% Nasal Spray',
        adult: { dosage_form: 'Drop', strength: '0.05%', schedule: '2 sprays SOS', meal_timing: 'Anytime', duration: 'SOS', special_instructions: 'তুলায় স্প্রে মাখিয়ে রক্ত পড়া নাকে আলতো করে গুঁজে রাখুন।' },
      },
      {
        brand_name: 'Traxyl',
        generic_name: 'Tranexamic Acid',
        adult: { dosage_form: 'Cap', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'রক্ত পড়া বন্ধে সেব্য।' },
      },
    ],
    adviceBn: [
      'কখনই মাথা পেছনের দিকে হেলিয়ে দেবেন না (রক্ত পেটে বা ফুসফুসে চলে যায়); মাথা সামনে ঝুঁকিয়ে মুখ দিয়ে শ্বাস নিন।',
      'আঙুল দিয়ে নাকের দুই পাশের নরম অংশ শক্ত করে একটানা ১০ মিনিট চেপে ধরে রাখুন।',
      'কপালে ও নাকের ওপর বরফ সেঁক দিন এবং রক্তচাপ মেপে দেখুন।',
    ],
  },
  {
    id: 'tinnitus-vertigo-meniere',
    title: 'Tinnitus & Vestibular Vertigo (Inner Ear Blood Flow)',
    titleBn: 'কানে ভোঁ-ভোঁ শব্দ ও মাথা ঘোরা (টিনিটাস ও ভার্টিগো)',
    category: 'ENT & Eye',
    diagnosisMatch: ['tinnitus', 'ear ringing', 'কানে শব্দ', 'vertigo inner ear'],
    description: 'Betahistine inner ear microcirculation improvement and sound therapy.',
    descriptionBn: 'অন্তঃকর্ণের রক্ত চলাচল স্বাভাবিক করতে বেটাহিস্টিন থেরাপি।',
    medicines: [
      {
        brand_name: 'Vertina',
        generic_name: 'Betahistine Dihydrochloride',
        adult: { dosage_form: 'Tab', strength: '16 mg', schedule: '1+0+1', meal_timing: 'With Meal', duration: '30-60 Days', special_instructions: 'খাবারের সাথে সকাল ও রাতে ১টি।' },
      },
    ],
    adviceBn: [
      'অতিরিক্ত লবণ, কফি ও নিকোটিন কান ভোঁ-ভোঁ করার প্রবণতা বাড়ায়—বর্জন করুন।',
      'হঠাৎ ঘাড় বা মাথা ঝাঁকাবেন না।',
    ],
  },
];
