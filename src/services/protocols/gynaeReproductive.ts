import type { DiseaseProtocolTemplate } from './types';

export const GYNAE_REPRODUCTIVE_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'primary-dysmenorrhea',
    title: 'Primary Dysmenorrhea (Severe Menstrual Cramps)',
    titleBn: 'মাসিকের তীব্র তলপেট ব্যথা (ডিসমেনোরিয়া)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['dysmenorrhea', 'menstrual pain', 'মাসিকের ব্যথা', 'period cramps', 'pelvic cramps'],
    description: 'Prostaglandin-synthetase inhibitor NSAID (Mefenamic Acid / Naproxen) taken at bleed onset.',
    descriptionBn: 'মেফেনামিক এসিড বা ন্যাপ্রক্সেন ও তলপেটে গরম সেঁক।',
    medicines: [
      {
        brand_name: 'Dolfic',
        generic_name: 'Mefenamic Acid',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'মাসিক বা ব্যথা শুরু হওয়া মাত্রই ভরা পেটে সেব্য।' },
      },
      {
        brand_name: 'Alverin',
        generic_name: 'Alverine Citrate',
        adult: { dosage_form: 'Cap', strength: '60 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '3 Days', special_instructions: 'জরায়ুর পেশির সংকোচন শিথিল করতে।' },
      },
    ],
    adviceBn: [
      'তলপেটে হট ওয়াটার ব্যাগ দিয়ে হালকা গরম পানির সেঁক দিন।',
      'মাসিকের সময় হালকা হাঁটাহাঁটি বা স্ট্রেচিং করলে রক্ত চলাচল বাড়ে ও ব্যথা কমে।',
    ],
  },
  {
    id: 'menorrhagia-heavy-bleeding',
    title: 'Menorrhagia / Heavy Menstrual Bleeding (AUB-O)',
    titleBn: 'অতিরিক্ত রক্তক্ষরণযুক্ত মাসিক (মেনোরেজিয়া ও ক্লট পড়া)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['menorrhagia', 'heavy period', 'অতিরিক্ত রক্তস্রাব', 'heavy bleeding period', 'aub'],
    description: 'Antifibrinolytic Tranexamic Acid during heavy flow + oral progestin/NSAID.',
    descriptionBn: 'ট্র্যানেক্সামিক এসিড ক্যাপসুল দিয়ে রক্তক্ষরণ দ্রুত নিয়ন্ত্রণ ও আয়রন সাপ্লিমেন্ট।',
    medicines: [
      {
        brand_name: 'Traxyl',
        generic_name: 'Tranexamic Acid',
        adult: { dosage_form: 'Cap', strength: '500 mg', schedule: '2 caps TDS during heavy flow', meal_timing: 'After Meal', duration: '3-4 Days', special_instructions: 'অতিরিক্ত রক্তপাতের দিনগুলোতে ২ ক্যাপসুল করে দিনে ৩ বার ভরা পেটে।' },
      },
      {
        brand_name: 'Ferikid / Fefol-Z',
        generic_name: 'Iron + Folic Acid + Zinc',
        adult: { dosage_form: 'Cap', strength: 'Standard', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'রক্তস্বল্পতা রোধে রাতে ১টি।' },
      },
    ],
    adviceBn: [
      'ঘন ঘন প্যাড বদলাতে হলে বা বড় চাকা চাকা রক্তের ক্লট গেলে ডাক্তারের কাছে আল্ট্রাসনোগ্রাম করান।',
      'রক্তক্ষরণ কমে গেলে ট্র্যানেক্সামিক এসিড খাওয়া বন্ধ রাখুন।',
    ],
  },
  {
    id: 'hyperemesis-gravidarum-morning-sickness',
    title: 'Nausea & Vomiting of Pregnancy / Morning Sickness',
    titleBn: 'গর্ভকালীন বমি ও বমি বমি ভাব (মর্নিং সিকনেস)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['morning sickness', 'pregnancy vomiting', 'গর্ভবতীর বমি', 'hyperemesis', 'nausea pregnancy'],
    description: 'First-line Doxylamine + Pyridoxine (Vitamin B6) with frequent small carbohydrate snacks.',
    descriptionBn: 'ডক্সিলামাইন ও ভিটামিন বি৬ কম্বিনেশন দিয়ে নিরাপদ বমি নিয়ন্ত্রণ।',
    medicines: [
      {
        brand_name: 'Doxinate',
        generic_name: 'Doxylamine Succinate + Pyridoxine Hydrochloride',
        adult: { dosage_form: 'Tab', strength: '10/10 mg', schedule: '0+0+2 at bedtime', meal_timing: 'Before Meal', duration: '14-30 Days', special_instructions: 'সকালের বমি ভাব রোধে রাতে শোয়ার আগে ২টি ট্যাবলেট একসাথে খাবেন।' },
      },
    ],
    adviceBn: [
      'সকালে বিছানা ছাড়ার আগেই শুকনো টোস্ট বিস্কুট বা মুড়ি মুখে দিন।',
      'একসাথে বেশি খাবার না খেয়ে অল্প অল্প করে দিনে ৫-৬ বার খান।',
      'তৈলাক্ত, মসলাদার খাবার ও রান্নার গন্ধ থেকে দূরে থাকুন।',
    ],
  },
  {
    id: 'pcos-insulin-resistance',
    title: 'Polycystic Ovary Syndrome (PCOS / Irregular Cycles & Weight Gain)',
    titleBn: 'পলিসিস্টিক ওভারি সিন্ড্রোম (পিসিওএস / অনিয়মিত মাসিক ও ওজন বৃদ্ধি)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['pcos', 'polycystic ovary', 'পিসিওএস', 'irregular periods hirsutism', 'facial hair female'],
    description: 'Metformin insulin sensitization, Inositol therapy, weight reduction and low-glycemic diet.',
    descriptionBn: 'ইনসুলিন রেজিস্ট্যান্স কমাতে মেটফরমিন, মায়ো-ইনোসিটল ও ওজন কমানো।',
    medicines: [
      {
        brand_name: 'Combit',
        generic_name: 'Metformin Hydrochloride (XR)',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '0+0+1', meal_timing: 'With Meal', duration: '90 Days', special_instructions: 'রাতের খাবারের সাথে ১টি।' },
      },
      {
        brand_name: 'Inofolic',
        generic_name: 'Myo-Inositol + Folic Acid',
        adult: { dosage_form: 'Syr', strength: '2 g sachet', schedule: '1 sachet BD', meal_timing: 'Anytime', duration: '90 Days', special_instructions: '১ গ্লাস পানিতে গুলে দিনে ২ বার পান করুন।' },
      },
    ],
    adviceBn: [
      'শরীরের বাড়তি ওজনের ৫-১০% ওজন কমালে প্রাকৃতিকভাবেই মাসিক নিয়মিত হতে শুরু করে।',
      'চিনি, মিষ্টি, ফাস্টফুড, পেস্ট্রি ও কোল্ড ড্রিংকস খাওয়া সম্পূর্ণ বন্ধ করুন।',
      'প্রতিদিন অন্তত ৪৫ মিনিট ঘাম ঝরিয়ে দ্রুত হাঁটুন।',
    ],
  },
  {
    id: 'perimenopausal-hot-flushes',
    title: 'Perimenopausal Vasomotor Symptoms (Hot Flushes & Mood Swings)',
    titleBn: 'মেনোপজ পূর্ববর্তী হঠাৎ শরীর গরম হওয়া ও অস্থিরতা (হট ফ্লাশ)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['hot flushes', 'menopause', 'মেনোপজ', 'perimenopause', 'night sweats menopause'],
    description: 'Isoflavones, SSRI non-hormonal relief or low-dose HRT evaluation + bone density support.',
    descriptionBn: 'শরীরের তাপমাত্রা স্বাভাবিক রাখা, ক্যালসিয়াম-ভিটামিন ডি ও পুষ্টি থেরাপি।',
    medicines: [
      {
        brand_name: 'Calbo-D',
        generic_name: 'Calcium + Vitamin D3',
        adult: { dosage_form: 'Tab', strength: '500mg+200IU', schedule: '1+0+1', meal_timing: 'After Meal', duration: '90 Days', special_instructions: 'হাড়ের ক্ষয় রোধে সকাল ও রাতে খাবারের পর ১টি।' },
      },
      {
        brand_name: 'Femisol',
        generic_name: 'Soy Isoflavones Herbal Complex',
        adult: { dosage_form: 'Cap', strength: 'Standard', schedule: '1+0+0', meal_timing: 'After Meal', duration: '60 Days', special_instructions: 'সকালে খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'পাতলা ঢিলেঢালা সুতির পোশাক পরুন ও শরীর ঠাণ্ডা রাখুন।',
      'কফি, অতিরিক্ত ঝাল খাবার ও ধূমপান এড়িয়ে চলুন (এগুলো হট ফ্লাশ বাড়িয়ে দেয়)।',
    ],
  },
  {
    id: 'iron-deficiency-anemia-pregnancy',
    title: 'Iron Deficiency Anemia in Pregnancy (Safe ANC Protocol)',
    titleBn: 'গর্ভকালীন রক্তস্বল্পতা (নিরাপদ গর্ভবতী মায়ের আয়রন থেরাপি)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['pregnancy anemia', 'গর্ভবতীর রক্তস্বল্পতা', 'anemia in pregnancy', 'low hemoglobin pregnancy'],
    description: 'Elemental iron + Folic acid daily from second trimester until 3 months postpartum.',
    descriptionBn: 'দ্বিতীয় ট্রাইমেস্টার থেকে নিয়মিত আয়রন-ফলিক এসিড বড়ি ও পুষ্টিকর খাবার।',
    medicines: [
      {
        brand_name: 'Ferix-F',
        generic_name: 'Iron Polymaltose + Folic Acid',
        adult: { dosage_form: 'Tab', strength: 'Standard', schedule: '0+0+1', meal_timing: 'After Meal', duration: '90 Days', special_instructions: 'রাতে খাবারের পর ১টি।' },
      },
      {
        brand_name: 'Calbo-D',
        generic_name: 'Calcium + Vitamin D3',
        adult: { dosage_form: 'Tab', strength: '500mg+200IU', schedule: '1+0+0', meal_timing: 'After Meal', duration: '90 Days', special_instructions: 'দুপুরে খাবারের পর ১টি (আয়রন ও ক্যালসিয়াম আলাদা সময়ে খাবেন)।' },
      },
    ],
    adviceBn: [
      'আয়রন বড়ি ও ক্যালসিয়াম বড়ি কখনই একসাথে খাবেন না (কমপক্ষে ৪ ঘণ্টার ব্যবধান রাখুন)।',
      'ডালিম, আপেল, খেজুর, ডাল, ডিম ও কলিজা নিয়মিত খাদ্যতালিকায় রাখুন।',
    ],
  },
];
