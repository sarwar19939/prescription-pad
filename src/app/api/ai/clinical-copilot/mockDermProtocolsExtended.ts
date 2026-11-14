/**
 * Extended Dermatological Protocols for MedRecord Vision Mock Engine.
 * Covers Vitiligo, Pityriasis Versicolor, Impetigo, Melasma, Alopecia, Paronychia, Cellulitis.
 */

export function getVitiligoProtocol() {
  return {
    observed_features: [
      'Sharply demarcated, depigmented (chalky/milky white) macules and patches',
      'Absence of epidermal scaling or inflammation; hair within lesions may exhibit leukotrichia',
      'Predilection for acrofacial and periorificial areas',
    ],
    differential_diagnoses: [
      'Vitiligo (শ্বেতী রোগ / লিকোডার্মা)',
      'Post-inflammatory Hypopigmentation',
      'Pityriasis Alba',
      'Tinea Versicolor',
    ],
    primary_diagnosis: 'Vitiligo (শ্বেতী রোগ)',
    recommended_workup: ['Wood’s lamp examination', 'Thyroid antibodies (Anti-TPO) and Serum TSH'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Tacroz Ointment', generic_name: 'Tacrolimus 0.1%', dosage_form: 'Oint', strength: '0.1%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '3-6 Months', special_instructions: 'সাদা ক্ষতের উপর দিনে ২ বার নিয়মিত লাগান।' },
        { brand_name: 'Sunfree Gel', generic_name: 'Broad Spectrum Sunscreen SPF 50+', dosage_form: 'Lot', strength: 'SPF 50+', schedule: '1+0+0', meal_timing: 'Anytime', duration: 'Daily', special_instructions: 'রোদে বের হওয়ার ২০ মিনিট আগে লাগাবেন।' },
      ],
      advice: [
        'ক্ষতস্থানে রোদ যেন সরাসরি না লাগে, সানস্ক্রিন ব্যবহার করুন।',
        'ত্বকে কোনো আঘাত, ঘর্ষণ বা কাটাছেঁড়া এড়িয়ে চলুন (Koebner phenomenon)।',
      ],
    },
    safety_warnings: ['স্টেরয়েড মলম একটানা দীর্ঘ সময় ব্যবহার করলে ত্বক পাতলা (Atrophy) হতে পারে।'],
  };
}

export function getTineaVersicolorProtocol() {
  return {
    observed_features: [
      'Multiple well-demarcated hypopigmented to hyperpigmented macules with fine powdery scaling',
      'Confluent patches over chest, upper back, and neck (Seborrheic areas)',
      'Evocation of fine scale on stretching the skin (Coup d’ongle sign)',
    ],
    differential_diagnoses: [
      'Pityriasis Versicolor / Tinea Versicolor (ছুলি / সেহলি)',
      'Pityriasis Alba',
      'Post-inflammatory Hypopigmentation',
    ],
    primary_diagnosis: 'Pityriasis Versicolor (ছুলি / সেহলি)',
    recommended_workup: ['10% KOH skin scraping showing "spaghetti and meatballs" appearance'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Selsun Blue Shampoo', generic_name: 'Selenium Sulfide 2.5%', dosage_form: 'Syr', strength: '2.5%', schedule: 'সপ্তাহে ৩ দিন', meal_timing: 'Anytime', duration: '4 Weeks', special_instructions: 'গোসলের সময় আক্রান্ত স্থানে লাগিয়ে ১০ মিনিট রেখে ধুয়ে ফেলবেন।' },
        { brand_name: 'Fungicon', generic_name: 'Fluconazole', dosage_form: 'Cap', strength: '150 mg', schedule: 'সপ্তাহে ১টি', meal_timing: 'After Meal', duration: '4 Weeks', special_instructions: 'প্রতি সপ্তাহে নির্দিষ্ট দিনে খাবারের পর ১টি।' },
      ],
      advice: [
        'গা ঘামা রোধ করুন এবং সবসময় শুকনো ও পরিষ্কার কাপড় পরুন।',
        'রোগ সারার পরও সাদা দাগ স্বাভাবিক হতে কয়েক মাস সময় লাগতে পারে।',
      ],
    },
    safety_warnings: ['সাদা দাগ মেলানিন পুনরুজ্জীবিত হতে কিছুটা সময় নেয়—এটি সক্রিয় ফাঙ্গাস নয়।'],
  };
}

export function getImpetigoProtocol() {
  return {
    observed_features: [
      'Erythematous erosions covered with characteristic thick, golden-yellow (honey-colored) crusts',
      'Rapidly spreading superficial vesicles and pustules around perioral and perinasal areas',
    ],
    differential_diagnoses: [
      'Impetigo Contagiosa (সংক্রামক ব্যাকটেরিয়াল ক্ষত / ফোঁড়া)',
      'Herpes Simplex Infection',
      'Eczema Herpeticum',
    ],
    primary_diagnosis: 'Impetigo Contagiosa (সংক্রামক ব্যাকটেরিয়াল ক্ষত)',
    recommended_workup: ['Bacterial swab culture & sensitivity if recurrent'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Bactroban Ointment', generic_name: 'Mupirocin 2%', dosage_form: 'Oint', strength: '2%', schedule: '1+1+1', meal_timing: 'Anytime', duration: '7-10 Days', special_instructions: 'ক্ষতের সোনালী রঙের খোসা কুসুম গরম পানি দিয়ে আলতো তুলে মলম লাগান।' },
        { brand_name: 'Cef-3', generic_name: 'Cefixime', dosage_form: 'Cap', strength: '200 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'ক্ষত ছড়িয়ে পড়লে মুখে খাওয়ার অ্যান্টিবায়োটিক।' },
      ],
      advice: [
        'ক্ষতস্থানে বারবার হাত দেওয়া বন্ধ করুন এবং সাবান দিয়ে হাত ধুয়ে রাখুন।',
        'বাচ্চাদের ব্যক্তিগত তোয়ালে ও কাপড় অন্যদের থেকে আলাদা রাখুন।',
      ],
    },
    safety_warnings: ['সংক্রমণ ছড়িয়ে পড়া রোধে শিশুকে কয়েক দিন স্কুল বা অন্য বাচ্চাদের থেকে আলাদা রাখুন।'],
  };
}

export function getMelasmaProtocol() {
  return {
    observed_features: [
      'Symmetric, reticulated hyperpigmented brown-to-slate-gray macules and patches',
      'Centrofacial and malar distribution across cheeks, forehead, and upper lip',
    ],
    differential_diagnoses: [
      'Melasma / Chloasma (মেছতা)',
      'Post-inflammatory Hyperpigmentation',
      'Solar Lentigines',
    ],
    primary_diagnosis: 'Melasma / Chloasma (মেছতা)',
    recommended_workup: ['Wood’s lamp to determine epidermal vs dermal depth'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Sunfree Gel', generic_name: 'Broad Spectrum Sunscreen SPF 50+', dosage_form: 'Lot', strength: 'SPF 50+', schedule: '1+0+0', meal_timing: 'Anytime', duration: 'Daily', special_instructions: 'প্রতিদিন সকাল ও দুপুরে রোদে যাওয়ার আগে পর্যাপ্ত লাগান।' },
        { brand_name: 'Skinlite Cream', generic_name: 'Hydroquinone 2% + Tretinoin 0.025%', dosage_form: 'Oint', strength: 'Combined', schedule: '0+0+1', meal_timing: 'Anytime', duration: '6-8 Weeks', special_instructions: 'রাতে ঘুমানোর পূর্বে শুধু কালো দাগের অংশে হালকা লাগাবেন।' },
      ],
      advice: [
        'রান্নার চুলার তাপ ও সূর্যের অতিবেগুনি রশ্মি সম্পূর্ণ এড়িয়ে চলুন।',
        'বাইরে যাওয়ার সময় ছাতা বা চওড়া টুপি ব্যবহার করুন।',
      ],
    },
    safety_warnings: ['হাইড্রোকুইনোনযুক্ত ক্রিম টানা ৩ মাসের বেশি ব্যবহার নিষিদ্ধ (Ochronosis ঝুঁকি)।'],
  };
}

export function getParonychiaCellulitisProtocol(isCellulitis: boolean) {
  if (isCellulitis) {
    return {
      observed_features: [
        'Poorly demarcated, rapidly spreading warm erythematous indurated skin swelling',
        'Marked tenderness, local calor, and regional lymphadenopathy with systemic fever',
      ],
      differential_diagnoses: [
        'Cellulitis (ত্বকের গভীর সংক্রামক প্রদাহ)',
        'Erysipelas',
        'Deep Vein Thrombosis (DVT)',
      ],
      primary_diagnosis: 'Cellulitis (ত্বকের গভীর সংক্রামক প্রদাহ / সেলুলাইটিস)',
      recommended_workup: ['Blood Culture & Sensitivity', 'CBC with ESR and CRP', 'Duplex Doppler if DVT suspected'],
      suggested_treatment: {
        medicines: [
          { brand_name: 'Fluclox', generic_name: 'Flucloxacillin', dosage_form: 'Cap', strength: '500 mg', schedule: '1+1+1+1', meal_timing: 'Before Meal', duration: '10-14 Days', special_instructions: 'খাবারের ১ ঘণ্টা আগে খালি পেটে প্রতি ৬ ঘণ্টা পরপর ১টি।' },
          { brand_name: 'Napa Extend', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '665 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'ব্যথা ও জ্বর উপশমে।' },
        ],
        advice: [
          'আক্রান্ত পা বা অঙ্গ বালিশের উপর উঁচুতে (Elevation) রাখুন।',
          'লাল অংশ মার্কার পেন দিয়ে দাগিয়ে রাখুন যাতে ছড়াচ্ছে কিনা নজর রাখা যায়।',
        ],
      },
      safety_warnings: ['দ্রুত ছড়িয়ে পড়লে বা তীব্র কাঁপুনি দিয়ে জ্বর এলে হাসপাতালে ভর্তি হয়ে আইভি অ্যান্টিবায়োটিক প্রয়োজন।'],
    };
  }

  return {
    observed_features: [
      'Tense, painful, erythematous periungual swelling surrounding nail fold',
      'Accumulation of purulent exudate along the lateral nail fold with exquisite tenderness',
    ],
    differential_diagnoses: [
      'Acute Paronychia (নখকুনী / নখের পাশের তীব্র প্রদাহ)',
      'Herpetic Whitlow',
      'Onychocryptosis (Ingrown toenail)',
    ],
    primary_diagnosis: 'Acute Paronychia (নখকুনী / পেরিঅঙ্গুয়াল ইনফেকশন)',
    recommended_workup: ['Pus culture & sensitivity if abscess requires incision and drainage'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Fluclox', generic_name: 'Flucloxacillin', dosage_form: 'Cap', strength: '500 mg', schedule: '1+1+1+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খাবারের ১ ঘণ্টা আগে খালি পেটে সেব্য।' },
        { brand_name: 'Bactroban Ointment', generic_name: 'Mupirocin 2%', dosage_form: 'Oint', strength: '2%', schedule: '1+0+1', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'নখের চারপাশে হালকা প্রলেপ দিন।' },
      ],
      advice: [
        'কুসুম গরম পানিতে সামান্য লবণ দিয়ে দিনে ৩ বার নখ ভিজিয়ে রাখুন (Warm soak)।',
        'দাঁত দিয়ে নখ কামড়ানো সম্পূর্ণ বন্ধ করুন।',
      ],
    },
    safety_warnings: ['পুঁজ জমে টেনশন বাড়লে ছোট ইনসিশন দিয়ে পুঁজ বের (Drainage) করতে হতে পারে।'],
  };
}
