/**
 * Vision & Multimodal helpers for Gemini Vision and NVIDIA Vision NIM.
 * Accurately analyzes 12-Lead ECGs, Radiology, Lab Reports, and Dermatology
 * without hallucinating default diseases.
 */
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_NVIDIA_VISION_MODEL = process.env.NVIDIA_VISION_MODEL || 'nvidia/nemotron-3.5-super-vl-120b-a12b';

const MULTIMODAL_VISION_SYSTEM_INSTRUCTION = `You are an expert Clinical Diagnostic & Medical Vision AI Co-Pilot for registered doctors in Bangladesh.
Carefully inspect the provided medical image. Determine what kind of image it is:

1. 12-Lead Electrocardiogram (ECG) Tracing / Rhythm Strip:
   - Analyze Rhythm, Rate, P wave, PR interval, QRS duration, QTc.
   - Look for ST-elevation, ST-depression, T-wave inversion, pathological Q-waves, or bundle branch blocks.
   - Primary diagnosis: e.g. "Normal Sinus Rhythm", "Sinus Tachycardia", "Acute Anteroseptal STEMI", "Inferior Ischemia", etc. (NOT a skin disease!).

2. Radiological Study or Medical Report (X-Ray, MRI, CT scan, Lab test sheet):
   - Provide accurate radiological/laboratory impression.

3. Dermatological & Skin Lesion Photo:
   - Carefully examine morphology, lesion type, color, distribution, scale, border, and central clearing:
     * Scabies (Sarcoptes scabiei) — excoriated papules, classic linear burrows in finger webs/wrists, intense nocturnal pruritus.
     * Atopic Dermatitis / Eczema — poorly demarcated scaly erythematous dry patches, flexural distribution.
     * Plaque Psoriasis — well-demarcated erythematous plaques covered with thick, micaceous silvery-white scales.
     * Acute Urticaria — transient edematous wheals with central pallor.
     * Acne Vulgaris — open/closed comedones, inflammatory papules, pustules.
     * Herpes Zoster — clustered vesicles in a unilateral dermatome.
     * Tinea Corporis / Cruris (Ringworm) — ONLY diagnose when clear annular erythematous plaque with active raised vesicular border and central clearing is visible.
     * Inconclusive / Normal — State that it is a non-specific clinical observation with NO unnecessary medicines.

Return STRICT JSON:
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

export async function callGeminiImageAnalysis(apiKey: string, payload: any, geminiModel: string) {
  const cleanBase64 = (payload.image || '').replace(/^data:[^;]+;base64,/, '');
  const mimeType = payload.mimeType || 'image/jpeg';

  const promptText = `Patient Clinical Notes: ${payload.clinicalNotes || 'Clinical/diagnostic image'}.
File Name / Hint: ${payload.fileName || 'Uploaded image'}.
Patient Context: Age ${payload.patientContext?.age || 'Adult'}, Gender ${payload.patientContext?.gender || 'Unknown'}.
Perform detailed morphological / diagnostic analysis with top Bangladesh pharmaceutical brands (Square, Incepta, Beximco) if treatment is indicated.`;

  const modelCandidates = Array.from(new Set([geminiModel, 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-pro-latest'])).filter(Boolean);
  let lastError: Error | null = null;

  for (const model of modelCandidates) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 16000);
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
          systemInstruction: { parts: [{ text: MULTIMODAL_VISION_SYSTEM_INSTRUCTION }] },
          generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        // If quota exceeded or model not found, continue to next candidate model
        if (res.status === 429 || res.status === 404) {
          lastError = new Error(`Gemini Vision model ${model} returned ${res.status}: ${errText}`);
          continue;
        }
        throw new Error(`Gemini Vision API returned ${res.status}: ${errText}`);
      }
      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from Gemini Vision API');
      return { ...JSON.parse(text), _model_used: model };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error('All Gemini Vision models failed or exceeded quota');
}

export async function callNvidiaImageAnalysis(apiKey: string, payload: any) {
  const cleanBase64 = (payload.image || '').replace(/^data:[^;]+;base64,/, '');
  const mimeType = payload.mimeType || 'image/jpeg';
  const dataUrl = `data:${mimeType};base64,${cleanBase64}`;

  const prompt = `Inspect this clinical image (ECG tracing, Radiology, or Skin lesion).
Notes: ${payload.clinicalNotes || 'Clinical presentation'}. Hint: ${payload.fileName || 'Uploaded file'}. Age: ${payload.patientContext?.age || 'Adult'}.
Identify the exact condition accurately without default assumptions. Return STRICT JSON conforming to the schema.`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
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
          { role: 'system', content: MULTIMODAL_VISION_SYSTEM_INSTRUCTION },
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
