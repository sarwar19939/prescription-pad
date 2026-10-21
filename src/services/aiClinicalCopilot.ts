/**
 * MedRecord — AI Clinical Decision Support & Lab Analyzer Service Layer.
 *
 * Supports two backends:
 * 1. Cloud Provider: /api/ai/clinical-copilot (server-side Gemini / OpenAI)
 * 2. Local Offline Provider: Direct fetch to Ollama (http://localhost:11434/api/generate)
 *
 * Strict Privacy Rule: NEVER send PII (Patient Name, Phone, National ID) to Cloud AI.
 * All PII is stripped client-side prior to prompt serialization.
 */
import type { Encounter, InvestigationReport, Patient } from '@/types/schema';

export type AIProvider = 'cloud' | 'local';

export interface LabAnalysisResult {
  test_name: string;
  extracted_metrics: Record<string, string | number>;
  abnormality_flags: string[];
  ai_summary: string;
}

export interface SuggestedMedication {
  generic_name: string;
  suggested_brand: string;
  strength: string;
  schedule: string;
  duration: string;
  rationale: string;
}

export interface ClinicalTrackResult {
  differential_diagnoses: string[];
  suggested_medications: SuggestedMedication[];
  recommended_investigations: string[];
  safety_warnings: string[];
}

export interface AnonymizedPatientContext {
  age: number;
  gender: string;
  blood_group?: string;
  chronic_conditions: string[];
  allergies: string[];
  medical_surgical_history?: string;
  current_complaints: string[];
  current_vitals: Record<string, string>;
  past_encounters_summary: Array<{
    date: string;
    complaints: string[];
    diagnosis: string[];
    findings?: string;
  }>;
  latest_labs_summary: Array<{
    date: string;
    test_name: string;
    metrics: Record<string, string | number>;
    abnormality_flags: string[];
  }>;
}

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_OLLAMA_MODEL = 'llama3.2';

/**
 * Sanitizes patient data by stripping all identifiable PII.
 * Conforms to strict clinical data governance.
 */
export function sanitizePatientContext(
  patient: Patient,
  pastEncounters: Encounter[] = [],
  latestLabs: InvestigationReport[] = [],
  currentComplaints: string[] = [],
  currentVitals: Record<string, string> = {},
): AnonymizedPatientContext {
  return {
    age: patient.age,
    gender: patient.gender,
    blood_group: patient.blood_group,
    chronic_conditions: [...patient.chronic_conditions],
    allergies: [...patient.allergies],
    medical_surgical_history: patient.medical_surgical_history || undefined,
    current_complaints: [...currentComplaints],
    current_vitals: { ...currentVitals },
    past_encounters_summary: pastEncounters.map((e) => ({
      date: e.visit_date,
      complaints: e.chief_complaints,
      diagnosis: e.diagnosis,
      findings: e.clinical_findings || undefined,
    })),
    latest_labs_summary: latestLabs.map((l) => ({
      date: l.report_date,
      test_name: l.test_name,
      metrics: l.extracted_metrics,
      abnormality_flags: l.abnormality_flags,
    })),
  };
}

/**
 * Analyzes an image (Base64) or OCR/text content of a lab report.
 */
export async function analyzeLabReport(
  imageBase64OrText: string,
  options?: {
    provider?: AIProvider;
    mimeType?: string;
    ollamaBaseUrl?: string;
  },
): Promise<LabAnalysisResult> {
  const provider = options?.provider ?? (navigator.onLine ? 'cloud' : 'local');

  if (provider === 'local') {
    return analyzeWithOllama(imageBase64OrText, options?.ollamaBaseUrl);
  }

  const res = await fetch('/api/ai/clinical-copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'analyze_lab',
      payload: {
        content: imageBase64OrText,
        mimeType: options?.mimeType || 'text/plain',
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cloud AI analysis failed (${res.status}): ${errorText}`);
  }

  return res.json() as Promise<LabAnalysisResult>;
}

/**
 * Suggests clinical differential diagnoses, tracks, investigations and medications.
 * Guarantees PII is stripped before sending to cloud.
 */
export async function suggestClinicalTrack(
  patient: Patient,
  pastEncounters: Encounter[],
  latestLabs: InvestigationReport[],
  currentComplaints: string[],
  currentVitals: Record<string, string>,
  options?: {
    provider?: AIProvider;
    ollamaBaseUrl?: string;
  },
): Promise<ClinicalTrackResult> {
  const anonymized = sanitizePatientContext(
    patient,
    pastEncounters,
    latestLabs,
    currentComplaints,
    currentVitals,
  );

  const provider = options?.provider ?? (navigator.onLine ? 'cloud' : 'local');

  if (provider === 'local') {
    return suggestTrackWithOllama(anonymized, options?.ollamaBaseUrl);
  }

  const res = await fetch('/api/ai/clinical-copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'suggest_track',
      payload: anonymized,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cloud AI clinical track failed (${res.status}): ${errorText}`);
  }

  return res.json() as Promise<ClinicalTrackResult>;
}

/* ------------------------------------------------------------------ */
/* Local Ollama Implementation                                        */
/* ------------------------------------------------------------------ */

async function callOllama(
  prompt: string,
  baseUrl: string = DEFAULT_OLLAMA_URL,
): Promise<string> {
  const res = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: DEFAULT_OLLAMA_MODEL,
      prompt,
      stream: false,
      format: 'json',
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Ollama request failed (${res.status}). Ensure Ollama is running at ${baseUrl}.`,
    );
  }

  const data = (await res.json()) as { response?: string };
  return data.response ?? '{}';
}

async function analyzeWithOllama(
  content: string,
  baseUrl?: string,
): Promise<LabAnalysisResult> {
  const prompt = `You are a medical laboratory assistant. Analyze this clinical lab report text or data.
Return STRICT JSON adhering to this schema:
{
  "test_name": string (e.g. "Complete Blood Count" or "Lipid Profile"),
  "extracted_metrics": { [paramName: string]: number or string with units },
  "abnormality_flags": string[] (list of abnormal findings with high/low note),
  "ai_summary": string (maximum 2 clinical summary sentences)
}

Lab Report Content:
${content}`;

  const jsonStr = await callOllama(prompt, baseUrl);
  try {
    return JSON.parse(jsonStr) as LabAnalysisResult;
  } catch {
    throw new Error('Failed to parse structured JSON from local Ollama response.');
  }
}

async function suggestTrackWithOllama(
  context: AnonymizedPatientContext,
  baseUrl?: string,
): Promise<ClinicalTrackResult> {
  const prompt = `You are an AI Clinical Decision Support co-pilot.
Review this anonymized patient clinical summary and suggest an evidence-based clinical track.
Return STRICT JSON adhering to this schema:
{
  "differential_diagnoses": string[],
  "suggested_medications": [
    {
      "generic_name": string,
      "suggested_brand": string,
      "strength": string,
      "schedule": string,
      "duration": string,
      "rationale": string
    }
  ],
  "recommended_investigations": string[],
  "safety_warnings": string[]
}

Clinical Context:
${JSON.stringify(context, null, 2)}`;

  const jsonStr = await callOllama(prompt, baseUrl);
  try {
    return JSON.parse(jsonStr) as ClinicalTrackResult;
  } catch {
    throw new Error('Failed to parse structured JSON from local Ollama response.');
  }
}
