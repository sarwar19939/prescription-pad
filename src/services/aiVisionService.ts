/**
 * MedRecord — AI Clinical Vision & Dermatology Analysis Service.
 * Analyzes clinical photos (skin lesions, rashes, eye, wound, etc.)
 * using multimodal vision AI (Gemini Vision / NVIDIA Nemotron-VL).
 */
import type { PrescriptionItem } from '@/types/schema';
import { getActiveTenantAiConfig } from './auth';

export interface ClinicalVisionResult {
  observed_features: string[];
  differential_diagnoses: string[];
  primary_diagnosis: string;
  recommended_workup: string[];
  suggested_treatment: {
    medicines: Array<Partial<PrescriptionItem>>;
    advice: string[];
  };
  safety_warnings: string[];
  ai_provider?: string;
}

export async function analyzeClinicalPhoto(
  base64DataUrl: string,
  clinicalNotes = '',
  patientContext?: { age: number; gender: string; duration?: string; fileName?: string },
): Promise<ClinicalVisionResult> {
  const mimeTypeMatch = base64DataUrl.match(/^data:([^;]+);base64,/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
  const rawBase64 = base64DataUrl.replace(/^data:[^;]+;base64,/, '');
  const aiCfg = await getActiveTenantAiConfig();

  const res = await fetch('/api/ai/clinical-copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'analyze_image',
      payload: {
        image: rawBase64,
        mimeType,
        fileName: patientContext?.fileName,
        clinicalNotes,
        patientContext,
        geminiApiKey: aiCfg.ai_api_key,
        nvidiaApiKey: aiCfg.nvidia_api_key,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`AI Vision analysis failed: ${errBody}`);
  }

  return (await res.json()) as ClinicalVisionResult;
}
