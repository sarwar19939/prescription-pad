import { NextResponse } from 'next/server';
import { mockClinicalTrack, mockLabAnalysis } from './mockData';

interface RequestBody {
  action: 'analyze_lab' | 'suggest_track';
  payload: any;
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct';

const BD_CLINICAL_SYSTEM_INSTRUCTION = `You are an expert AI Clinical Decision Support co-pilot for BMDC registered doctors in Bangladesh.
Guidelines & Regional Protocol (DGHS / icddr,b / BIRDEM):
1. Dengue Protocol: If fever, retro-orbital pain, myalgia, or rash is present, highlight Dengue suspicion. Strictly warn NO NSAIDs (Ibuprofen, Ketorolac, Naproxen, Aspirin) or Steroids due to hemorrhage risk; recommend Paracetamol only + ORS fluids.
2. Enteric Fever / Antimicrobial Stewardship: High fluoroquinolone (Ciprofloxacin) resistance in Bangladesh. Prioritize Azithromycin or Cefixime for OPD.
3. Diarrhea Protocol: icddr,b rehydration Plan A/B/C + Zinc (10-20mg for 14 days).
4. Prescribing Notation: Use Bangladesh prescription schedules (1+0+1, 1+1+1, 0+0+1, 1+0+0) with top BD brands (Square, Incepta, Beximco, Renata, Healthcare).
Return STRICT JSON ONLY conforming to the requested schema. Do not add markdown or extra conversational text.`;

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
        }
      } catch (geminiError) {
        console.warn('Gemini high-demand/rate limit encountered; seamlessly failing over to NVIDIA NIM:', geminiError instanceof Error ? geminiError.message : geminiError);
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
        }
      } catch (nvidiaError) {
        console.warn('NVIDIA NIM request failed, falling back to local clinical rules:', nvidiaError instanceof Error ? nvidiaError.message : nvidiaError);
      }
    }

    // 3. Resilient Offline Mock / Rule Engine Fallback
    if (action === 'analyze_lab') {
      return NextResponse.json(mockLabAnalysis(payload));
    } else if (action === 'suggest_track') {
      return NextResponse.json(mockClinicalTrack(payload));
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function safeParseNvidiaJson(json: any) {
  const choice = json.choices?.[0]?.message;
  const content = typeof choice?.content === 'string' ? choice.content.trim() : '';
  const reasoning = typeof choice?.reasoning_content === 'string' ? choice.reasoning_content.trim() : '';
  const text = content || reasoning;
  if (!text) throw new Error('Empty response from NVIDIA NIM');

  const codeMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeMatch) {
    try {
      return JSON.parse(codeMatch[1].trim());
    } catch {}
  }

  try {
    return JSON.parse(text);
  } catch {}

  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    return JSON.parse(text.substring(first, last + 1));
  }

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
  const prompt = `Analyze this anonymized patient clinical summary and suggest an evidence-based clinical track according to Bangladesh DGHS/BMDC guidelines:
${JSON.stringify(context, null, 2)}
Return STRICT JSON schema:
{
  "differential_diagnoses": string[],
  "suggested_medications": Array<{ generic_name, suggested_brand, strength, schedule, duration, rationale }>,
  "recommended_investigations": string[],
  "safety_warnings": string[]
}`;
  return callNvidiaChat(apiKey, prompt, BD_CLINICAL_SYSTEM_INSTRUCTION);
}

async function callNvidiaLabAnalysis(apiKey: string, payload: { content: string }) {
  const prompt = `Analyze this laboratory report data and identify all biomarkers and abnormalities:
${payload.content}
Return STRICT JSON:
{
  "test_name": string,
  "extracted_metrics": Record<string, string | number>,
  "abnormality_flags": string[],
  "ai_summary": string
}`;
  return callNvidiaChat(apiKey, prompt, BD_CLINICAL_SYSTEM_INSTRUCTION);
}

async function callGemini(apiKey: string, contents: any[], systemInstruction: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
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
    if (!res.ok) throw new Error(`Gemini API returned ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini API');
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

async function callGeminiLabAnalysis(apiKey: string, payload: { content: string }) {
  const system = `Extract biomarkers from lab report. Return JSON with test_name, extracted_metrics, abnormality_flags, ai_summary.`;
  return callGemini(apiKey, [{ role: 'user', parts: [{ text: `Lab Data:\n${payload.content}` }] }], system);
}

async function callGeminiSuggestTrack(apiKey: string, context: any) {
  return callGemini(
    apiKey,
    [{ role: 'user', parts: [{ text: `Patient Clinical Summary:\n${JSON.stringify(context, null, 2)}` }] }],
    BD_CLINICAL_SYSTEM_INSTRUCTION,
  );
}
