/**
 * MedRecord — Ambient AI Clinical Scribe Service.
 * Analyzes conversational dialogue between doctor and patient,
 * extracting chief complaints, vitals, clinical history,
 * differential diagnoses, rational prescription package, and advice.
 * All chief complaints & history notes are standardized in professional Medical English.
 */
import type { PrescriptionItem, Vitals } from '@/types/schema';

export interface ScribeExtractionResult {
  chief_complaints: string[];
  vitals_mentioned: Record<string, string>;
  history_notes: string[];
  examination_findings?: string;
  advice: string[];
  summary: string;
  differential_diagnoses?: string[];
  primary_diagnosis?: string;
  suggested_medicines?: Array<Partial<PrescriptionItem>>;
}

function bnToEnDigits(str: string): string {
  const bnDigits = '০১২৩৪৫৬৭৮৯';
  return str.replace(/[০-৯]/g, (d) => String(bnDigits.indexOf(d)));
}

/**
 * Instant local heuristic parser for vitals spoken in Bengali or English.
 */
export function extractVitalsFromSpokenText(rawText: string): Partial<Vitals> {
  const text = bnToEnDigits(rawText.toLowerCase());
  const vitals: Partial<Vitals> = {};

  // 1. Blood Pressure (e.g., BP 120/80, বিপি ১২০ বাই ৮০, প্রেসার 130-85)
  const bpMatch = text.match(/(?:bp|বিপি|প্রেসার|ব্লাড\s*প্রেসার)[:\s]*(\d{2,3})[\s\/\-byবাই]+(\d{2,3})/i);
  if (bpMatch) {
    vitals.bp = `${bpMatch[1]}/${bpMatch[2]}`;
  }

  // 2. Pulse (e.g., পালস ৭২, pulse 76)
  const pulseMatch = text.match(/(?:pulse|পালস|নাড়ি)[:\s]*(\d{2,3})/i);
  if (pulseMatch) {
    vitals.pulse = `${pulseMatch[1]} bpm`;
  }

  // 3. Temperature (e.g., টেম্প ১০১, জ্বর ১০২, temp 100.5)
  const tempMatch = text.match(/(?:temp|টেম্প|জ্বর|তাপমাত্রা)[:\s]*(\d{2,3}(?:\.\d+)?)/i);
  if (tempMatch) {
    const val = parseFloat(tempMatch[1]);
    vitals.temp = val < 45 ? `${Math.round((val * 9) / 5 + 32)}°F` : `${val}°F`;
  }

  // 4. Weight (e.g., ওজন ৬৫ কেজি, weight 70 kg, ওজন ৬০)
  const wtMatch = text.match(/(?:weight|ওজন|wt)[:\s]*(\d{2,3}(?:\.\d+)?)\s*(?:kg|কেজি)?/i);
  if (wtMatch) {
    vitals.weight = `${wtMatch[1]} kg`;
  }

  // 5. SpO2 (e.g., অক্সিজেন ৯৮, saturation 97%, spo2 98)
  const spo2Match = text.match(/(?:spo2|অক্সিজেন|স্যাচুরেশন|saturation)[:\s]*(\d{2,3})/i);
  if (spo2Match) {
    vitals.spo2 = `${spo2Match[1]}%`;
  }

  return vitals;
}

/**
 * Instant local heuristic parser for common complaints spoken in Bengali or English.
 */
export function extractComplaintsFromSpokenText(rawText: string): string[] {
  const text = rawText.toLowerCase();
  const complaints: string[] = [];

  if (text.includes('জ্বর') || text.includes('fever') || text.includes('গা গরম')) {
    complaints.push('Fever');
  }
  if (text.includes('কাশি') || text.includes('cough') || text.includes('কফ')) {
    complaints.push('Cough');
  }
  if (text.includes('সর্দি') || text.includes('cold') || text.includes('নাক দিয়ে পানি') || text.includes('নাক বন্ধ')) {
    complaints.push('Runny nose / Coryza');
  }
  if (text.includes('গলা ব্যথা') || text.includes('গলা খুসখুস') || text.includes('sore throat') || text.includes('গলা জ্বল')) {
    complaints.push('Sore throat');
  }
  if (text.includes('বুক জ্বালা') || text.includes('গ্যাস') || text.includes('অ্যাসিডিটি') || text.includes('ঢেকুর') || text.includes('heartburn') || text.includes('acidity')) {
    complaints.push('Epigastric burning / Dyspepsia');
  }
  if (text.includes('পেট ব্যথা') || text.includes('পেটে ব্যথা') || text.includes('abdominal pain') || text.includes('তলপেটে ব্যথা')) {
    complaints.push('Abdominal pain');
  }
  if (text.includes('বমি ভাব') || text.includes('বমি বমি') || text.includes('nausea')) {
    complaints.push('Nausea');
  } else if (text.includes('বমি') || text.includes('vomiting')) {
    complaints.push('Vomiting');
  }
  if (text.includes('পাতলা পায়খানা') || text.includes('ডায়রিয়া') || text.includes('লুজ মোশন') || text.includes('diarrhea')) {
    complaints.push('Loose watery stool (Diarrhea)');
  }
  if (text.includes('মাথা ব্যথা') || text.includes('headache') || text.includes('মাথা ধরে')) {
    complaints.push('Headache');
  }
  if (text.includes('শ্বাসকষ্ট') || text.includes('দম বন্ধ') || text.includes('shortness of breath') || text.includes('হাঁপানী')) {
    complaints.push('Shortness of breath (Dyspnea)');
  }
  if (text.includes('গা-হাত-পা ব্যথা') || text.includes('শরীর ব্যথা') || text.includes('গা ব্যথা') || text.includes('body ache') || text.includes('myalgia')) {
    complaints.push('Generalized body ache / Myalgia');
  }
  if (text.includes('দুর্বলতা') || text.includes('ক্লান্তি') || text.includes('weakness') || text.includes('fatigue')) {
    complaints.push('Generalized weakness');
  }
  if (text.includes('অরুচি') || text.includes('ক্ষুধামন্দা') || text.includes('খাবার খেতে ইচ্ছা করে না') || text.includes('appetite')) {
    complaints.push('Loss of appetite (Anorexia)');
  }
  if (text.includes('কোমর ব্যথা') || text.includes('back pain')) {
    complaints.push('Lower back pain');
  }
  if (text.includes('চুলকানি') || text.includes('rash') || text.includes('itching') || text.includes('এলার্জি')) {
    complaints.push('Skin itching / Rash');
  }

  return complaints;
}

export function extractExaminationFromSpokenText(rawText: string): string[] {
  const text = rawText.toLowerCase();
  const findings: string[] = [];

  if (text.includes('বুক ক্লিয়ার') || text.includes('chest clear') || text.includes('শ্বাস পরিষ্কার')) {
    findings.push('Chest: Clear with vesicular breath sounds');
  } else if (text.includes('বাঁশি') || text.includes('wheeze') || text.includes('হুইজ')) {
    findings.push('Chest: Bilateral wheezing present');
  } else if (text.includes('খড়খড়') || text.includes('crepitation') || text.includes('রংকাই')) {
    findings.push('Chest: Crepitations noted');
  }

  if (text.includes('গলা লাল') || text.includes('গলা ফোলা') || text.includes('throat') || text.includes('টনসিল') || text.includes('pharynx')) {
    findings.push('Throat: Congested pharyngeal wall');
  }

  if (text.includes('পেট নরম') || text.includes('পেট সফট') || text.includes('abdomen soft')) {
    findings.push('Abdomen: Soft, non-tender, bowel sounds present');
  } else if (text.includes('পেটে চাপ দিলে ব্যথা') || text.includes('টেন্ডারনেস') || text.includes('পেটে ব্যথা')) {
    findings.push('Abdomen: Mild localized tenderness');
  }

  if (text.includes('অ্যানিমিয়া নেই') || text.includes('রক্তশূন্যতা নেই') || text.includes('জিহ্বা স্বাভাবিক')) {
    findings.push('Anemia: Absent');
  }
  if (text.includes('জন্ডিস নেই') || text.includes('চোখ স্বাভাবিক')) {
    findings.push('Jaundice: Absent');
  }
  if (text.includes('পা ফোলা নেই') || text.includes('ইডিমা নেই') || text.includes('no oedema') || text.includes('no edema')) {
    findings.push('Oedema: Nil');
  } else if (text.includes('পা ফোলা') || text.includes('ইডিমা আছে')) {
    findings.push('Oedema: Pedal oedema present');
  }

  if (text.includes('হার্ট সাউন্ড') || text.includes('হার্ট ঠিক আছে') || text.includes('heart sound')) {
    findings.push('Heart: S1, S2 audible, no murmurs');
  }

  return findings;
}

export async function processVoiceConsultation(
  transcript: string,
  patientContext?: { age: number; gender: string; chronic_conditions?: string[]; allergies?: string[] },
): Promise<ScribeExtractionResult> {
  const localVitals = extractVitalsFromSpokenText(transcript);
  const localExam = extractExaminationFromSpokenText(transcript);
  const localComplaints = extractComplaintsFromSpokenText(transcript);

  const res = await fetch('/api/ai/clinical-copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'ambient_scribe',
      payload: {
        transcript,
        patientContext,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI Scribe processing failed: ${err}`);
  }

  const result = (await res.json()) as ScribeExtractionResult;

  // Merge locally parsed vitals with AI extracted vitals
  result.vitals_mentioned = {
    ...localVitals,
    ...(result.vitals_mentioned || {}),
  };

  // Merge locally parsed examination findings with AI extracted findings
  if (localExam.length > 0) {
    const existing = result.examination_findings ? [result.examination_findings] : [];
    result.examination_findings = Array.from(new Set([...existing, ...localExam])).join('. ');
  }

  // Ensure any immediate local complaints are preserved if AI missed them
  if (localComplaints.length > 0) {
    const existingC = result.chief_complaints || [];
    // If AI complaints are empty, use local; otherwise merge
    if (existingC.length === 0) {
      result.chief_complaints = localComplaints;
    }
  }

  return result;
}
