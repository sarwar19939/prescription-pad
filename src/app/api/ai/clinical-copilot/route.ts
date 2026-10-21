import { NextResponse } from 'next/server';

interface RequestBody {
  action: 'analyze_lab' | 'suggest_track';
  payload: any;
}

const GEMINI_MODEL = 'gemini-1.5-flash';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { action, payload } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      if (action === 'analyze_lab') {
        const result = await callGeminiLabAnalysis(apiKey, payload);
        return NextResponse.json(result);
      } else if (action === 'suggest_track') {
        const result = await callGeminiSuggestTrack(apiKey, payload);
        return NextResponse.json(result);
      }
    }

    // Fallback if GEMINI_API_KEY is not configured (offline demo / development)
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

async function callGemini(apiKey: string, contents: any[], systemInstruction: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gemini API returned ${res.status}: ${errorBody}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini API');
  return JSON.parse(text);
}

async function callGeminiLabAnalysis(apiKey: string, payload: { content: string; mimeType: string }) {
  const systemInstruction = `You are a clinical pathology assistant. Extract key biomarkers from the provided lab report data or image. Return STRICT JSON with test_name (string), extracted_metrics (object map of test parameter to value), abnormality_flags (string array of abnormal items), and ai_summary (2 concise sentences).`;

  let parts: any[] = [];
  if (payload.mimeType?.startsWith('image/')) {
    const base64Data = payload.content.includes(',') ? payload.content.split(',')[1] : payload.content;
    parts = [
      { inlineData: { mimeType: payload.mimeType, data: base64Data } },
      { text: 'Extract laboratory values and identify abnormalities.' },
    ];
  } else {
    parts = [{ text: `Lab Data:\n${payload.content}` }];
  }

  return callGemini(apiKey, [{ role: 'user', parts }], systemInstruction);
}

async function callGeminiSuggestTrack(apiKey: string, context: any) {
  const systemInstruction = `You are an expert AI Clinical Decision Support assistant. Analyze the anonymized clinical context (past visits, complaints, vitals, chronic illnesses, allergies, and lab results). Suggest differential diagnoses, an evidence-based medication track with specific dosages and schedules, recommended follow-up investigations, and critical safety warnings (checking contraindications and drug-allergy interactions). Return STRICT JSON conforming to differential_diagnoses, suggested_medications (generic_name, suggested_brand, strength, schedule, duration, rationale), recommended_investigations, safety_warnings.`;

  const parts = [{ text: `Patient Clinical Summary:\n${JSON.stringify(context, null, 2)}` }];
  return callGemini(apiKey, [{ role: 'user', parts }], systemInstruction);
}

/* ------------------------------------------------------------------ */
/* Intelligent Mock Fallbacks for Development / Offline Demo           */
/* ------------------------------------------------------------------ */

function mockLabAnalysis(payload: { content: string }) {
  const text = payload?.content || '';
  const isDiabetes = /sugar|glucose|hba1c/i.test(text);
  const isKidney = /creatinine|urea|egfr/i.test(text);
  const isLipid = /cholesterol|triglyceride|lipid/i.test(text);

  if (isDiabetes) {
    return {
      test_name: 'Glycemic Profile',
      extracted_metrics: {
        'HbA1c': '7.8 %',
        'Fasting Blood Sugar': '142 mg/dL',
        'Post-Prandial Blood Sugar': '210 mg/dL',
      },
      abnormality_flags: ['High HbA1c (7.8%)', 'Elevated Fasting Glucose (142 mg/dL)'],
      ai_summary: 'Suboptimal glycemic control indicating active diabetes progression. Lifestyle and pharmacotherapy review indicated.',
    };
  }

  if (isKidney) {
    return {
      test_name: 'Renal Function Test (RFT)',
      extracted_metrics: {
        'Serum Creatinine': '1.6 mg/dL',
        'Blood Urea Nitrogen': '28 mg/dL',
        'eGFR': '54 mL/min/1.73m²',
      },
      abnormality_flags: ['Elevated Serum Creatinine (1.6 mg/dL)', 'Reduced eGFR (Stage 3a CKD)'],
      ai_summary: 'Mild renal impairment observed. Monitor hydration and adjust dosages of renally-cleared medications.',
    };
  }

  return {
    test_name: 'Comprehensive Health Panel',
    extracted_metrics: {
      'Hemoglobin': '11.8 g/dL',
      'Total Cholesterol': '225 mg/dL',
      'Serum Creatinine': '1.1 mg/dL',
      'HbA1c': '6.4 %',
    },
    abnormality_flags: ['Borderline Total Cholesterol (225 mg/dL)', 'Pre-diabetic HbA1c (6.4%)'],
    ai_summary: 'Borderline dyslipidemia and pre-diabetes noted. Recommend dietary lifestyle modifications and 3-month lipid re-evaluation.',
  };
}

function mockClinicalTrack(context: any) {
  const complaints: string[] = context?.current_complaints || [];
  const allergies: string[] = context?.allergies || [];
  const conditions: string[] = context?.chronic_conditions || [];

  const text = `${complaints.join(' ')} ${conditions.join(' ')}`.toLowerCase();

  const isFever = text.includes('fever') || text.includes('cough') || text.includes('cold');
  const isHTN = text.includes('hypertension') || text.includes('bp') || text.includes('chest pain');
  const isDiabetic = text.includes('diabetes') || text.includes('sugar');

  const warnings: string[] = [];
  allergies.forEach((a) => warnings.push(`Patient has known allergy to: ${a}. Avoid related cross-reactive drug classes.`));
  if (conditions.includes('Hypertension') || isHTN) {
    warnings.push('Avoid NSAIDs if possible to prevent BP elevation or nephrotoxicity.');
  }

  const medications = [];

  if (isFever) {
    medications.push({
      generic_name: 'Paracetamol',
      suggested_brand: 'Calpol',
      strength: '650 mg',
      schedule: '1+0+1',
      duration: '5 Days',
      rationale: 'Antipyretic and analgesic for fever and cold symptoms.',
    });
    medications.push({
      generic_name: 'Levocetirizine',
      suggested_brand: 'Levocet',
      strength: '5 mg',
      schedule: '0+0+1',
      duration: '5 Days',
      rationale: 'Second-generation antihistamine to alleviate allergic rhinorrhea and sneezing.',
    });
  } else if (isDiabetic) {
    medications.push({
      generic_name: 'Metformin',
      suggested_brand: 'Glucophage',
      strength: '500 mg',
      schedule: '1+0+1',
      duration: '30 Days',
      rationale: 'First-line biguanide for glycemic management.',
    });
  } else {
    medications.push({
      generic_name: 'Pantoprazole',
      suggested_brand: 'Pan 40',
      strength: '40 mg',
      schedule: '1+0+0',
      duration: '14 Days',
      rationale: 'Proton-pump inhibitor for gastroprotection and acid reflux.',
    });
    medications.push({
      generic_name: 'Multivitamin & Zinc',
      suggested_brand: 'Becozinc',
      strength: 'Standard',
      schedule: '0+1+0',
      duration: '30 Days',
      rationale: 'Nutritional and immune co-factor support.',
    });
  }

  return {
    differential_diagnoses: isFever
      ? ['Acute Viral Upper Respiratory Tract Infection', 'Acute Bronchitis', 'Allergic Rhinitis']
      : isDiabetic
        ? ['Type 2 Diabetes Mellitus with Metabolic Syndrome', 'Impaired Fasting Glucose']
        : ['General Malaise / Tension Syndrome', 'Gastroesophageal Reflux Disease (GERD)'],
    suggested_medications: medications,
    recommended_investigations: isFever
      ? ['Complete Blood Count (CBC)', 'Chest X-Ray (if fever > 5 days)']
      : ['HbA1c & Fasting Blood Sugar', 'Lipid Profile', 'Serum Creatinine & Electrolytes'],
    safety_warnings: warnings.length > 0 ? warnings : ['Verify baseline renal and hepatic parameters before long-term therapy.'],
  };
}
