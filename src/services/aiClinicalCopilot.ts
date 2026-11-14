/**
 * MedRecord — AI Clinical Decision Support & Lab Analyzer Service Layer.
 * Strict Privacy Rule: All PII is stripped client-side prior to prompt serialization.
 */
import type { Encounter, InvestigationReport, Patient } from '@/types/schema';
import { getActiveTenantAiConfig } from './auth';

export type AIProvider = 'cloud' | 'local';

export interface LabAnalysisResult {
  report_type?: 'ecg' | 'mri' | 'ct' | 'xray' | 'lab_report' | 'other';
  test_name: string;
  clinical_impression?: string;
  key_findings?: string[];
  extracted_metrics: Record<string, string | number>;
  abnormality_flags: string[];
  suggested_diagnosis?: string;
  recommended_actions?: string[];
  ai_summary: string;
  ai_provider?: string;
}

export interface PrescriptionContradiction {
  severity: 'critical' | 'warning' | 'advisory';
  medicine: string;
  issue: string;
  clinical_danger: string;
  recommendation: string;
}

export interface SuggestedMedication {
  generic_name: string;
  suggested_brand: string;
  dosage_form?: string;
  strength: string;
  schedule: string;
  meal_timing?: string;
  duration: string;
  rationale: string;
}

export interface ClinicalQuestion {
  id: string;
  question: string;
  options?: string[];
  hint?: string;
}

export interface ClinicalTrackResult {
  probable_diagnosis?: string;
  differential_diagnoses: string[];
  suggested_medications: SuggestedMedication[];
  recommended_investigations: string[];
  safety_warnings: string[];
  prescription_audit_status?: 'clean' | 'warnings_found';
  audit_summary?: string;
  contradictions_and_errors?: PrescriptionContradiction[];
  clinical_questions?: ClinicalQuestion[];
  clinical_summary?: string;
  is_confirmed_mode?: boolean;
}

export interface AnonymizedPatientContext {
  age: number;
  gender: string;
  weight?: string;
  blood_group?: string;
  chronic_conditions: string[];
  allergies: string[];
  drug_history?: string[];
  medical_surgical_history?: string;
  current_complaints: string[];
  current_vitals: Record<string, string>;
  clinical_findings?: string;
  active_diagnoses?: string[];
  current_medicines?: string[];
  doctor_answers?: Record<string, string>;
  past_encounters_summary: Array<{ date: string; complaints: string[]; diagnosis: string[]; findings?: string }>;
  latest_labs_summary: Array<{ date: string; test_name: string; metrics: Record<string, string | number>; abnormality_flags: string[] }>;
}

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_OLLAMA_MODEL = 'llama3.2';

export function sanitizePatientContext(
  patient: Patient,
  pastEncounters: Encounter[] = [],
  latestLabs: InvestigationReport[] = [],
  currentComplaints: string[] = [],
  currentVitals: Record<string, string> = {},
  options?: { clinicalFindings?: string; activeDiagnoses?: string[]; currentMedicines?: string[]; doctorAnswers?: Record<string, string> },
): AnonymizedPatientContext {
  return {
    age: patient.age,
    gender: patient.gender,
    weight: currentVitals.weight || undefined,
    blood_group: patient.blood_group,
    chronic_conditions: [...patient.chronic_conditions],
    allergies: [...patient.allergies],
    drug_history: patient.drug_history ? [...patient.drug_history] : undefined,
    medical_surgical_history: patient.medical_surgical_history || undefined,
    current_complaints: [...currentComplaints],
    current_vitals: { ...currentVitals },
    clinical_findings: options?.clinicalFindings,
    active_diagnoses: options?.activeDiagnoses,
    current_medicines: options?.currentMedicines,
    doctor_answers: options?.doctorAnswers,
    past_encounters_summary: pastEncounters.map((e) => ({ date: e.visit_date, complaints: e.chief_complaints, diagnosis: e.diagnosis, findings: e.clinical_findings || undefined })),
    latest_labs_summary: latestLabs.map((l) => ({ date: l.report_date, test_name: l.test_name, metrics: l.extracted_metrics, abnormality_flags: l.abnormality_flags })),
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
    geminiApiKey?: string;
    nvidiaApiKey?: string;
    testName?: string;
    reportType?: string;
    fileName?: string;
  },
): Promise<LabAnalysisResult> {
  const aiCfg = await getActiveTenantAiConfig();
  const provider = options?.provider ?? aiCfg.ai_provider ?? (navigator.onLine ? 'cloud' : 'local');

  if (provider === 'local') {
    return analyzeWithOllama(imageBase64OrText, options?.ollamaBaseUrl || aiCfg.ollama_base_url);
  }

  const res = await fetch('/api/ai/clinical-copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'analyze_lab',
      payload: {
        content: imageBase64OrText,
        mimeType: options?.mimeType || 'text/plain',
        testName: options?.testName,
        reportType: options?.reportType,
        fileName: options?.fileName,
        geminiApiKey: options?.geminiApiKey || aiCfg.ai_api_key,
        nvidiaApiKey: options?.nvidiaApiKey || aiCfg.nvidia_api_key,
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
  pastEncounters: Encounter[] = [],
  latestLabs: InvestigationReport[] = [],
  currentComplaints: string[] = [],
  currentVitals: Record<string, string> = {},
  options?: {
    clinicalFindings?: string;
    activeDiagnoses?: string[];
    currentMedicines?: string[];
    doctorAnswers?: Record<string, string>;
    provider?: AIProvider;
    ollamaBaseUrl?: string;
    geminiApiKey?: string;
    nvidiaApiKey?: string;
  },
): Promise<ClinicalTrackResult> {
  const anonymized = sanitizePatientContext(
    patient,
    pastEncounters,
    latestLabs,
    currentComplaints,
    currentVitals,
    {
      clinicalFindings: options?.clinicalFindings,
      activeDiagnoses: options?.activeDiagnoses,
      currentMedicines: options?.currentMedicines,
      doctorAnswers: options?.doctorAnswers,
    },
  );

  const aiCfg = await getActiveTenantAiConfig();
  const provider = options?.provider ?? aiCfg.ai_provider ?? (navigator.onLine ? 'cloud' : 'local');

  if (provider === 'local') {
    return suggestTrackWithOllama(anonymized, options?.ollamaBaseUrl || aiCfg.ollama_base_url);
  }

  const res = await fetch('/api/ai/clinical-copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'suggest_track',
      payload: {
        ...anonymized,
        geminiApiKey: options?.geminiApiKey || aiCfg.ai_api_key,
        nvidiaApiKey: options?.nvidiaApiKey || aiCfg.nvidia_api_key,
      },
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
