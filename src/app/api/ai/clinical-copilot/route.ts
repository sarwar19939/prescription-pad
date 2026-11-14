import { NextResponse } from 'next/server';
import { mockClinicalTrack, mockFullPrescription, mockImageAnalysis, mockLabAnalysis } from './mockData';
import { mockAmbientScribe } from './mockScribe';
import { callGeminiImageAnalysis, callNvidiaImageAnalysis } from './visionHelper';
import { callGeminiAmbientScribe, callNvidiaAmbientScribe } from './scribeHelper';
import {
  BD_CLINICAL_SYSTEM_INSTRUCTION,
  COPILOT_AUDIT_SYSTEM_INSTRUCTION,
  MEDICAL_INVESTIGATION_SYSTEM_INSTRUCTION,
} from './clinicalPrompts';

interface RequestBody {
  action: 'analyze_lab' | 'suggest_track' | 'full_prescription' | 'analyze_image' | 'ambient_scribe';
  payload: any;
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { action, payload } = body;

    const geminiApiKey =
      payload?.geminiApiKey ||
      (!payload?.apiKey?.startsWith('nvapi-') ? payload?.apiKey : null) ||
      process.env.GEMINI_API_KEY;

    const nvidiaApiKey =
      payload?.nvidiaApiKey ||
      (payload?.apiKey?.startsWith('nvapi-') ? payload.apiKey : null) ||
      process.env.NVIDIA_API_KEY;

    // 1. Primary AI Provider: Google Gemini
    if (geminiApiKey) {
      try {
        if (action === 'analyze_lab') {
          const result = await callGeminiLabAnalysis(geminiApiKey, payload);
          return NextResponse.json({ ...result, ai_provider: 'gemini' });
        } else if (action === 'suggest_track') {
          const result = await callGeminiSuggestTrack(geminiApiKey, payload);
          return NextResponse.json({ ...result, ai_provider: 'gemini' });
        } else if (action === 'full_prescription') {
          const result = await callGeminiFullPrescription(geminiApiKey, payload);
          return NextResponse.json({ ...result, ai_provider: 'gemini' });
        } else if (action === 'analyze_image') {
          const result = await callGeminiImageAnalysis(geminiApiKey, payload, GEMINI_MODEL);
          return NextResponse.json({ ...result, ai_provider: 'gemini' });
        } else if (action === 'ambient_scribe') {
          const result = await callGeminiAmbientScribe(geminiApiKey, payload, GEMINI_MODEL);
          return NextResponse.json({ ...result, ai_provider: 'gemini' });
        }
      } catch (geminiError) {
        console.warn('Gemini error, failing over to NVIDIA NIM:', geminiError instanceof Error ? geminiError.message : geminiError);
      }
    }

    // 2. High-Performance Resilient Fallback: NVIDIA NIM
    if (nvidiaApiKey) {
      try {
        if (action === 'analyze_lab') {
          const result = await callNvidiaLabAnalysis(nvidiaApiKey, payload);
          return NextResponse.json({ ...result, ai_provider: 'nvidia_nim' });
        } else if (action === 'suggest_track') {
          const result = await callNvidiaSuggestTrack(nvidiaApiKey, payload);
          return NextResponse.json({ ...result, ai_provider: 'nvidia_nim' });
        } else if (action === 'full_prescription') {
          const result = await callNvidiaFullPrescription(nvidiaApiKey, payload);
          return NextResponse.json({ ...result, ai_provider: 'nvidia_nim' });
        } else if (action === 'analyze_image') {
          const result = await callNvidiaImageAnalysis(nvidiaApiKey, payload);
          return NextResponse.json({ ...result, ai_provider: 'nvidia_nim' });
        } else if (action === 'ambient_scribe') {
          const result = await callNvidiaAmbientScribe(nvidiaApiKey, payload, DEFAULT_NVIDIA_MODEL);
          return NextResponse.json({ ...result, ai_provider: 'nvidia_nim' });
        }
      } catch (nvidiaError) {
        console.warn('NVIDIA NIM error, falling back to local clinical rules:', nvidiaError instanceof Error ? nvidiaError.message : nvidiaError);
      }
    }

    // 3. Resilient Offline Mock / Rule Engine Fallback
    if (action === 'analyze_lab') {
      return NextResponse.json({ ...mockLabAnalysis(payload), ai_provider: 'offline_rules' });
    } else if (action === 'suggest_track') {
      return NextResponse.json(mockClinicalTrack(payload));
    } else if (action === 'full_prescription') {
      return NextResponse.json(mockFullPrescription(payload.diagnosis || ''));
    } else if (action === 'analyze_image') {
      return NextResponse.json({ ...mockImageAnalysis(payload), ai_provider: 'offline_rules' });
    } else if (action === 'ambient_scribe') {
      return NextResponse.json(mockAmbientScribe(payload));
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function safeParseNvidiaJson(json: any) {
  const choice = json.choices?.[0]?.message;
  const text = (typeof choice?.content === 'string' ? choice.content.trim() : '') || (typeof choice?.reasoning_content === 'string' ? choice.reasoning_content.trim() : '');
  if (!text) throw new Error('Empty response from NVIDIA NIM');
  const codeMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeMatch) { try { return JSON.parse(codeMatch[1].trim()); } catch {} }
  try { return JSON.parse(text); } catch {}
  const first = text.indexOf('{'); const last = text.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) { return JSON.parse(text.substring(first, last + 1)); }
  throw new Error('NVIDIA NIM response does not contain valid structured JSON');
}

async function callNvidiaChat(apiKey: string, prompt: string, systemInstruction: string) {
  const model = DEFAULT_NVIDIA_MODEL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(NVIDIA_BASE_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 1800,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`NVIDIA NIM returned ${res.status}: ${errorBody}`);
    }

    const json = await res.json();
    return safeParseNvidiaJson(json);
  } finally {
    clearTimeout(timer);
  }
}

async function callNvidiaSuggestTrack(apiKey: string, context: any) {
  const prompt = `Analyze this comprehensive patient clinical summary (vitals, complaints, drug history, examination findings, current prescribed medicines, lab trends, doctor answers) and audit for errors & suggest medications:
${JSON.stringify(context, null, 2)}`;
  return callNvidiaChat(apiKey, prompt, COPILOT_AUDIT_SYSTEM_INSTRUCTION);
}

async function callNvidiaFullPrescription(apiKey: string, payload: any) {
  const prompt = `Confirmed Diagnosis: "${payload.diagnosis}". Patient: ${payload.age}yo ${payload.gender}, weight: ${payload.vitals?.weight || 'normal'}, allergies: ${payload.allergies?.join(', ') || 'none'}.
Generate a complete, comprehensive Bangladesh prescription package with all necessary medications and clinical advice in Bengali.
Return STRICT JSON: { "diagnosis": string, "medicines": Array<{ brand_name, generic_name, dosage_form, strength, schedule, meal_timing, duration, special_instructions }>, "advice": string[] }`;
  return callNvidiaChat(apiKey, prompt, BD_CLINICAL_SYSTEM_INSTRUCTION);
}

async function callNvidiaLabAnalysis(apiKey: string, payload: { content: string; mimeType?: string; testName?: string; reportType?: string; fileName?: string }) {
  const isImage = (payload.content || '').startsWith('data:image/') || payload.mimeType?.startsWith('image/');
  if (isImage) {
    const cleanBase64 = (payload.content || '').replace(/^data:[^;]+;base64,/, '');
    const mimeType = payload.mimeType || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${cleanBase64}`;
    const hint = [payload.testName, payload.fileName, payload.reportType].filter(Boolean).join(' - ');
    const prompt = `Analyze this medical investigation image (${hint || '12-Lead ECG, MRI film/report, X-ray, or printed lab report sheet'}) and provide full structured interpretation.`;

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
          model: process.env.NVIDIA_VISION_MODEL || 'nvidia/nemotron-3.5-super-vl-120b-a12b',
          messages: [
            { role: 'system', content: MEDICAL_INVESTIGATION_SYSTEM_INSTRUCTION },
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: dataUrl } },
              ],
            },
          ],
          temperature: 0.2,
          max_tokens: 1800,
        }),
      });
      if (!res.ok) throw new Error(`NVIDIA NIM Vision returned ${res.status}`);
      const json = await res.json();
      return safeParseNvidiaJson(json);
    } finally {
      clearTimeout(timer);
    }
  }

  const prompt = `Analyze this lab / medical investigation report (${payload.testName || 'Investigation'}):
${payload.content}`;
  return callNvidiaChat(apiKey, prompt, MEDICAL_INVESTIGATION_SYSTEM_INSTRUCTION);
}

async function callGemini(apiKey: string, contents: any[], systemInstruction: string) {
  const modelCandidates = Array.from(new Set([GEMINI_MODEL, 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-pro-latest'])).filter(Boolean);
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
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
        }),
      });
      if (!res.ok) {
        if (res.status === 429 || res.status === 404) {
          lastError = new Error(`Gemini model ${model} returned ${res.status}`);
          continue;
        }
        throw new Error(`Gemini API returned ${res.status}: ${await res.text()}`);
      }
      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from Gemini API');
      return JSON.parse(text);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

async function callGeminiLabAnalysis(apiKey: string, payload: { content: string; mimeType?: string; testName?: string; reportType?: string; fileName?: string }) {
  const isImage = (payload.content || '').startsWith('data:image/') || payload.mimeType?.startsWith('image/');
  if (isImage) {
    const cleanBase64 = (payload.content || '').replace(/^data:[^;]+;base64,/, '');
    const mimeType = payload.mimeType || 'image/jpeg';
    const hint = [payload.testName, payload.fileName, payload.reportType].filter(Boolean).join(' - ');
    const contents = [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: cleanBase64 } },
          { text: `Analyze this medical investigation image (${hint || '12-Lead ECG tracing, MRI/CT scan or report, X-ray, or printed laboratory test sheet'}). Provide full structured interpretation.` },
        ],
      },
    ];
    return callGemini(apiKey, contents, MEDICAL_INVESTIGATION_SYSTEM_INSTRUCTION);
  }

  const contents = [
    {
      role: 'user',
      parts: [{ text: `Medical Test / Report Data (${payload.testName || 'Lab Investigation'}):\n${payload.content}` }],
    },
  ];
  return callGemini(apiKey, contents, MEDICAL_INVESTIGATION_SYSTEM_INSTRUCTION);
}

async function callGeminiSuggestTrack(apiKey: string, context: any) {
  const prompt = `Patient Clinical Context (Complaints, Vitals, Drug History, Findings, Current Prescribed Meds, Labs, Doctor Answers):\n${JSON.stringify(context, null, 2)}\n
Perform a comprehensive prescription error audit, detect any contradictions, and suggest evidence-based medications.`;
  return callGemini(apiKey, [{ role: 'user', parts: [{ text: prompt }] }], COPILOT_AUDIT_SYSTEM_INSTRUCTION);
}

async function callGeminiFullPrescription(apiKey: string, payload: any) {
  const prompt = `Confirmed Diagnosis: "${payload.diagnosis}". Patient: ${payload.age}yo ${payload.gender}, weight: ${payload.vitals?.weight || 'normal'}, allergies: ${payload.allergies?.join(', ') || 'none'}.
Generate a complete, comprehensive Bangladesh OPD prescription with all necessary medications and clinical advice in Bengali.
Return STRICT JSON: { "diagnosis": string, "medicines": Array<{ brand_name, generic_name, dosage_form, strength, schedule, meal_timing, duration, special_instructions }>, "advice": string[] }`;
  return callGemini(apiKey, [{ role: 'user', parts: [{ text: prompt }] }], BD_CLINICAL_SYSTEM_INSTRUCTION);
}
