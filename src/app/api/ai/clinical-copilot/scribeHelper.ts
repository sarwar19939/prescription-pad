/**
 * Ambient AI Scribe Helper for Gemini & NVIDIA NIM LLMs.
 */
import type { ScribeExtractionResult } from '@/services/aiScribeService';

const SYSTEM_INSTRUCTION = `You are an expert bilingual (Bengali + English) Ambient AI Medical Scribe and Clinical Decision Support assistant for doctors in Bangladesh.
You listen to doctor-patient conversation transcripts and extract structured medical documentation conforming to "Master The Chamber" guidelines:
1. Chief Complaints (C/C): MUST ALWAYS BE IN PROFESSIONAL MEDICAL ENGLISH (e.g., "High-grade fever for 3 days", "Productive cough with chest tightness", "Epigastric burning pain", "Acute watery diarrhea"). Translate colloquial Bengali into standard medical terminology.
2. Vitals mentioned: Extract any BP (e.g. "120/80"), pulse (e.g. "78 bpm"), temp (e.g. "101°F"), weight (e.g. "65 kg"), SpO2 (e.g. "98%") mentioned by doctor or patient in Bengali or English.
3. Medical History & HPI: Write in standard professional Medical English (e.g. "Patient presents with persistent dry cough and low-grade fever for 3 days. No history of bronchial asthma or drug allergies.").
4. Examination Findings: Physical examination findings mentioned in English (e.g. "Pharyngeal congestion present. Chest is clinically clear with vesicular breath sounds.").
5. Differential Diagnoses: Top 2-4 suspected medical conditions in standard English medical terms.
6. Primary Diagnosis: The most probable diagnosis in standard English.
7. Suggested Medicines: Complete rational outpatient chamber package with top Bangladesh brands using local schedules and meal timings.
8. Advice: Practical lifestyle, dietary and follow-up guidance in empathetic Bengali.
9. Summary: Brief 1-2 sentence clinical summary.

Return STRICT JSON:
{
  "chief_complaints": string[],
  "vitals_mentioned": {
    "bp"?: string,
    "pulse"?: string,
    "temp"?: string,
    "weight"?: string,
    "spo2"?: string
  },
  "history_notes": string[],
  "examination_findings"?: string,
  "differential_diagnoses": string[],
  "primary_diagnosis": string,
  "suggested_medicines": Array<{
    "brand_name": string,
    "generic_name": string,
    "dosage_form": string,
    "strength": string,
    "schedule": string,
    "meal_timing": string,
    "duration": string,
    "special_instructions": string
  }>,
  "advice": string[],
  "summary": string
}`;

export async function callGeminiAmbientScribe(
  apiKey: string,
  payload: { transcript: string; patientContext?: any },
  geminiModel: string,
): Promise<ScribeExtractionResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
  const prompt = `Doctor-Patient Consultation Conversation Transcript:
"""
${payload.transcript}
"""
Patient Demographics: Age: ${payload.patientContext?.age || 'Adult'}, Gender: ${payload.patientContext?.gender || 'Unknown'}.
Extract clinical documentation, diagnoses, and Master The Chamber standard prescription package.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
      }),
    });
    if (!res.ok) throw new Error(`Gemini Scribe API error: ${await res.text()}`);
    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini Scribe API');
    return JSON.parse(text) as ScribeExtractionResult;
  } finally {
    clearTimeout(timer);
  }
}

export async function callNvidiaAmbientScribe(
  apiKey: string,
  payload: { transcript: string; patientContext?: any },
  model: string,
): Promise<ScribeExtractionResult> {
  const url = 'https://integrate.api.nvidia.com/v1/chat/completions';
  const prompt = `Doctor-Patient Consultation Conversation Transcript:
"""
${payload.transcript}
"""
Patient: Age: ${payload.patientContext?.age || 'Adult'}, Gender: ${payload.patientContext?.gender || 'Unknown'}.
Extract clinical documentation, diagnoses, and Master The Chamber standard prescription package.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 2200,
      }),
    });
    if (!res.ok) throw new Error(`NVIDIA Scribe error: ${await res.text()}`);
    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content?.trim() || '';
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    return JSON.parse(match ? match[1].trim() : raw) as ScribeExtractionResult;
  } finally {
    clearTimeout(timer);
  }
}
