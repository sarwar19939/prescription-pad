/**
 * Symptom Qualifiers and Modifiers for Clinical Complaints & History.
 * Modeled after Bangladesh prescription protocols (Bissoy Rx / Prescriply).
 * Allows 1-click selection of duration, frequency, location, and characteristics.
 */

export interface SymptomQualifierConfig {
  banglaTitle: string;
  englishTitle: string;
  frequencies?: { label: string; value: string }[];
  durations: { label: string; value: string }[];
  characters?: { label: string; value: string }[];
  locations?: { label: string; value: string }[];
  formatString: (options: {
    duration?: string;
    frequency?: string;
    character?: string;
    location?: string;
  }) => string;
}

export const UNIVERSAL_DURATIONS = [
  { label: '১ দিন', value: '1 day' },
  { label: '২ দিন', value: '2 days' },
  { label: '৩ দিন', value: '3 days' },
  { label: '৪ দিন', value: '4 days' },
  { label: '৫ দিন', value: '5 days' },
  { label: '৭ দিন', value: '7 days' },
  { label: '১০ দিন', value: '10 days' },
  { label: '১৫ দিন', value: '15 days' },
  { label: '১ মাস', value: '1 month' },
  { label: 'দীর্ঘদিন', value: 'several months' },
];

export const SYMPTOM_QUALIFIER_MAP: Record<string, SymptomQualifierConfig> = {
  fever: {
    banglaTitle: 'জ্বর (Fever)',
    englishTitle: 'Fever',
    durations: [
      { label: '১ দিন', value: 'for 1 day' },
      { label: '২ দিন', value: 'for 2 days' },
      { label: '৩ দিন', value: 'for 3 days' },
      { label: '৪ দিন', value: 'for 4 days' },
      { label: '৫ দিন', value: 'for 5 days' },
      { label: '৭ দিন', value: 'for 7 days' },
      { label: '১০ দিন', value: 'for 10 days' },
      { label: '১৫ দিন', value: 'for 15 days' },
      { label: '১ মাস', value: 'for 1 month' },
    ],
    characters: [
      { label: 'তীব্র জ্বর', value: 'High grade' },
      { label: 'মৃদু জ্বর', value: 'Low grade' },
      { label: 'কাঁপুনি দিয়ে', value: 'With chills & rigor' },
      { label: 'থেমে থেমে', value: 'Intermittent' },
      { label: 'টানা জ্বর', value: 'Continuous' },
    ],
    formatString: ({ duration, character }) => {
      const parts: string[] = [];
      if (character) parts.push(character);
      parts.push('fever');
      if (duration) parts.push(`- ${duration}`);
      const res = parts.join(' ');
      return res.charAt(0).toUpperCase() + res.slice(1);
    },
  },

  vomiting: {
    banglaTitle: 'বমি (Vomiting)',
    englishTitle: 'Vomiting',
    frequencies: [
      { label: '১-২ বার', value: '1-2 times' },
      { label: '৩-৪ বার', value: '3-4 times' },
      { label: '৫-৬ বার', value: '5-6 times' },
      { label: '৮-১০ বার', value: '8-10 times' },
      { label: '১০+ বার', value: '10+ times' },
      { label: 'ঘন ঘন বমি', value: 'Multiple times' },
    ],
    durations: [
      { label: 'আজ সকাল থেকে', value: 'since morning' },
      { label: '১ দিন ধরে', value: 'for 1 day' },
      { label: '২ দিন ধরে', value: 'for 2 days' },
      { label: '৩ দিন ধরে', value: 'for 3 days' },
    ],
    characters: [
      { label: 'পানির মতো', value: 'Watery' },
      { label: 'খাওয়ার পর পরই', value: 'Post-meal' },
      { label: 'খাদ্য উপাদানসহ', value: 'Food particles' },
      { label: 'হলুদাভ পিত্তবমি', value: 'Bilious' },
    ],
    formatString: ({ frequency, duration, character }) => {
      let out = 'Vomiting';
      const modifiers = [frequency, character].filter(Boolean).join(', ');
      if (modifiers) out += ` (${modifiers})`;
      if (duration) out += ` - ${duration}`;
      return out;
    },
  },

  loose_motion: {
    banglaTitle: 'পাতলা পায়খানা (Diarrhea / Loose Motion)',
    englishTitle: 'Loose motion',
    frequencies: [
      { label: '৩-৪ বার/দিন', value: '3-4 times/day' },
      { label: '৫-৬ বার/দিন', value: '5-6 times/day' },
      { label: '৮-১০ বার/দিন', value: '8-10 times/day' },
      { label: '১০+ বার/দিন', value: '>10 times/day' },
      { label: 'ঘন ঘন পাতলা পায়খানা', value: 'Frequent' },
    ],
    durations: [
      { label: 'আজ সকাল থেকে', value: 'since morning' },
      { label: '১ দিন', value: 'for 1 day' },
      { label: '২ দিন', value: 'for 2 days' },
      { label: '৩ দিন', value: 'for 3 days' },
      { label: '৫ দিন', value: 'for 5 days' },
      { label: '১ সপ্তাহ', value: 'for 1 week' },
    ],
    characters: [
      { label: 'পানির মতো', value: 'Watery' },
      { label: 'আমযুক্ত (Mucus)', value: 'With mucus' },
      { label: 'রক্তযুক্ত (Dysentery)', value: 'With blood' },
      { label: 'চাল ধোয়া পানির মতো', value: 'Rice-watery' },
    ],
    formatString: ({ frequency, duration, character }) => {
      let out = 'Loose motion';
      const modifiers = [frequency, character].filter(Boolean).join(', ');
      if (modifiers) out += ` (${modifiers})`;
      if (duration) out += ` - ${duration}`;
      return out;
    },
  },

  abdominal_pain: {
    banglaTitle: 'পেটে ব্যথা (Abdominal Pain)',
    englishTitle: 'Abdominal pain',
    durations: [
      { label: 'কয়েক ঘণ্টা ধরে', value: 'for few hours' },
      { label: '১ দিন', value: 'for 1 day' },
      { label: '২ দিন', value: 'for 2 days' },
      { label: '৩ দিন', value: 'for 3 days' },
      { label: '৫ দিন', value: 'for 5 days' },
      { label: '১ সপ্তাহ', value: 'for 1 week' },
      { label: '১ মাস ধরে', value: 'for 1 month' },
    ],
    locations: [
      { label: 'বুকের নিচে / গ্যাস্ট্রিক', value: 'Epigastric' },
      { label: 'নাভির চারদিকে', value: 'Umbilical' },
      { label: 'তলপেটে ব্যথা', value: 'Lower abdomen' },
      { label: 'ডান পাশে (RIF/অ্যাপেন্ডিক্স)', value: 'Right iliac fossa' },
      { label: 'বাম পাশে', value: 'Left iliac fossa' },
      { label: 'পুরো পেটে', value: 'Generalized' },
    ],
    characters: [
      { label: 'মোচড়ানো ব্যথা', value: 'Colicky' },
      { label: 'জ্বালাপোড়া ব্যথা', value: 'Burning' },
      { label: 'চাপা ব্যথা', value: 'Dull aching' },
      { label: 'খাওয়ার পর বাড়ে', value: 'Post-prandial' },
      { label: 'খালি পেটে বাড়ে', value: 'Empty stomach' },
    ],
    formatString: ({ location, character, duration }) => {
      let out = 'Abdominal pain';
      const modifiers = [location, character].filter(Boolean).join(', ');
      if (modifiers) out += ` (${modifiers})`;
      if (duration) out += ` - ${duration}`;
      return out;
    },
  },

  cough: {
    banglaTitle: 'কাশি (Cough)',
    englishTitle: 'Cough',
    durations: [
      { label: '২ দিন', value: 'for 2 days' },
      { label: '৩ দিন', value: 'for 3 days' },
      { label: '৫ দিন', value: 'for 5 days' },
      { label: '৭ দিন', value: 'for 7 days' },
      { label: '১০ দিন', value: 'for 10 days' },
      { label: '২ সপ্তাহ', value: 'for 2 weeks' },
      { label: '১ মাস', value: 'for 1 month' },
    ],
    characters: [
      { label: 'শুকনো কাশি', value: 'Dry cough' },
      { label: 'কফযুক্ত কাশি', value: 'Productive with sputum' },
      { label: 'হলুদাভ কফ', value: 'Yellowish sputum' },
      { label: 'রাতে বাড়ে', value: 'Nocturnal cough' },
      { label: 'শ্বাসকষ্ট সহ', value: 'With shortness of breath' },
    ],
    formatString: ({ character, duration }) => {
      const base = character || 'Cough';
      return duration ? `${base} - ${duration}` : base;
    },
  },

  headache: {
    banglaTitle: 'মাথাব্যথা (Headache)',
    englishTitle: 'Headache',
    durations: [
      { label: '১ দিন', value: 'for 1 day' },
      { label: '২ দিন', value: 'for 2 days' },
      { label: '৩ দিন', value: 'for 3 days' },
      { label: '৫ দিন', value: 'for 5 days' },
      { label: '১ সপ্তাহ', value: 'for 1 week' },
      { label: 'দীর্ঘদিন', value: 'Chronic' },
    ],
    characters: [
      { label: 'একপাশে তীব্র (মাইগ্রেন)', value: 'Hemicrania / Migraine' },
      { label: 'কপাল ও মাথা ভারী', value: 'Tension / Heavy' },
      { label: 'মাথার পেছনে', value: 'Occipital' },
      { label: 'দপদপ করা ব্যথা', value: 'Throbbing' },
    ],
    formatString: ({ character, duration }) => {
      let out = 'Headache';
      if (character) out += ` (${character})`;
      if (duration) out += ` - ${duration}`;
      return out;
    },
  },

  burning_micturition: {
    banglaTitle: 'প্রস্রাবে জ্বালাপোড়া (Dysuria)',
    englishTitle: 'Burning micturition',
    durations: [
      { label: '১ দিন', value: 'for 1 day' },
      { label: '২ দিন', value: 'for 2 days' },
      { label: '৩ দিন', value: 'for 3 days' },
      { label: '৫ দিন', value: 'for 5 days' },
      { label: '৭ দিন', value: 'for 7 days' },
      { label: '১০ দিন', value: 'for 10 days' },
    ],
    characters: [
      { label: 'তীব্র জ্বালাপোড়া', value: 'Severe' },
      { label: 'ঘন ঘন প্রস্রাব', value: 'Increased frequency' },
      { label: 'ফোঁটা ফোঁটা প্রস্রাব', value: 'Hesitancy' },
      { label: 'তলপেটে ব্যথা সহ', value: 'With suprapubic pain' },
    ],
    formatString: ({ character, duration }) => {
      let out = 'Burning micturition';
      if (character) out += ` (${character})`;
      if (duration) out += ` - ${duration}`;
      return out;
    },
  },
};

/**
 * Match a symptom string (e.g. "Fever", "Vomiting", "Loose motion", "Diarrhea", "জ্বর")
 * to the appropriate qualifier configuration key.
 */
export function getQualifierKey(symptom: string): string | null {
  const s = symptom.toLowerCase().trim();
  if (s.includes('fever') || s.includes('জ্বর') || s.includes('febrile')) return 'fever';
  if (s.includes('vomit') || s.includes('বমি') || s.includes('nausea')) return 'vomiting';
  if (
    s.includes('loose') ||
    s.includes('diarrhea') ||
    s.includes('পাতলা') ||
    s.includes('motion') ||
    s.includes('stool')
  ) {
    return 'loose_motion';
  }
  if (s.includes('abdomen') || s.includes('abdominal') || s.includes('পেট') || s.includes('belly')) {
    return 'abdominal_pain';
  }
  if (s.includes('cough') || s.includes('কাশি')) return 'cough';
  if (s.includes('headache') || s.includes('মাথা')) return 'headache';
  if (
    s.includes('micturition') ||
    s.includes('dysuria') ||
    s.includes('urine') ||
    s.includes('প্রস্রাব')
  ) {
    return 'burning_micturition';
  }
  return null;
}
