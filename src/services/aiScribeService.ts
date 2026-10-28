/**
 * MedRecord — Ambient AI Clinical Scribe Service.
 * Analyzes conversational dialogue between doctor and patient,
 * extracting chief complaints, vitals, clinical history,
 * differential diagnoses, rational prescription package, and advice.
 */
import type { PrescriptionItem } from '@/types/schema';

export interface ScribeExtractionResult {
  chief_complaints: string[];
  vitals_mentioned: Record<string, string>;
  history_notes: string[];
  differential_diagnoses: string[];
  primary_diagnosis: string;
  suggested_medicines: Array<Partial<PrescriptionItem>>;
  advice: string[];
  summary: string;
}

export async function processVoiceConsultation(
  transcript: string,
  patientContext?: { age: number; gender: string; chronic_conditions?: string[]; allergies?: string[] },
): Promise<ScribeExtractionResult> {
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

  return (await res.json()) as ScribeExtractionResult;
}
