import type { DiseaseProtocolTemplate } from './types';

export const GYNAE_INFECTIONS_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'vulvovaginal-candidiasis-thrush',
    title: 'Vulvovaginal Candidiasis (Curdy White Discharge & Itch)',
    titleBn: 'যোনিপথে ছত্রাক ইনফেকশন (সাদা স্রাব ও তীব্র চুলকানি)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['vaginal candidiasis', 'সাদা স্রাব', 'curdy white discharge', 'vaginal yeast', 'vaginal itching'],
    description: 'Oral fluconazole 150 mg single dose or clotrimazole vaginal pessary.',
    descriptionBn: 'ফ্লুকোনাজল একক মাত্রার ক্যাপসুল ও ক্লোট্রিমাজোল সাপোজিটরি।',
    medicines: [
      {
        brand_name: 'Flugal',
        generic_name: 'Fluconazole',
        adult: { dosage_form: 'Cap', strength: '150 mg', schedule: '1 cap stat single dose', meal_timing: 'After Meal', duration: 'Repeat day 3 if severe', special_instructions: 'খাবারের পর একবারে ১টি ক্যাপসুল সেবন করুন।' },
      },
      {
        brand_name: 'Candid Vaginal Pessary',
        generic_name: 'Clotrimazole Vaginal Suppository (100 mg / 500 mg)',
        adult: { dosage_form: 'Drop', strength: '500 mg', schedule: '1 pessary at bedtime', meal_timing: 'Anytime', duration: 'Single dose', special_instructions: 'রাতে শোয়ার সময় যোনিপথের গভীরে ১টি সাপোজিটরি প্রবেশ করান।' },
      },
    ],
    adviceBn: [
      'সুতির ঢিলেঢালা অন্তর্বাস পরুন ও অন্তর্বাস ধুয়ে কড়া রোদে শুকান।',
      'অতিরিক্ত মিষ্টি খাবার বর্জন করুন ও ডায়াবেটিস নিয়ন্ত্রণে রাখুন।',
    ],
  },
  {
    id: 'bacterial-vaginosis-gardnerella',
    title: 'Bacterial Vaginosis (Fishy Malodorous Discharge)',
    titleBn: 'ব্যাকটেরিয়াল ভ্যাজাইনোসিস (অতিরিক্ত দুর্গন্ধযুক্ত তরল সাদা স্রাব)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['bacterial vaginosis', 'bv', 'fishy odor vaginal', 'malodorous discharge'],
    description: 'Oral metronidazole 500 mg BD for 7 days or topical clindamycin.',
    descriptionBn: 'মেট্রোনিডাজল বা ক্লিণ্ডামাইসিন ৭ দিনের সম্পূর্ণ অ্যান্টিবায়োটিক কোর্স।',
    medicines: [
      {
        brand_name: 'Filmet',
        generic_name: 'Metronidazole',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'খাবারের পর সকাল ও রাতে সেব্য।' },
      },
    ],
    adviceBn: [
      'যোনিপথের ভেতরে সুগন্ধি সাবান বা কোনো অ্যান্টিসেপটিক ওয়াশ দেওয়া সম্পূর্ণ পরিহার করুন।',
      'চিকিৎসা চলাকালীন সহবাস থেকে বিরত থাকুন।',
    ],
  },
  {
    id: 'lactational-mastitis-engorgement',
    title: 'Lactational Mastitis & Breast Engorgement',
    titleBn: 'ম্যাস্টাইটিস ও স্তনে দুধ জমে তীব্র ব্যথা (বুকের দুধের প্রদাহ)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['mastitis', 'breast engorgement', 'স্তনে ব্যথা', 'breast inflammation lactating'],
    description: 'Continued frequent breastfeeding/pumping, warm compress, and anti-staphylococcal Flucloxacillin.',
    descriptionBn: 'বুকের দুধ খাওয়ানো চালু রাখা, স্তন খালি করা ও ফ্লুক্লক্সাসিলিন অ্যান্টিবায়োটিক।',
    medicines: [
      {
        brand_name: 'Flugal',
        generic_name: 'Flucloxacillin',
        adult: { dosage_form: 'Cap', strength: '500 mg', schedule: '1+1+1+1', meal_timing: 'Before Meal', duration: '10-14 Days', special_instructions: 'খাবারের আধা ঘণ্টা আগে খালি পেটে।' },
      },
      {
        brand_name: 'Napa',
        generic_name: 'Paracetamol',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'জ্বর ও স্তনের ব্যথায় সেব্য।' },
      },
    ],
    adviceBn: [
      'আক্রান্ত স্তন থেকে বাচ্চাকে দুধ খাওয়ানো সম্পূর্ণ নিরাপদ এবং স্তন খালি না করলে ইনফেকশন বাড়ে।',
      'দুধ খাওয়ানোর আগে হালকা কুসুম গরম পানির সেঁক ও দুধ খাওয়ানোর পর ঠাণ্ডা সেঁক দিন।',
    ],
  },
  {
    id: 'pregnancy-uti-asymptomatic',
    title: 'Urinary Tract Infection in Pregnancy (Safe Treatment)',
    titleBn: 'গর্ভকালীন প্রস্রাবের ইনফেকশন (মা ও শিশুর জন্য নিরাপদ চিকিৎসা)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['pregnancy uti', 'গর্ভবতীর প্রস্রাবে ইনফেকশন', 'uti in pregnancy', 'asymptomatic bacteriuria pregnancy'],
    description: 'Safe pregnancy antimicrobials (Cefuroxime/Cefixime) for 7 days to prevent preterm labor.',
    descriptionBn: 'গর্ভপাতের ঝুঁকি ও অকাল প্রসব রোধে নিরাপদ সেফুরোক্সিম অ্যান্টিবায়োটিক।',
    medicines: [
      {
        brand_name: 'Kilmax',
        generic_name: 'Cefuroxime Axetil',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'খাবারের পর সকাল ও রাতে ১টি করে।' },
      },
    ],
    adviceBn: [
      'প্রচুর পরিমাণে পানি পান করুন যাতে দিনে অন্তত ২ লিটার প্রস্রাব হয়।',
      'কোর্স শেষ করার ১ সপ্তাহ পর পুনরায় ইউরিন রুটিন ও কালচার পরীক্ষা করান।',
    ],
  },
  {
    id: 'pelvic-inflammatory-disease-pid',
    title: 'Pelvic Inflammatory Disease (PID Mild-to-Moderate OPD)',
    titleBn: 'পেলভিক ইনফ্ল্যামেটরি ডিজিজ (পিআইডি / তলপেটে তীব্র ব্যথা ও সংক্রমণ)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['pid', 'pelvic inflammatory disease', 'তলপেট ব্যথা পিআইডি', 'cervical motion tenderness'],
    description: 'Ceftriaxone IM + Doxycycline 14 days + Metronidazole 14 days covering gonorrhea/chlamydia.',
    descriptionBn: 'যৌনাঙ্গের গভীরে সংক্রমণ দূরীকরণে ডক্সিসাইক্লিন ও মেট্রোনিডাজল কোর্স।',
    medicines: [
      {
        brand_name: 'Doxicap',
        generic_name: 'Doxycycline',
        adult: { dosage_form: 'Cap', strength: '100 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'ভরা পেটে প্রচুর পানিসহ সেবন করুন।' },
      },
      {
        brand_name: 'Filmet',
        generic_name: 'Metronidazole',
        adult: { dosage_form: 'Tab', strength: '400 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'খাবারের পর সেব্য।' },
      },
    ],
    adviceBn: [
      'চিকিৎসা শেষ না হওয়া পর্যন্ত সহবাস থেকে বিরত থাকুন এবং জীবনসঙ্গীরও চিকিৎসা গ্রহণ নিশ্চিত করুন।',
      'তীব্র জ্বর বা অসহ্য পেট ব্যথা হলে দ্রুত হাসপাতালে ভর্তি হন।',
    ],
  },
  {
    id: 'trichomoniasis-vaginitis',
    title: 'Trichomoniasis (Frothy Yellow-Green Discharge)',
    titleBn: 'ট্রাইকোমোনিয়াসিস (হলুদ-সবুজ ফেনাযুক্ত স্রাব ও তীব্র চুলকানি)',
    category: 'Gynecology & Obstetrics',
    diagnosisMatch: ['trichomoniasis', 'trichomonas', 'frothy vaginal discharge', 'strawberry cervix'],
    description: 'Oral metronidazole / tinidazole single high-dose with simultaneous partner treatment.',
    descriptionBn: 'টিনিডাজল একক মাত্রার ৪টি ট্যাবলেট স্বামী ও স্ত্রী উভয়ের একসাথে সেবন।',
    medicines: [
      {
        brand_name: 'Tiniba',
        generic_name: 'Tinidazole',
        adult: { dosage_form: 'Tab', strength: '500 mg', schedule: '4 tabs stat single dose', meal_timing: 'After Meal', duration: '1 Day', special_instructions: 'স্বামী ও স্ত্রী উভয়েই রাতে খাবারের পর একসাথে ৪টি করে ট্যাবলেট সেবন করবেন।' },
      },
    ],
    adviceBn: [
      'ওষুধ চলাকালীন ও পরবর্তী ৩ দিন অ্যালকোহল সম্পূর্ণ বর্জন করুন।',
      'উভয়ের চিকিৎসা সম্পন্ন না হওয়া পর্যন্ত সহবাস করবেন না।',
    ],
  },
];
