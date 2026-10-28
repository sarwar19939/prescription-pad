/**
 * Mock Ambient Scribe Handler for Offline Fallback & Testing.
 */
import type { ScribeExtractionResult } from '@/services/aiScribeService';

export function mockAmbientScribe(payload: any): ScribeExtractionResult {
  const text = (payload?.transcript || '').toLowerCase();

  const isFever = text.includes('জ্বর') || text.includes('fever') || text.includes('গরম');
  const isCough = text.includes('কাশি') || text.includes('cough') || text.includes('কফ');
  const isGastric = text.includes('গ্যাস') || text.includes('বুক জ্বালা') || text.includes('gastric') || text.includes('acidity');
  const isPain = text.includes('ব্যথা') || text.includes('কোমর') || text.includes('pain') || text.includes('হাত-পা');

  if (isFever && isCough) {
    return {
      chief_complaints: ['Fever (জ্বর) - ৩ দিন', 'Dry cough (শুকনো কাশি)', 'Body ache (গা-ব্যথা)'],
      vitals_mentioned: { temp: '101°F' },
      history_notes: ['কোনো পূর্ববর্তী শ্বাসকষ্টের ইতিহাস নেই'],
      differential_diagnoses: [
        'Acute Viral Upper Respiratory Infection (ভাইরাস জ্বর ও সর্দি-কাশি)',
        'Acute Pharyngitis',
        'Seasonal Influenza',
      ],
      primary_diagnosis: 'Acute Viral URTI (সর্দি-কাশি ও ভাইরাল জ্বর)',
      suggested_medicines: [
        { brand_name: 'Napa Extend', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '665 mg', schedule: '1+1+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'জ্বর বা শরীর ব্যথায় খাবারের পর সেব্য।' },
        { brand_name: 'Maxpro', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '7 Days', special_instructions: 'খাবারের ২০ মিনিট পূর্বে খালি পেটে।' },
        { brand_name: 'Montene-FX', generic_name: 'Montelukast + Fexofenadine', dosage_form: 'Tab', strength: '10/120 mg', schedule: '0+0+1', meal_timing: 'After Meal', duration: '10 Days', special_instructions: 'রাতে শোয়ার আগে সেব্য।' },
        { brand_name: 'Ambrox Syrup', generic_name: 'Ambroxol Hydrochloride', dosage_form: 'Syr', strength: '15 mg/5 ml', schedule: '2 spoons TDS', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'কাশি কমাতে খাবারের পর দিনে ৩ বার ২ চামচ করে।' },
      ],
      advice: [
        'কুসুম গরম পানিতে লেবু ও মধু মিশিয়ে দিনে ২-৩ বার পান করুন।',
        'লবণ-গরম পানি দিয়ে নিয়মিত গড়গড়া করুন ও ফুটন্ত পানির ভাপ নিন।',
        'ঠাণ্ডা পানি ও আইসক্রিম সম্পূর্ণ পরিহার করুন।',
        'জ্বর ৩ দিনের বেশি স্থায়ী হলে ডেঙ্গু ও সিবিসি টেস্ট করান।',
      ],
      summary: 'রোগীর ৩ দিনের তীব্র জ্বর ও কাশির ইতিহাস রয়েছে। লক্ষণভিত্তিক চিকিৎসা ও বিশ্রাম নির্দেশিত।',
    };
  }

  if (isGastric) {
    return {
      chief_complaints: ['Heartburn & Acidity (বুক জ্বালাপোড়া)', 'Upper abdominal fullness (পেট ফাঁপা)'],
      vitals_mentioned: {},
      history_notes: ['অতিরিক্ত তেল-ঝাল খাওয়ার ইতিহাস'],
      differential_diagnoses: [
        'Gastroesophageal Reflux Disease (GERD)',
        'Peptic Ulcer Disease (PUD)',
        'Non-Ulcer Dyspepsia',
      ],
      primary_diagnosis: 'GERD & Peptic Dyspepsia (গ্যাস্ট্রিক ও বুকজ্বালা)',
      suggested_medicines: [
        { brand_name: 'Sergel', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'খাবারের ৩০ মিনিট পূর্বে খালি পেটে।' },
        { brand_name: 'Motigut', generic_name: 'Domperidone', dosage_form: 'Tab', strength: '10 mg', schedule: '1+1+1', meal_timing: 'Before Meal', duration: '10 Days', special_instructions: 'খাবারের ১৫ মিনিট পূর্বে সেব্য।' },
        { brand_name: 'Entacyd Plus', generic_name: 'Magaldrate + Simethicone', dosage_form: 'Syr', strength: '200 ml', schedule: '2 spoons TDS', meal_timing: 'After Meal', duration: '7 Days', special_instructions: 'খাবারের ১ ঘণ্টা পর এবং রাতে শোয়ার সময় ২ চামচ।' },
      ],
      advice: [
        'খাওয়ার পরপরই শুয়ে পড়বেন না, অন্তত ২ ঘণ্টা পর ঘুমাতে যান।',
        'চা, কফি, ভাজাপোড়া ও অতিরিক্ত মসলাযুক্ত খাবার বর্জন করুন।',
        'রাতে ঘুমানোর সময় মাথার দিক সামান্য উঁচু রাখুন।',
      ],
      summary: 'রোগীর প্রধান সমস্যা বুক জ্বালাপোড়া ও এসিডিটি। ট্রিপল গ্যাস্ট্রিক প্রটেকশন নির্দেশিত।',
    };
  }

  // Default Consultation Fallback
  return {
    chief_complaints: ['General malaise (গা-মেসমেস ও দুর্বলতা)', 'Body ache (শরীর ব্যথা)'],
    vitals_mentioned: {},
    history_notes: [],
    differential_diagnoses: [
      'General Malaise & Fatigue',
      'Mild Tension Syndrome',
    ],
    primary_diagnosis: 'General Malaise (ক্লান্তি ও দুর্বলতা)',
    suggested_medicines: [
      { brand_name: 'Fast', generic_name: 'Paracetamol', dosage_form: 'Tab', strength: '500 mg', schedule: '1+0+1', meal_timing: 'After Meal', duration: '5 Days', special_instructions: 'ব্যথা বেশি অনুভূত হলে খাবারের পর।' },
      { brand_name: 'Maxpro', generic_name: 'Esomeprazole', dosage_form: 'Cap', strength: '20 mg', schedule: '1+0+1', meal_timing: 'Before Meal', duration: '14 Days', special_instructions: 'খাবারের ২০ মিনিট পূর্বে খালি পেটে।' },
      { brand_name: 'Bextram Gold', generic_name: 'Multivitamin + Multimineral', dosage_form: 'Tab', strength: 'Standard', schedule: '0+0+1', meal_timing: 'After Meal', duration: '30 Days', special_instructions: 'রাতে শোয়ার আগে ১টি করে।' },
    ],
    advice: [
      'সময়মতো পুষ্টিকর খাবার গ্রহণ করুন ও পর্যাপ্ত পানি পান করুন।',
      'প্রতিদিন অন্তত ৭-৮ ঘণ্টা নিয়মিত ঘুমানোর অভ্যাস করুন।',
    ],
    summary: 'কথোপকথন থেকে ক্লান্তি ও শরীর ব্যথার লক্ষণ পাওয়া গেছে। সহায়ক চিকিৎসা নির্দেশিত।',
  };
}
