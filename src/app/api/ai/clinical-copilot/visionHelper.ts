/**
 * Vision & Multimodal helpers for Gemini Vision and NVIDIA Vision NIM.
 */
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_NVIDIA_VISION_MODEL = process.env.NVIDIA_VISION_MODEL || 'nvidia/nemotron-3.5-super-vl-120b-a12b';

export async function callGeminiImageAnalysis(apiKey: string, payload: any, geminiModel: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
  const cleanBase64 = (payload.image || '').replace(/^data:[^;]+;base64,/, '');
  const mimeType = payload.mimeType || 'image/jpeg';

  const systemInstruction = `You are an expert dermatological and clinical AI diagnostic co-pilot for Bangladesh doctors.
Analyze the provided clinical/skin photo. Return STRICT JSON with:
{
  "observed_features": string[],
  "differential_diagnoses": string[],
  "primary_diagnosis": string,
  "recommended_workup": string[],
  "suggested_treatment": {
    "medicines": Array<{ brand_name, generic_name, dosage_form, strength, schedule, meal_timing, duration, special_instructions }>,
    "advice": string[]
  },
  "safety_warnings": string[]
}`;

  const promptText = `Patient Clinical Notes: ${payload.clinicalNotes || 'Skin lesion/rash presentation'}.
Patient Age: ${payload.patientContext?.age || 'Adult'}, Gender: ${payload.patientContext?.gender || 'Unknown'}.
Perform detailed morphological analysis, differential diagnoses with top Bangladesh pharmaceutical brands (Square, Beximco, Incepta), and safety guidance.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType, data: cleanBase64 } },
              { text: promptText },
            ],
          },
        ],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
      }),
    });
    if (!res.ok) throw new Error(`Gemini Vision API returned ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini Vision API');
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

export async function callNvidiaImageAnalysis(apiKey: string, payload: any) {
  const cleanBase64 = (payload.image || '').replace(/^data:[^;]+;base64,/, '');
  const mimeType = payload.mimeType || 'image/jpeg';
  const dataUrl = `data:${mimeType};base64,${cleanBase64}`;

  const prompt = `Analyze this clinical/dermatological photo for an outpatient clinic in Bangladesh.
Notes: ${payload.clinicalNotes || 'Skin presentation'}. Age: ${payload.patientContext?.age || 'Adult'}.
Return STRICT JSON conforming to:
{
  "observed_features": string[],
  "differential_diagnoses": string[],
  "primary_diagnosis": string,
  "recommended_workup": string[],
  "suggested_treatment": {
    "medicines": Array<{ brand_name, generic_name, dosage_form, strength, schedule, meal_timing, duration, special_instructions }>,
    "advice": string[]
  },
  "safety_warnings": string[]
}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(NVIDIA_BASE_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_NVIDIA_VISION_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });
    if (!res.ok) throw new Error(`NVIDIA Vision returned ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const raw = json.choices?.[0]?.message?.content?.trim() || '';
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    return JSON.parse(match ? match[1].trim() : raw);
  } finally {
    clearTimeout(timer);
  }
}
