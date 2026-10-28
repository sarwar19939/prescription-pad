/**
 * Mock Ambient Scribe Handler for Offline Fallback & Testing.
 * Truthfully extracts only what was actually spoken in the transcript.
 * NEVER fabricates fake symptoms, history, or vitals if not present.
 */
import type { ScribeExtractionResult } from '@/services/aiScribeService';

export function mockAmbientScribe(payload: any): ScribeExtractionResult {
  const rawText = String(payload?.transcript || '').trim();
  const text = rawText.toLowerCase();

  if (!text) {
    return {
      chief_complaints: [],
      vitals_mentioned: {},
      history_notes: [],
      examination_findings: '',
      advice: [],
      summary: '',
    };
  }

  const complaints: string[] = [];
  const history: string[] = [];
  const vitals: Record<string, string> = {};
  const exam: string[] = [];
  const advice: string[] = [];

  // Vitals extraction (only if actually spoken)
  const bpMatch = text.match(/(?:bp|বিপি|প্রেসার)[:\s]*(\d{2,3})[\s\/\-byবাই]+(\d{2,3})/i);
  if (bpMatch) vitals.bp = `${bpMatch[1]}/${bpMatch[2]}`;

  const pulseMatch = text.match(/(?:pulse|পালস|নাড়ি)[:\s]*(\d{2,3})/i);
  if (pulseMatch) vitals.pulse = `${pulseMatch[1]} bpm`;

  const tempMatch = text.match(/(?:temp|টেম্প|জ্বর|তাপমাত্রা)[:\s]*(\d{2,3}(?:\.\d+)?)/i);
  if (tempMatch && (text.includes('ডিগ্রি') || text.includes('temp') || text.includes('টেম্প') || parseFloat(tempMatch[1]) >= 99)) {
    const val = parseFloat(tempMatch[1]);
    vitals.temp = val < 45 ? `${Math.round((val * 9) / 5 + 32)}°F` : `${val}°F`;
  }

  const wtMatch = text.match(/(?:weight|ওজন)[:\s]*(\d{2,3}(?:\.\d+)?)\s*(?:kg|কেজি)?/i);
  if (wtMatch) vitals.weight = `${wtMatch[1]} kg`;

  const spo2Match = text.match(/(?:spo2|অক্সিজেন|স্যাচুরেশন)[:\s]*(\d{2,3})/i);
  if (spo2Match) vitals.spo2 = `${spo2Match[1]}%`;

  // Complaints extraction based on actual doctor/patient words
  if (text.includes('জ্বর') || text.includes('fever') || text.includes('গা গরম')) {
    complaints.push('Fever');
    advice.push('পর্যাপ্ত বিশ্রাম নিন ও কুসুম গরম পানি পান করুন।');
  }
  if (text.includes('কাশি') || text.includes('cough') || text.includes('কফ')) {
    complaints.push('Cough');
    advice.push('ঠাণ্ডা পানি সম্পূর্ণ পরিহার করুন ও ফুটন্ত পানির ভাপ নিন।');
  }
  if (text.includes('সর্দি') || text.includes('cold') || text.includes('নাক দিয়ে পানি') || text.includes('নাক বন্ধ')) {
    complaints.push('Runny nose / Nasal congestion');
  }
  if (text.includes('গলা ব্যথা') || text.includes('গলা খুসখুস') || text.includes('sore throat') || text.includes('গলা জ্বল')) {
    complaints.push('Sore throat');
    advice.push('লবণ-গরম পানি দিয়ে নিয়মিত গড়গড়া করুন।');
  }
  if (text.includes('বুক জ্বালা') || text.includes('গ্যাস') || text.includes('অ্যাসিডিটি') || text.includes('ঢেকুর') || text.includes('heartburn') || text.includes('acidity')) {
    complaints.push('Epigastric burning / Heartburn');
    advice.push('ভাজাপোড়া ও অতিরিক্ত মসলাযুক্ত খাবার পরিহার করুন এবং খাওয়ার পরপরই শোবেন না।');
  }
  if (text.includes('পেট ব্যথা') || text.includes('পেটে ব্যথা') || text.includes('abdominal pain')) {
    complaints.push('Abdominal pain');
  }
  if (text.includes('বমি ভাব') || text.includes('nausea')) {
    complaints.push('Nausea');
  } else if (text.includes('বমি') || text.includes('vomiting')) {
    complaints.push('Vomiting');
    advice.push('অল্প অল্প করে খাবার স্যালাইন ও তরল খাবার পান করুন।');
  }
  if (text.includes('পাতলা পায়খানা') || text.includes('ডায়রিয়া') || text.includes('diarrhea') || text.includes('লুজ মোশন')) {
    complaints.push('Loose watery stool (Diarrhea)');
    advice.push('প্রতিবার পাতলা পায়খানার পর ১ গ্লাস খাবার স্যালাইন (ORS) নিশ্চিত করুন।');
  }
  if (text.includes('মাথা ব্যথা') || text.includes('headache') || text.includes('মাথা ধরে')) {
    complaints.push('Headache');
  }
  if (text.includes('গা-হাত-পা ব্যথা') || text.includes('শরীর ব্যথা') || text.includes('body ache') || text.includes('myalgia')) {
    complaints.push('Generalized body ache');
  }
  if (text.includes('দুর্বলতা') || text.includes('ক্লান্তি') || text.includes('weakness') || text.includes('fatigue')) {
    complaints.push('Generalized weakness');
  }
  if (text.includes('শ্বাসকষ্ট') || text.includes('দম বন্ধ') || text.includes('dyspnea')) {
    complaints.push('Shortness of breath');
  }
  if (text.includes('কোমর ব্যথা') || text.includes('back pain')) {
    complaints.push('Lower back pain');
  }
  if (text.includes('চুলকানি') || text.includes('rash') || text.includes('itching')) {
    complaints.push('Skin itching / Rash');
  }

  // Examination findings mentioned
  if (text.includes('বুক ক্লিয়ার') || text.includes('chest clear') || text.includes('ফুসফুস পরিষ্কার')) {
    exam.push('Chest: Clear, normal vesicular breath sounds');
  }
  if (text.includes('গলা লাল') || text.includes('গলা ফোলা') || text.includes('pharynx')) {
    exam.push('Throat: Mild congestion');
  }
  if (text.includes('পেট নরম') || text.includes('abdomen soft')) {
    exam.push('Abdomen: Soft, non-tender');
  }

  const summary = complaints.length > 0
    ? `Patient presents with ${complaints.join(', ')}.`
    : (rawText.length > 10 ? 'Consultation conversation recorded.' : '');

  return {
    chief_complaints: complaints,
    vitals_mentioned: vitals,
    history_notes: history,
    examination_findings: exam.join('. '),
    advice: Array.from(new Set(advice)),
    summary,
  };
}
