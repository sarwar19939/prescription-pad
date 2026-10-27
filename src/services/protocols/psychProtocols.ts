import type { DiseaseProtocolTemplate } from './types';

export const PSYCH_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'generalized-anxiety-disorder-gad',
    title: 'Generalized Anxiety Disorder (GAD / Restlessness)',
    titleBn: 'অ্যাংজাইটি ও অতিরিক্ত দুশ্চিন্তা (জিএডি / বুক ধড়ফড় ও অস্থিরতা)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['anxiety', 'gad', 'দুশ্চিন্তা', 'panic', 'restlessness palpitations', 'মানসিক চাপ'],
    description: 'First-line SSRI (Escitalopram) with short-term benzodiazepine bridge (Clonazepam).',
    descriptionBn: 'এসএসআরআই এসসিটালোপ্রাম ও স্বল্পমেয়াদী ক্লোনাজিপাম দিয়ে অস্থিরতা নিবারণ।',
    medicines: [
      {
        brand_name: 'Sedil / Disopan',
        generic_name: 'Clonazepam',
        adult: { dosage_form: 'Tab', strength: '0.5 mg', schedule: '0+0+1/2', meal_timing: 'After Meal', duration: '14 Days then stop', special_instructions: 'রাতের বেলা শোবার পূর্বে অর্ধেক বড়ি (০.২৫ মিগ্রা)। ২ সপ্তাহের বেশি খাবেন না।' },
      },
      {
        brand_name: 'Lexotan / Ciraset',
        generic_name: 'Escitalopram',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '3-6 Months', special_instructions: 'রাতে খাবারের পর ১টি। ৩-৪ সপ্তাহ পর পুরো কার্যকারিতা প্রকাশ পায়।' },
      },
    ],
    adviceBn: [
      'প্রতিদিন সকাল-সন্ধ্যায় ডিপ ব্রিদিং (গভীর শ্বাস নেওয়া ও ধীরে ছাড়া) ও মেডিটেশন করুন।',
      'চা, কফি, সিগারেট সম্পূর্ণ পরিহার করুন (এগুলো হৃৎস্পন্দন ও দুশ্চিন্তা বাড়ায়)।',
      'ওষুধ ভালো লাগলেও ডাক্তারের পরামর্শ ছাড়া হঠাৎ বন্ধ করবেন না।',
    ],
  },
  {
    id: 'panic-disorder-acute-anxiety',
    title: 'Panic Disorder / Agoraphobia (Sudden Fear of Dying)',
    titleBn: 'প্যানিক অ্যাটাক (হঠাৎ দম বন্ধ হওয়া, মারা যাওয়ার ভয় ও তীব্র বুক ধড়ফড়)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['panic attack', 'panic disorder', 'প্যানিক অ্যাটাক', 'sudden extreme fear dying'],
    description: 'Acute panic reassurance, diaphragmatic slow breathing and maintenance SSRI therapy.',
    descriptionBn: 'দম বন্ধ হওয়া ভীতি দূরীকরণ, বেলি ব্রিদিং ব্যায়াম ও দীর্ঘমেয়াদী সুরক্ষা।',
    medicines: [
      {
        brand_name: 'Ciraset',
        generic_name: 'Escitalopram',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '6 Months', special_instructions: 'রাতে শোয়ার আগে নিয়মিত সেব্য।' },
      },
      {
        brand_name: 'Rivotril',
        generic_name: 'Clonazepam',
        adult: { dosage_form: 'Tab', strength: '0.5 mg', schedule: '1 tab SOS during attack', meal_timing: 'Anytime', duration: 'SOS', special_instructions: 'তীব্র প্যানিক অ্যাটাক শুরু হলে জিহ্বার নিচে দিয়ে মুখে গলিয়ে নিন।' },
      },
    ],
    adviceBn: [
      'প্যানিক অ্যাটাকে কেউ মারা যায় না এবং এটি হার্ট অ্যাটাক নয়—নিজেকে এই বার্তাটি বারবার দিন।',
      'কাগজের ব্যাগে বা দুই হাতের তালু মুখে চেপে ধীরে ধীরে শ্বাস নিন (Hyperventilation বন্ধ করতে)।',
    ],
  },
  {
    id: 'major-depressive-disorder-mild-moderate',
    title: 'Major Depressive Disorder (Mild to Moderate)',
    titleBn: 'ডিপ্রেশন ও বিষণ্ণতা (কোনো কাজে আনন্দ না পাওয়া ও সার্বক্ষণিক মন খারাপ)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['depression', 'বিষণ্ণতা', 'depressive disorder', 'low mood lack of energy'],
    description: 'Evidence-based SSRI therapy (Sertraline / Escitalopram) + behavioral activation counseling.',
    descriptionBn: 'সারট্রালিন থেরাপি দিয়ে মানসিক শক্তি ও কাজের উৎসাহ ফিরিয়ে আনা।',
    medicines: [
      {
        brand_name: 'Serlift',
        generic_name: 'Sertraline Hydrochloride',
        adult: { dosage_form: 'Tab', strength: '50 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '6 Months', special_instructions: 'সকালে নাস্তার পর ১টি।' },
      },
    ],
    adviceBn: [
      'ঘরের দরজা বন্ধ করে একা বসে থাকবেন না, প্রতিদিন বন্ধু ও পরিবারের সাথে কথা বলুন।',
      'প্রতিদিন অন্তত ৩০ মিনিট সূর্যের আলোতে হাঁটাহাঁটি করুন।',
      'ওষুধের ফল পেতে ২ থেকে ৩ সপ্তাহ নিয়মিত সেবন করা জরুরি।',
    ],
  },
  {
    id: 'primary-insomnia-sleep-hygiene',
    title: 'Primary Insomnia (Difficulty Falling / Staying Asleep)',
    titleBn: 'অনিদ্রা ও ঘুমের সমস্যা (ইনসোমনিয়া ও রাতে ঘুম না আসা)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['insomnia', 'অনিদ্রা', 'sleeplessness', 'ঘুম না হওয়া', 'poor sleep'],
    description: 'Cognitive Behavioral Therapy for Insomnia (CBT-I) sleep hygiene + short-term Melatonin.',
    descriptionBn: 'ঘুমের স্বাস্থ্যবিধি মেনে চলা ও নিরাপদ মেলাটোনিন থেরাপি।',
    medicines: [
      {
        brand_name: 'Melat',
        generic_name: 'Melatonin',
        adult: { dosage_form: 'Tab', strength: '3 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '14-30 Days', special_instructions: 'ঘুমানোর ৩০ মিনিট পূর্বে ১টি।' },
      },
    ],
    adviceBn: [
      'ঘুমানোর অন্তত ১ ঘণ্টা আগে মোবাইল, টিভি বা ল্যাপটপের পর্দা দেখা বন্ধ করুন।',
      'বিকেল ৪টার পর চা, কফি বা ধূমপান করবেন না।',
      'বিছানায় যাওয়ার পর ২০ মিনিটে ঘুম না আসলে বিছানা ছেড়ে মৃদু আলোতে বই পড়ুন।',
    ],
  },
  {
    id: 'essential-tremor-action',
    title: 'Benign Essential Tremor (Hand Shaking on Action)',
    titleBn: 'হাতের কাঁপুনি (এসেনশিয়াল ট্রেমর / কিছু ধরতে গেলে হাত কাঁপা)',
    category: 'Neurology & Psychiatry',
    diagnosisMatch: ['essential tremor', 'hand tremor', 'হাত কাঁপা', 'shaky hands'],
    description: 'Beta-blocker (Propranolol) or Primidone to dampen kinetic action tremors.',
    descriptionBn: 'প্রোপ্রানোলল দিয়ে হাতের পেশির সূক্ষ্ম কাঁপুনি নিয়ন্ত্রণ।',
    medicines: [
      {
        brand_name: 'Indever',
        generic_name: 'Propranolol',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '30-60 Days', special_instructions: 'সকাল ও রাতে খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'ক্যাফেইন (চা, কফি, সফট ড্রিংকস) সম্পূর্ণ এড়িয়ে চলুন।',
      'ভারী হাতলযুক্ত চামচ ও কলম ব্যবহার করলে লিখতে সুবিধা হয়।',
    ],
  },
];
