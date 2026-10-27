import type { DiseaseProtocolTemplate } from './types';

export const DERM_INFLAMMATORY_PROTOCOLS: DiseaseProtocolTemplate[] = [
  {
    id: 'atopic-dermatitis-eczema',
    title: 'Atopic Dermatitis / Eczema (Dry Itchy Skin)',
    titleBn: 'একজিমা ও অ্যাটপিক ডার্মাটাইটিস (ত্বকের শুষ্কতা ও চুলকানি)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['eczema', 'atopic dermatitis', 'একজিমা', 'dry skin itch', 'dermatitis'],
    description: 'Intense barrier repair emollient, mid-potency topical steroid for flares.',
    descriptionBn: 'ত্বকের আর্দ্রতা রক্ষা, ময়েশ্চারাইজার ও চুলকানি নিবারণ।',
    medicines: [
      {
        brand_name: 'Ezerum Ointment',
        generic_name: 'Mometasone Furoate 0.1%',
        adult: { dosage_form: 'Oint', strength: '0.1%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '7-14 Days', special_instructions: 'তীব্র চুলকানির স্থানে রাতে একবার পাতলা করে লাগাবেন। ভালো হলে বন্ধ করুন।' },
      },
      {
        brand_name: 'Cetaphil Moisturizing Cream',
        generic_name: 'Emollient Barrier Cream',
        adult: { dosage_form: 'Oint', strength: 'Standard', schedule: '3-4 times daily', meal_timing: 'Anytime', duration: 'Ongoing', special_instructions: 'গোসলের ৩ মিনিটের মধ্যে সারা শরীরে প্রচুর পরিমাণে মেখে নিন।' },
      },
    ],
    adviceBn: [
      'অতিরিক্ত গরম পানি দিয়ে গোসল করবেন না, মৃদু সাবান ব্যবহার করুন।',
      'পশমি বা সিন্থেটিক কাপড়ের বদলে নরম সুতির পোশাক পরিধান করুন।',
    ],
  },
  {
    id: 'acute-urticaria-hives',
    title: 'Acute Urticaria / Hives (Allergic Wheals)',
    titleBn: 'আমবাত / আর্টিক্যারিয়া (হঠাৎ শরীর চাকা চাকা হয়ে চুলকানো)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['urticaria', 'hives', 'আমবাত', 'allergy wheals', 'skin rash with itching'],
    description: 'High-dose non-sedating second-generation H1 antihistamines.',
    descriptionBn: 'চাকা চাকা অ্যালার্জি দমনে দ্বিগুণ মাত্রার আধুনিক অ্যান্টিহিস্টামিন।',
    medicines: [
      {
        brand_name: 'Bilashin',
        generic_name: 'Bilastine',
        adult: { dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7-14 Days', special_instructions: 'খাবারের ১ ঘণ্টা আগে বা ২ ঘণ্টা পরে।' },
      },
      {
        brand_name: 'Rupafin',
        generic_name: 'Rupatadine',
        adult: { dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'রাতে শোয়ার আগে ১টি।' },
      },
    ],
    adviceBn: [
      'চিংড়ি, ইলিশ, বেগুন, গরুর মাংস, হাঁসের ডিম ইত্যাদি সন্দেহজনক খাবার সাময়িক বর্জন করুন।',
      'ঠাণ্ডা পানির সেঁক দিন, গরম পানি বা রোদে গেলে চুলকানি বৃদ্ধি পায়।',
      'ঠোঁট ফোলা বা শ্বাসকষ্ট দেখা দিলে অনতিবিলম্বে হাসপাতালে যান।',
    ],
  },
  {
    id: 'acne-vulgaris-inflammatory',
    title: 'Acne Vulgaris (Papulopustular / Pimples)',
    titleBn: 'ব্রণ / একনি (মুখের পুঁজযুক্ত লালচে ব্রণ)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['acne', 'pimples', 'ব্রণ', 'facial breakout', 'acne vulgaris'],
    description: 'Topical retinoid + benzoyl peroxide with oral doxycycline for inflammatory lesions.',
    descriptionBn: 'মুখের তেল ও ব্যাকটেরিয়া নিয়ন্ত্রণে অ্যান্টিবায়োটিক ও রেটিনয়েড থেরাপি।',
    medicines: [
      {
        brand_name: 'Benzac AC Gel',
        generic_name: 'Benzoyl Peroxide 2.5%',
        adult: { dosage_form: 'Oint', strength: '2.5%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '6-8 Weeks', special_instructions: 'রাতে ঘুমানোর আগে ব্রণের উপর ডট ডট করে লাগাবেন।' },
      },
      {
        brand_name: 'Doxicap',
        generic_name: 'Doxycycline',
        adult: { dosage_form: 'Cap', strength: '100 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'দুপুরে ভরা পেটে ১ গ্লাস পানিসহ। সেবনের পর ৩০ মিনিট শুয়ে পড়বেন না।' },
      },
    ],
    adviceBn: [
      'হাত দিয়ে ব্রণ খুঁটবেন বা টিপবেন না, এতে স্থায়ী গর্ত ও দাগ তৈরি হয়।',
      'তৈলাক্ত ময়েশ্চারাইজার ও তেলযুক্ত প্রসাধনী ব্যবহার সম্পূর্ণ বন্ধ করুন।',
      'দিনে ২ বার মৃদু ফোমিং ফেসওয়াশ দিয়ে মুখ ধুয়ে পরিষ্কার রাখুন।',
    ],
  },
  {
    id: 'contact-allergic-dermatitis',
    title: 'Allergic Contact Dermatitis (Soap / Cement / Metal Allergy)',
    titleBn: 'কন্ট্যাক্ট ডার্মাটাইটিস (সাবান, সিমেন্ট বা ধাতব অ্যালার্জি)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['contact dermatitis', 'cement allergy', 'হাত পা ফাটা এলার্জি', 'soap allergy'],
    description: 'Trigger avoidance, high-potency topical steroid, and barrier barrier restoration.',
    descriptionBn: 'কারণ বর্জন, স্টেরয়েড মলম এবং সুরক্ষা গ্লাভস ব্যবহার।',
    medicines: [
      {
        brand_name: 'Dermasol Ointment',
        generic_name: 'Clobetasol Propionate 0.05%',
        adult: { dosage_form: 'Oint', strength: '0.05%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '14 Days', special_instructions: 'ফাটা বা চুলকানির খসখসে স্থানে দিনে ২ বার মেখে দিন।' },
      },
      {
        brand_name: 'White Soft Paraffin',
        generic_name: 'Petroleum Jelly / Paraffin',
        adult: { dosage_form: 'Oint', strength: 'Standard', schedule: 'Frequent application', meal_timing: 'Anytime', duration: 'Ongoing', special_instructions: 'হাত ধোয়ার পর প্রতিবার ভ্যাসলিন মেখে রাখুন।' },
      },
    ],
    adviceBn: [
      'ডিটারজেন্ট, ক্ষারযুক্ত সাবান বা সিমেন্ট সরাসরি খালি হাতে স্পর্শ করবেন না।',
      'কাজ করার সময় ভেতরে সুতির এবং ওপরে রাবারের গ্লাভস পরুন।',
    ],
  },
  {
    id: 'seborrheic-dermatitis-dandruff',
    title: 'Seborrheic Dermatitis & Severe Dandruff',
    titleBn: 'খুশকি ও মাথায় সেবোরিক ডার্মাটাইটিস',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['dandruff', 'seborrheic dermatitis', 'খুশকি', 'flaking scalp with itch'],
    description: 'Ketoconazole 2% + Zinc Pyrithione medicated shampoo and mild topical steroid.',
    descriptionBn: 'মেডিকেটেড অ্যান্টিড্যানড্রাফ শ্যাম্পু ও স্ক্যাল্পের চুলকানি নিরাময়।',
    medicines: [
      {
        brand_name: 'Select Plus Shampoo',
        generic_name: 'Ketoconazole 2% + Zinc Pyrithione 1%',
        adult: { dosage_form: 'Drop', strength: 'Standard', schedule: 'Twice a week wash', meal_timing: 'Anytime', duration: '4-8 Weeks', special_instructions: 'চুলে ফেনা করে ৫ মিনিট রেখে ধুয়ে ফেলবেন। সপ্তাহে ২ বার।' },
      },
    ],
    adviceBn: [
      'মাথায় অতিরিক্ত তেল বা খাঁটি সরিষার তেল মাখা বন্ধ করুন (এতে ছত্রাক বৃদ্ধি পায়)।',
      'গোসল শেষে চুল ভালো করে শুকিয়ে নিন।',
    ],
  },
  {
    id: 'melasma-hyperpigmentation',
    title: 'Melasma / Facial Hyperpigmentation',
    titleBn: 'মেছতা ও মুখের কালো দাগ',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['melasma', 'chloasma', 'মেছতা', 'facial hyperpigmentation', 'dark patches on cheeks'],
    description: 'Broad-spectrum physical sunscreen SPF 50+ with topical tranexamic acid/azelaic acid.',
    descriptionBn: 'উচ্চ ক্ষমতার সানস্ক্রিন ও নিরাপদে দাগ দূরীকরণ চিকিৎসা।',
    medicines: [
      {
        brand_name: 'Spectraban Sunscreen',
        generic_name: 'Broad Spectrum Sunscreen SPF 50+',
        adult: { dosage_form: 'Oint', strength: 'SPF 50+', schedule: 'Morning & Noon apply', meal_timing: 'Anytime', duration: 'Ongoing', special_instructions: 'রোদে যাওয়ার ২০ মিনিট আগে এবং চুলার কাছে যাওয়ার আগে মুখে মেখে নিন।' },
      },
      {
        brand_name: 'Aziderm Cream',
        generic_name: 'Azelaic Acid 10%',
        adult: { dosage_form: 'Oint', strength: '10%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '8-12 Weeks', special_instructions: 'রাতে মেছতার দাগের উপর পাতলা করে মেখে ঘুমান।' },
      },
    ],
    adviceBn: [
      'রোদে ছাতা, সানগ্লাস ও মাস্ক ব্যবহার নিশ্চিত করুন।',
      'কোনো ক্ষতিকর স্টেরয়েড বা পারদযুক্ত ফর্সাকারী নাইট ক্রিম লাগাবেন না।',
    ],
  },
  {
    id: 'alopecia-areata',
    title: 'Alopecia Areata (Patchy Hair Loss)',
    titleBn: 'চুল পড়া ও টাক হওয়া (অ্যালোপেসিয়া এরিয়াটা)',
    category: 'Skin & Dermatology',
    diagnosisMatch: ['alopecia', 'hair loss', 'টাক', 'চুল পড়া', 'patchy bald spot'],
    description: 'Topical high-potency steroid or minoxidil hair follicle stimulation.',
    descriptionBn: 'চুল গজাতে মিনোক্সিডিল ৫% লোশন ও ফলিকল উদ্দীপনা।',
    medicines: [
      {
        brand_name: 'Trugain Solution',
        generic_name: 'Minoxidil 5% Topical Solution',
        adult: { dosage_form: 'Drop', strength: '5%', schedule: '1 ml BD', meal_timing: 'Anytime', duration: '3-6 Months', special_instructions: 'টাক হওয়া অংশে ড্রপার দিয়ে ১ মিলি মেখে আলতো মালিশ করুন।' },
      },
      {
        brand_name: 'Folimax',
        generic_name: 'Biotin + Zinc + Minerals',
        adult: { dosage_form: 'Tab', strength: 'Standard', schedule: '1+0+0', meal_timing: 'After Meal', duration: '60 Days', special_instructions: 'সকালে খাবারের পর ১টি।' },
      },
    ],
    adviceBn: [
      'চুলে অতিরিক্ত হিট বা কেমিক্যাল হেয়ার কালার ব্যবহার করবেন না।',
      'মানসিক চাপ কমান ও পর্যাপ্ত প্রোটিনসমৃদ্ধ খাবার (ডিম, দুধ, বাদাম) খান।',
    ],
  },
];
