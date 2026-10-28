/**
 * Ambient AI Scribe Helper for Gemini & NVIDIA NIM LLMs.
 */
import type { ScribeExtractionResult } from '@/services/aiScribeService';

const SYSTEM_INSTRUCTION = `You are an expert bilingual (Bengali + English) Ambient AI Medical Scribe and Clinical Decision Support assistant for doctors in Bangladesh.
You listen to doctor-patient conversation transcripts and extract structured medical documentation conforming to "Master The Chamber" guidelines:
1. Chief Complaints (C/C): Standard clinical terms with durations in Bengali or English.
2. Vitals mentioned: Extract any BP, pulse, temp, weight mentioned.
3. Medical History: Past chronic illnesses, allergies, or habits.
4. Differential Diagnoses: Top 2-4 suspected medical conditions.
5. Primary Diagnosis: The most probable diagnosis in Bengali & English.
6. Suggested Medicines: Complete rational outpatient chamber package with top Bangladesh brands (Square, Incepta, Beximco, Renata, Healthcare) using local schedule (1+0+1, 1+1+1, 0+0+1) and meal timings. Mandatory PPI (Sergel/Maxpro) with NSAIDs/antibiotics.
7. Advice: Practical lifestyle, dietary and follow-up guidance in empathetic Bengali.
8. Summary: Brief 1-2 sentence clinical summary.

Return STRICT JSON:
{
  "chief_complaints": string[],
  "vitals_mentioned": Record<string, string>,
  "history_notes": string[],
  "differential_diagnoses": string[],
  "primary_diagnosis": string,
  "suggested_medicines": Array<{
    "brand_name": string,
    "generic_name": string,
    "dosage_form": "Tab" | "Cap" | "Syr" | "Inj" | "Oint" | "Drop",
    "strength": string,
    "schedule": string,
    "meal_timing": "After Meal" | "Before Meal" | "With Meal" | "Anytime",
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
