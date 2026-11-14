/**
 * Intelligent Multimodal Image Diagnostic Mock Engine for Clinical Copilot.
 * Supports ECG, Radiology, Scabies, Acne, Eczema, Psoriasis, Urticaria, Zoster, Tinea,
 * and completely avoids hallucinating fake conditions.
 */
import {
  getAcneProtocol,
  getEczemaProtocol,
  getNeutralSkinFallback,
  getOnychomycosisProtocol,
  getPsoriasisProtocol,
  getScabiesProtocol,
  getTineaProtocol,
  getUrticariaProtocol,
  getZosterProtocol,
} from './mockDermProtocols';
import {
  getImpetigoProtocol,
  getMelasmaProtocol,
  getParonychiaCellulitisProtocol,
  getTineaVersicolorProtocol,
  getVitiligoProtocol,
} from './mockDermProtocolsExtended';

export function mockImageAnalysis(payload: any) {
  const notes = (payload?.clinicalNotes || '').toLowerCase();
  const fileName = (payload?.fileName || '').toLowerCase();
  const combined = `${notes} ${fileName}`;

  // 1. 12-Lead ECG / Cardiac Tracing Detection
  const isEcg =
    combined.includes('ecg') ||
    combined.includes('ekg') ||
    combined.includes('tracing') ||
    combined.includes('leads') ||
    combined.includes('ইসিজি') ||
    combined.includes('কার্ডিয়াক') ||
    combined.includes('stemi') ||
    combined.includes('arrhythmia') ||
    combined.includes('heart');

  if (isEcg) {
    const isAbnormal =
      combined.includes('stemi') ||
      combined.includes('ischemia') ||
      combined.includes('infarct') ||
      combined.includes('elevation') ||
      combined.includes('attack');

    if (isAbnormal) {
      return {
        observed_features: [
          '12-Lead Electrocardiogram tracing displaying sinus tachycardia with ischemic changes',
          'ST-segment elevation (>2.0mm) in precordial leads V1-V4 with reciprocal depression in leads II, III, aVF',
          'Pathological hyperacute T waves observed with clinical chest pain correlation',
        ],
        differential_diagnoses: [
          'Acute Anteroseptal STEMI (Myocardial Infarction)',
          'Acute Coronary Syndrome (ACS)',
          'Coronary Vasospasm / Myopericarditis',
        ],
        primary_diagnosis: 'Acute Anteroseptal STEMI (ইসিজি: অ্যাকিউট মায়োকার্ডিয়াল ইনফার্কশন)',
        recommended_workup: [
          'Serum Troponin-I STAT',
          'Immediate Coronary Angiogram / Primary PCI preparation',
          'Bedside Echocardiogram (2D & Doppler)',
        ],
        suggested_treatment: {
          medicines: [
            { brand_name: 'Ecosprin', generic_name: 'Aspirin', dosage_form: 'Tab', strength: '300 mg', schedule: 'STAT (চিবিয়ে)', meal_timing: 'Immediately', duration: '1 Day', special_instructions: 'তাৎক্ষণিক ৪টি ৭৫ মি.গ্রা. ট্যাবলেট একসাথে চিবিয়ে খেতে হবে।' },
            { brand_name: 'Plagrin', generic_name: 'Clopidogrel', dosage_form: 'Tab', strength: '300 mg', schedule: 'STAT', meal_timing: 'Immediately', duration: '1 Day', special_instructions: 'লোডিং ডোজ হিসেবে ৪টি ৭৫ মি.গ্রা. ট্যাবলেট একসাথে সেব্য।' },
            { brand_name: 'Atova', generic_name: 'Atorvastatin', dosage_form: 'Tab', strength: '80 mg', schedule: 'STAT', meal_timing: 'Immediately', duration: '1 Day', special_instructions: 'উচ্চ মাত্রার স্ট্যাটিন লোডিং ডোজ।' },
          ],
          advice: [
            'রোগীকে সম্পূর্ণ বিশ্রামে রাখুন এবং দ্রুত নিকটস্থ সিসিইউ (CCU) বা কার্ডিয়াক সেন্টারে রেফার করুন।',
            'অক্সিজেন স্যাচুরেশন ৯০%-এর নিচে থাকলে ক্যানুলার মাধ্যমে অক্সিজেন সাপোর্ট নিশ্চিত করুন।',
          ],
        },
        safety_warnings: ['জরুরি কার্ডিয়াক চিকিৎসা প্রয়োজন—বিলম্ব না করে দ্রুত কার্ডিওলজি হাসপাতালে স্থানান্তর করুন।'],
      };
    }

    return {
      observed_features: [
        '12-Lead Electrocardiogram tracing: Regular sinus rhythm, normal P wave axis',
        'Heart rate approximately 72-76 bpm, normal PR interval (150 ms), normal QRS duration (88 ms)',
        'Isoelectric ST segments bilaterally; no acute ST-elevation, depression, or pathological Q-waves',
      ],
      differential_diagnoses: [
        'Normal Sinus Rhythm (স্বাভাবিক ইসিজি)',
        'Sinus Arrhythmia (Physiological)',
        'Non-specific minor repolarization variant',
      ],
      primary_diagnosis: 'Normal Sinus Rhythm (ইসিজি: স্বাভাবিক সাইনাস রিদম)',
      recommended_workup: ['রুটিন পর্যবেক্ষণ, উপসর্গ অব্যাহত থাকলে Serum Troponin-I ও 2D Echo'],
      suggested_treatment: {
        medicines: [],
        advice: [
          'ইসিজি ট্রেসিং স্বাভাবিক সীমার মধ্যে রয়েছে, কোনো অ্যাকিউট হার্ট অ্যাটাকের লক্ষণ নেই।',
          'বুকের স্থায়ী ব্যথা, শ্বাসকষ্ট বা ঘাম হলে অবিলম্বে চেম্বার বা জরুরি বিভাগে যোগাযোগ করুন।',
        ],
      },
      safety_warnings: ['স্বাভাবিক ইসিজি কখনো কখনো প্রাথমিক অ্যানজাইনা পুরোপুরি নাকচ করে না; উপসর্গ স্থায়ী হলে ক্লিনিক্যাল পর্যবেক্ষণ রাখুন।'],
    };
  }

  // 2. Radiology / X-Ray / CT / MRI Film
  const isRadiology =
    combined.includes('xray') ||
    combined.includes('x-ray') ||
    combined.includes('mri') ||
    combined.includes('ct scan') ||
    combined.includes('film') ||
    combined.includes('রেডিওলজি') ||
    combined.includes('spine');

  if (isRadiology) {
    return {
      observed_features: [
        'Diagnostic radiological study / imaging film',
        'Normal bony architectures identified; no gross structural collapse detected',
      ],
      differential_diagnoses: [
        'Radiological Study (Normal / Routine)',
        'Mild Degenerative Skeletal Change',
      ],
      primary_diagnosis: 'Radiological Imaging Study (রেডিওলজিক্যাল ফিল্ম)',
      recommended_workup: ['Official Radiologist reading & correlation with physical examination'],
      suggested_treatment: {
        medicines: [],
        advice: ['রেডিওলজিস্টের আনুষ্ঠানিক রিপোর্ট অনুসরণ করুন।'],
      },
      safety_warnings: ['ক্লিনিক্যাল লক্ষণ অনুযায়ী প্রয়োজনে অর্থোপেডিক বা নিউরো বিশেষজ্ঞের পরামর্শ নিন।'],
    };
  }

  // 3. Paronychia / Cellulitis (নখকুনী / সেলুলাইটিস)
  if (combined.includes('cellulitis') || combined.includes('সেলুলাইটিস') || combined.includes('paronychia') || combined.includes('নখকুনী') || combined.includes('nail fold')) {
    return getParonychiaCellulitisProtocol(combined.includes('cellulitis') || combined.includes('সেলুলাইটিস'));
  }

  // 4. Onychomycosis / Nail Fungal Infection (নখের ফাঙ্গাস)
  if (
    combined.includes('onychomycosis') ||
    combined.includes('unguium') ||
    combined.includes('toenail') ||
    ((combined.includes('nail') || combined.includes('নখ')) && (combined.includes('fung') || combined.includes('thick') || combined.includes('crumb') || combined.includes('discolor') || combined.includes('মোটা') || combined.includes('ফাঙ্গাস')))
  ) {
    return getOnychomycosisProtocol();
  }

  // 4. Scabies (খোসপাঁচড়া)
  if (
    combined.includes('scabies') ||
    combined.includes('burrow') ||
    combined.includes('finger web') ||
    combined.includes('web space') ||
    combined.includes('interdigital') ||
    combined.includes('খোসপাঁচড়া') ||
    combined.includes('পাচড়া') ||
    (combined.includes('itch') && (combined.includes('night') || combined.includes('wrist') || combined.includes('রাতের') || combined.includes('আঙ্গুল')))
  ) {
    return getScabiesProtocol();
  }

  // 4. Acne Vulgaris (ব্রণ)
  if (combined.includes('acne') || combined.includes('ব্রণ') || combined.includes('pimple') || combined.includes('comedo')) {
    return getAcneProtocol();
  }

  // 5. Eczema / Atopic Dermatitis (একজিমা)
  if (combined.includes('eczema') || combined.includes('dermatitis') || combined.includes('একজিমা') || combined.includes('ড্রাই') || combined.includes('xerosis')) {
    return getEczemaProtocol();
  }

  // 6. Plaque Psoriasis (সোরিয়াসিস)
  if (combined.includes('psoriasis') || combined.includes('silvery') || combined.includes('scale') || combined.includes('plaque') || combined.includes('সোরিয়াসিস')) {
    return getPsoriasisProtocol();
  }

  // 7. Acute Urticaria (আমবাত)
  if (combined.includes('urticaria') || combined.includes('wheal') || combined.includes('hive') || combined.includes('allergy') || combined.includes('আমবাত') || combined.includes('চাকা')) {
    return getUrticariaProtocol();
  }

  // 8. Herpes Zoster (হারপিস জোস্টার)
  if (combined.includes('zoster') || combined.includes('herpes') || combined.includes('shingles') || combined.includes('ফোস্কা') || combined.includes('দাউদিয়া')) {
    return getZosterProtocol();
  }

  // 9. Tinea Corporis (দাদ) — STRICT: ONLY when fungal/tinea/ringworm explicitly indicated
  if (
    combined.includes('tinea') ||
    combined.includes('ringworm') ||
    combined.includes('fungal') ||
    combined.includes('দাদ') ||
    combined.includes('central clearing') ||
    (combined.includes('annular') && combined.includes('active border'))
  ) {
    return getTineaProtocol();
  }

  // 10. Vitiligo (শ্বেতী রোগ)
  if (combined.includes('vitiligo') || combined.includes('leukoderma') || combined.includes('শ্বেতী') || combined.includes('সাদা দাগ') || combined.includes('depigment')) {
    return getVitiligoProtocol();
  }

  // 11. Pityriasis Versicolor (ছুলি / সেহলি)
  if (combined.includes('versicolor') || combined.includes('ছুলি') || combined.includes('সেহলি') || combined.includes('hypopigment') || combined.includes('malassezia')) {
    return getTineaVersicolorProtocol();
  }

  // 12. Impetigo (ব্যাকটেরিয়াল ফোঁড়া / ইনফেকশন)
  if (combined.includes('impetigo') || combined.includes('honey') || combined.includes('crust') || combined.includes('পুঁজ') || combined.includes('ফোঁড়া')) {
    return getImpetigoProtocol();
  }

  // 13. Melasma (মেছতা)
  if (combined.includes('melasma') || combined.includes('chloasma') || combined.includes('মেছতা') || combined.includes('কালো দাগ')) {
    return getMelasmaProtocol();
  }

  // 14. Paronychia / Cellulitis (নখকুনী / সেলুলাইটিস)
  if (combined.includes('cellulitis') || combined.includes('সেলুলাইটিস') || combined.includes('paronychia') || combined.includes('নখকুনী')) {
    return getParonychiaCellulitisProtocol(combined.includes('cellulitis') || combined.includes('সেলুলাইটিস'));
  }

  // 15. Neutral Fallback — NEVER DEFAULT TO Tinea Corporis OR ANY FAKE ILLNESS
  return getNeutralSkinFallback();
}
