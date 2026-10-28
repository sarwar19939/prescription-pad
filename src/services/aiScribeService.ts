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
  differential_diagnoses: string[];
  primary_diagnosis: string;
  suggested_medicines: Array<Partial<PrescriptionItem>>;
  advice: string[];
  summary: string;
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

export async function processVoiceConsultation(
  transcript: string,
  patientContext?: { age: number; gender: string; chronic_conditions?: string[]; allergies?: string[] },
): Promise<ScribeExtractionResult> {
  const localVitals = extractVitalsFromSpokenText(transcript);

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

  return result;
}
