/**
 * Clinical protocols for Dermatological conditions in AI Vision Mock.
 */

export function getScabiesProtocol() {
  return {
    observed_features: [
      'Excoriated erythematous papules and classic burrows in interdigital web spaces and flexor surfaces of wrists',
      'Prominent excoriation marks secondary to intense nocturnal pruritus (রাতের তীব্র চুলকানি)',
      'Characteristic anatomical distribution involving finger webs, wrists, and axillae',
    ],
    differential_diagnoses: [
      'Scabies / খোসপাঁচড়া (Sarcoptes scabiei)',
      'Papular Urticaria',
      'Atopic Dermatitis / Flexural Eczema',
      'Superficial Folliculitis',
    ],
    primary_diagnosis: 'Scabies / খোসপাঁচড়া (Sarcoptes scabiei)',
    recommended_workup: ['Clinical diagnosis; microscopic burrow ink test or scraping if atypical'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Lorex 5% Cream', generic_name: 'Permethrin 5% w/w', dosage_form: 'Oint', strength: '5%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '1 Day (Repeat in 7 days)', special_instructions: 'ঘাড় থেকে পায়ের পাতা পর্যন্ত সারা শরীরে মেখে ৮-১২ ঘণ্টা পর সাবান দিয়ে ধুয়ে ফেলবেন। পরিবারের সবার একসাথে ব্যবহার জরুরি।' },
        { brand_name: 'Bilastin', generic_name: 'Bilastine', dosage_form: 'Tab', strength: '20 mg', schedule: '0+0+1', meal_timing: 'Before Meal', duration: '10 Days', special_instructions: 'রাতে শোয়ার আগে তীব্র চুলকানি উপশমে খালি পেটে সেব্য।' },
        { brand_name: 'Caladryl Lotion', generic_name: 'Calamine + Diphenhydramine', dosage_form: 'Lot', strength: 'Standard', schedule: '1+0+1', meal_timing: 'Anytime', duration: '7 Days', special_instructions: 'চুলকানি স্থানে হালকাভাবে প্রলেপ দিন।' },
      ],
      advice: [
        'পরিবারের সকল সদস্যের (লক্ষণ থাকুক বা না থাকুক) একই রাতে একসাথে চিকিৎসা গ্রহণ করতে হবে।',
        'ব্যবহৃত সকল জামাকাপড়, বিছানার চাদর ও তোয়ালে গরম পানিতে ধুয়ে রোদে শুকিয়ে নিতে হবে।',
        'নখ সবসময় ছোট করে কাটুন যাতে আঁচড়ে ব্যাকটেরিয়াল সংক্রমণ না ঘটে।',
      ],
    },
    safety_warnings: ['পরিবারের সকল সদস্য একসাথে ওষুধ ব্যবহার না করলে পুনরায় রোগ ছড়িয়ে পড়বে (Ping-pong infection)।'],
  };
}

export function getAcneProtocol() {
  return {
    observed_features: [
      'Inflammatory erythematous papules, pustules, and open/closed comedones',
      'Facial distribution predominantly across cheeks, forehead, and jawline',
    ],
    differential_diagnoses: [
      'Acne Vulgaris (Grade II Moderate)',
      'Rosacea (Papulopustular)',
      'Gram-Negative Folliculitis',
    ],
    primary_diagnosis: 'Acne Vulgaris (ব্রণ)',
    recommended_workup: ['Clinical evaluation of severity grade and hormonal screen if hirsutism present'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'A-Ret Gel', generic_name: 'Tretinoin 0.05% Gel', dosage_form: 'Oint', strength: '0.05%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '60 Days', special_instructions: 'রাতে ঘুমানোর পূর্বে মুখ ধুয়ে শুকিয়ে শুধু ব্রণের জায়গায় হালকা লাগাবেন।' },
        { brand_name: 'Clinda Gel', generic_name: 'Clindamycin 1% Gel', dosage_form: 'Oint', strength: '1%', schedule: '1+0+0', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'সকালে গোসলের পর ব্রণের উপর লাগাবেন।' },
      ],
      advice: [
        'বারবার মুখে হাত দেওয়া বা ব্রণ খোঁটা সম্পূর্ণ বন্ধ করুন।',
        'নন-কমেডোজেনিক মৃদু ফেসওয়াশ দিয়ে দিনে ২ বার মুখ পরিষ্কার করুন।',
      ],
    },
    safety_warnings: ['রেটিনয়েড জেল ব্যবহারের পর রোদে যাওয়ার সময় সানস্ক্রিন ব্যবহার করুন এবং গর্ভবতী অবস্থায় ব্যবহার নিষিদ্ধ।'],
  };
}

export function getEczemaProtocol() {
  return {
    observed_features: [
      'Poorly demarcated erythematous dry scaly patches with fine lichenification and epidermal fissures',
      'Intense pruritus with prominent excoriation marks on flexural surfaces',
    ],
    differential_diagnoses: [
      'Atopic Dermatitis / Flexural Eczema (একজিমা)',
      'Allergic Contact Dermatitis',
      'Nummular Eczema',
    ],
    primary_diagnosis: 'Atopic Dermatitis / Eczema (একজিমা)',
    recommended_workup: ['Patch testing if contact allergy suspected; Serum IgE'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Ezerra Cream', generic_name: 'Spent Grain Wax Emollient', dosage_form: 'Oint', strength: 'Topical', schedule: '1+0+1', meal_timing: 'Anytime', duration: '30 Days', special_instructions: 'গোসলের ৩ মিনিটের মধ্যে ভেজা ত্বকে পর্যাপ্ত পরিমাণে মেখে ত্বক আর্দ্র রাখুন।' },
        { brand_name: 'Elocon Cream', generic_name: 'Mometasone Furoate 0.1%', dosage_form: 'Oint', strength: '0.1%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '7-10 Days', special_instructions: 'প্রদাহযুক্ত লাল অংশে দিনে একবার হালকা করে লাগাবেন।' },
        { brand_name: 'Bilastin', generic_name: 'Bilastine', dosage_form: 'Tab', strength: '20 mg', schedule: '0+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'রাতে শোয়ার আগে চুলকানি উপশমে।' },
      ],
      advice: [
        'ত্বক সবসময় ময়েশ্চারাইজার দিয়ে ভিজা ও আর্দ্র রাখুন।',
        'কড়া ক্ষারযুক্ত সাবান পরিহার করে মৃদু ময়েশ্চারাইজিং সাবান ব্যবহার করুন।',
      ],
    },
    safety_warnings: ['স্টেরয়েড মলম টানা ১৪ দিনের বেশি মুখে বা কোমল অঙ্গে ব্যবহার করবেন না।'],
  };
}

export function getPsoriasisProtocol() {
  return {
    observed_features: [
      'Well-demarcated erythematous indurated plaques covered with thick, micaceous silvery-white scales',
      'Symmetrical extensor distribution predominantly over elbows, knees, and presacral region',
      'Auspitz sign positive upon gentle scraping of scale surface',
    ],
    differential_diagnoses: [
      'Plaque Psoriasis (সোরিয়াসিস)',
      'Seborrheic Dermatitis',
      'Nummular Eczema',
    ],
    primary_diagnosis: 'Plaque Psoriasis (সোরিয়াসিস)',
    recommended_workup: ['Skin punch biopsy if diagnostic uncertainty; Joint assessment for Psoriatic Arthritis'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Dovonex Ointment', generic_name: 'Calcipotriol + Betamethasone', dosage_form: 'Oint', strength: '50mcg/0.5mg', schedule: '0+0+1', meal_timing: 'Anytime', duration: '28 Days', special_instructions: 'ক্ষতযুক্ত প্লাকের উপর হালকা প্রলেপ দিন।' },
        { brand_name: 'Salicylic Ointment', generic_name: 'Salicylic Acid 6%', dosage_form: 'Oint', strength: '6%', schedule: '1+0+0', meal_timing: 'Anytime', duration: '14 Days', special_instructions: 'মোটা খোসা বা স্কেল তোলার জন্য সকালে লাগাবেন।' },
      ],
      advice: [
        'ত্বকে ময়েশ্চারাইজার মেখে চামড়া আর্দ্র রাখুন যাতে টান না ধরে।',
        'মানসিক চাপ নিয়ন্ত্রণে রাখুন এবং ধূমপান পরিহার করুন।',
      ],
    },
    safety_warnings: ['হঠাৎ করে ওরাল স্টেরয়েড বন্ধ বা সেবন করলে এরিথ্রোডার্মিক সোরিয়াসিস বা তীব্র ফ্লেয়ার হতে পারে—ওরাল স্টেরয়েড সম্পূর্ণ নিষিদ্ধ।'],
  };
}

export function getUrticariaProtocol() {
  return {
    observed_features: [
      'Transient, edematous, erythematous raised plaques (wheals) with central pallor and variable annular configurations',
      'Intensely pruritic evanescent lesions appearing rapidly and resolving within 24 hours without residual marks',
    ],
    differential_diagnoses: [
      'Acute Urticaria (আমবাত)',
      'Urticarial Vasculitis',
      'Cutaneous Drug Eruption',
    ],
    primary_diagnosis: 'Acute Urticaria (আমবাত / আর্টিক্যারিয়া)',
    recommended_workup: ['Detailed trigger history (food, drugs, viral infections); CBC with ESR'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Bilastin', generic_name: 'Bilastine', dosage_form: 'Tab', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7-14 Days', special_instructions: 'খাবারের ১ ঘণ্টা আগে খালি পেটে সেব্য।' },
        { brand_name: 'Caladryl Lotion', generic_name: 'Calamine Lotion', dosage_form: 'Lot', strength: 'Topical', schedule: '1+0+1', meal_timing: 'Anytime', duration: '5 Days', special_instructions: 'চুলকানির স্থানে প্রশান্তিদায়ক হিসেবে লাগান।' },
      ],
      advice: [
        'যেসব খাবারে এলার্জি (যেমন: চিংড়ি, ইলিশ, বেগুন) সাময়িকভাবে পরিহার করুন।',
        'শ্বাসকষ্ট বা ঠোঁট ফুলে যাওয়া (Angioedema) দেখা দিলে অবিলম্বে জরুরি বিভাগে যান।',
      ],
    },
    safety_warnings: ['অ্যানাফিল্যাক্সিস বা শ্বাসকষ্টের কোনো উপসর্গ দেখা দিলে বিলম্ব না করে হাসপাতালে যোগাযোগ করুন।'],
  };
}

export function getZosterProtocol() {
  return {
    observed_features: [
      'Grouped tense vesicular eruptions on an erythematous base strictly localized along a unilateral dermatome',
      'Lesions do not cross the anatomical midline; associated severe burning neuropathic pain',
    ],
    differential_diagnoses: [
      'Herpes Zoster (হারপিস জোস্টার / দাউদিয়া)',
      'Herpes Simplex Virus Infection',
      'Contact Dermatitis',
    ],
    primary_diagnosis: 'Herpes Zoster (হারপিস জোস্টার)',
    recommended_workup: ['Clinical diagnosis; Tzanck smear or VZV PCR if atypical presentation'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Acyvir', generic_name: 'Acyclovir', dosage_form: 'Tab', strength: '800 mg', schedule: '1+1+1+1+1 (দিনে ৫ বার)', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'প্রতি ৪ ঘণ্টা পরপর দিনে মোট ৫ বার টানা ৭ দিন খেতে হবে।' },
        { brand_name: 'Prebel', generic_name: 'Pregabalin', dosage_form: 'Cap', strength: '50 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '14 Days', special_instructions: 'রাতে শোয়ার আগে নার্ভের তীব্র জ্বালাপোড়া ও ব্যথায়।' },
      ],
      advice: [
        'ফোস্কাগুলো পরিষ্কার ও শুকনো রাখুন; কোনো অবস্থাতেই এগুলো ফাটাবেন না।',
        'শিশুদের বা যাদের চিকেনপক্স হয়নি তাদের থেকে কয়েক দিন আলাদা থাকুন।',
      ],
    },
    safety_warnings: ['চোখের আশেপাশে ক্ষত থাকলে (Herpes Zoster Ophthalmicus) অবিলম্বে চক্ষু বিশেষজ্ঞের পরামর্শ নিন।'],
  };
}

export function getTineaProtocol() {
  return {
    observed_features: [
      'Annular erythematous scaly plaque with active raised, vesicular border and central clearing',
      'Mild peripheral scaling with intense localized pruritus exacerbated by heat and moisture',
    ],
    differential_diagnoses: [
      'Tinea Corporis / Ringworm (দাদ)',
      'Nummular Eczema',
      'Plaque Psoriasis',
      'Contact Dermatitis',
    ],
    primary_diagnosis: 'Tinea Corporis (দাদ / Ringworm)',
    recommended_workup: ['10% KOH skin scraping examination for fungal hyphae'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Exifin', generic_name: 'Terbinafine', dosage_form: 'Tab', strength: '250 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '14-21 Days', special_instructions: 'প্রতিদিন দুপুরে খাবারের পর ১টি।' },
        { brand_name: 'Lulizol Cream', generic_name: 'Luliconazole 1% Cream', dosage_form: 'Oint', strength: '1%', schedule: '0+0+1', meal_timing: 'Anytime', duration: '14-21 Days', special_instructions: 'ক্ষতস্থানের অন্তত ১ ইঞ্চি বাইরে পর্যন্ত হালকা মেখে দিন।' },
        { brand_name: 'Alatrol', generic_name: 'Cetirizine', dosage_form: 'Tab', strength: '10 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'রাতে শোয়ার আগে চুলকানি কমাতে।' },
      ],
      advice: [
        'ক্ষতস্থানে কোনো অবস্থাতেই স্টেরয়েড মলম (যেমন: ডার্মোমিক্স, পেভিসন, ক্লোবেটাসল) লাগাবেন না।',
        'ব্যক্তিগত তোয়ালে, বিছানার চাদর ও কাপড় আলাদা রাখুন ও ফুটন্ত পানিতে ধুয়ে রোদে শুকান।',
        'স্থানটি সবসময় শুকনো ও পরিষ্কার রাখুন।',
      ],
    },
    safety_warnings: ['স্টেরয়েডযুক্ত মলম ব্যবহারের ফলে ছত্রাক ছড়িয়ে গিয়ে Tinea Incognito হতে পারে—স্টেরয়েড সম্পূর্ণ নিষিদ্ধ।'],
  };
}

export function getOnychomycosisProtocol() {
  return {
    observed_features: [
      'Significant subungual hyperkeratosis with thickened, crumbling nail plate',
      'Yellowish-brown to dark discoloration and dystrophy of toenails / fingernails',
      'Onycholysis with accumulation of subungual keratinous debris',
    ],
    differential_diagnoses: [
      'Onychomycosis (Tinea Unguium / নখের ফাঙ্গাস)',
      'Psoriatic Nail Dystrophy',
      'Lichen Planus of Nails',
      'Traumatic Onychodystrophy',
    ],
    primary_diagnosis: 'Onychomycosis (Tinea Unguium / নখের ফাঙ্গাল ইনফেকশন)',
    recommended_workup: ['Subungual clipping for KOH mount / fungal culture', 'Baseline LFT (SGPT/ALT) before systemic antifungals'],
    suggested_treatment: {
      medicines: [
        { brand_name: 'Exifin', generic_name: 'Terbinafine', dosage_form: 'Tab', strength: '250 mg', schedule: '1+0+0', meal_timing: 'After Meal', duration: '3 Months (Toenails) / 6 Weeks (Fingernails)', special_instructions: 'প্রতিদিন দুপুরে ভরা পেটে ১টি। লিভারের সমস্যা থাকলে সতর্কতা প্রয়োজন।' },
        { brand_name: 'Loceryl', generic_name: 'Amorolfine 5% Nail Lacquer', dosage_form: 'Lot', strength: '5%', schedule: 'সপ্তাহে ১ বার', meal_timing: 'Anytime', duration: '6 Months', special_instructions: 'আক্রান্ত নখ পরিষ্কার করে ঘষে সপ্তাহে ১-২ বার প্রলেপ দিন।' },
      ],
      advice: [
        'পা ও নখ সবসময় পরিষ্কার ও সম্পূর্ণ শুকনো রাখুন।',
        'সুতির মোজা ব্যবহার করুন এবং প্রতিদিন ধুয়ে শুকনো মোজা পরুন।',
        'নখ কাটার জন্য নিজের আলাদা নেইল কাটার ব্যবহার করুন।',
      ],
    },
    safety_warnings: ['দীর্ঘমেয়াদী মুখে খাওয়ার অ্যান্টিফাঙ্গাল সেবনের পূর্বে ও চলাকালীন লিভার ফাংশন টেস্ট (LFT) নজরদারিতে রাখুন।'],
  };
}

export function getNeutralSkinFallback() {
  return {
    observed_features: [
      'ছবিতে সুনির্দিষ্ট কোনো একক চর্মরোগের প্যাথলজি বা সক্রিয় ছত্রাক সংক্রমণ নিশ্চিত হয়নি।',
      'ত্বকে সামান্য পরিবর্তন বা সাধারণ অস্পষ্টতা পরিলক্ষিত হয়েছে যা সুনির্দিষ্ট ডায়াগনোসিসের জন্য আরো ক্লিনিক্যাল তথ্য দাবি করে।',
    ],
    differential_diagnoses: [
      'Non-specific Dermatitis (অনির্দিষ্ট ত্বক প্রদাহ)',
      'Mild Irritant Skin Reaction',
      'Pruritus Simplex',
    ],
    primary_diagnosis: 'Non-specific Skin Observation (অনির্দিষ্ট ত্বকের পরিবর্তন)',
    recommended_workup: ['রোগীর বিস্তারিত হিস্ট্রি, অ্যালার্জি প্রোফাইল ও ডার্মাটোস্কোপি পরীক্ষা'],
    suggested_treatment: {
      medicines: [], // Zero unnecessary medicines!
      advice: [
        'রোগ সুনির্দিষ্ট করতে রোগীর সার্বিক লক্ষণ ও শারীরিক পরীক্ষা সরাসরি বিবেচনা করুন।',
        'স্পষ্ট রোগ নির্ণয় ছাড়া অযথা কোনো অ্যান্টিফাঙ্গাল বা স্টেরয়েড মলম ব্যবহার থেকে বিরত থাকুন।',
      ],
    },
    safety_warnings: ['স্পষ্ট রোগ নির্ণয় ছাড়া আন্দাজে মলম ব্যবহারে রোগ পরিবর্তিত (Incognito) হতে পারে।'],
  };
}
