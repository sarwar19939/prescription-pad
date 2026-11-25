/**
 * MedRecord — AI Clinical Vision & Dermatology Analysis Service.
 * Analyzes clinical photos (skin lesions, rashes, eye, wound, etc.)
 * using multimodal vision AI (Gemini Vision / NVIDIA Nemotron-VL) with offline resilience.
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
  // Offline Guard
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      observed_features: ['ইন্টারনেট সংযোগ নেই: ইমেজ বিশ্লেষণের জন্য ক্লাউড এআই অ্যাক্টিভ ইন্টারনেট প্রয়োজন।'],
      differential_diagnoses: [],
      primary_diagnosis: 'অফলাইন মোড (AI ভিশন ক্লাউডে সংযোগ করতে পারছে না)',
      recommended_workup: ['ইন্টারনেট চালু করে পুনরায় চেষ্টা করুন।'],
      suggested_treatment: { medicines: [], advice: ['ক্লিনিক্যাল পরীক্ষা অনুযায়ী প্রেসক্রিপশন তৈরি করুন।'] },
      safety_warnings: ['অফলাইনে ইমেজ প্রসেসিং সমর্থিত নয়।'],
      ai_provider: 'offline_fallback',
    };
  }

  const mimeTypeMatch = base64DataUrl.match(/^data:([^;]+);base64,/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
  const rawBase64 = base64DataUrl.replace(/^data:[^;]+;base64,/, '');
  const aiCfg = await getActiveTenantAiConfig();

  try {
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
      return {
        observed_features: [`সার্ভিস সাড়া দেয়নি (${res.status})`],
        differential_diagnoses: [],
        primary_diagnosis: 'ইমেজ বিশ্লেষণ সম্পন্ন করা যায়নি',
        recommended_workup: ['API কি (Key) অথবা ইন্টারনেট সংযোগ চেক করুন।'],
        suggested_treatment: { medicines: [], advice: [] },
        safety_warnings: [errBody || 'AI মডেল থেকে কোনো রেসপন্স পাওয়া যায়নি।'],
        ai_provider: 'error_fallback',
      };
    }

    return (await res.json()) as ClinicalVisionResult;
  } catch (err: any) {
    return {
      observed_features: ['নেটওয়ার্ক সমস্যা বা সার্ভার কানেকশন ত্রুটি'],
      differential_diagnoses: [],
      primary_diagnosis: 'AI ভিশন সার্ভিস ত্রুটি',
      recommended_workup: ['পুনরায় চেষ্টা করুন।'],
      suggested_treatment: { medicines: [], advice: [] },
      safety_warnings: [err?.message || 'অপ্রত্যাশিত নেটওয়ার্ক ত্রুটি'],
      ai_provider: 'network_fallback',
    };
  }
}
