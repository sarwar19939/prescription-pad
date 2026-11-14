/**
 * Intelligent Mock Engine for Laboratory & Diagnostic Medical Investigations.
 * Handles ECG, MRI, CT, X-Ray, Blood Sugar, RFT/Creatinine, CBC, LFT, Lipid, Urine, Thyroid, USG.
 * Never hallucinate fake diseases if content is not provided or normal.
 */
import {
  getCbcProtocol,
  getLftProtocol,
  getLipidProtocol,
  getThyroidProtocol,
  getUrineProtocol,
  getUsgProtocol,
} from './mockLabBloodProtocols';

export function mockLabAnalysis(payload: {
  content?: string;
  testName?: string;
  fileName?: string;
  reportType?: string;
}) {
  const content = (payload?.content || '').toLowerCase();
  const testName = (payload?.testName || '').toLowerCase();
  const fileName = (payload?.fileName || '').toLowerCase();
  const reportType = (payload?.reportType || '').toLowerCase();
  const combined = `${content} ${testName} ${fileName} ${reportType}`.trim();

  // If no content or metadata provided, return clean empty
  if (!combined) {
    return {
      report_type: 'other', test_name: '', clinical_impression: '',
      key_findings: [], extracted_metrics: {}, abnormality_flags: [],
      suggested_diagnosis: '', recommended_actions: [], ai_summary: '',
    };
  }

  // 1. ECG Analysis (ইসিজি বিশ্লেষণ)
  if (combined.includes('ecg') || combined.includes('ekg') || combined.includes('ইসিজি') || combined.includes('tracing')) {
    const isAbnormalEcg = combined.includes('stemi') || combined.includes('infarct') || combined.includes('elevation') || combined.includes('ischemia') || combined.includes('arrhythmia') || combined.includes('chest pain') || combined.includes('বুকের ব্যথা');
    if (isAbnormalEcg) {
      return {
        report_type: 'ecg',
        test_name: '12-Lead Electrocardiogram (ECG)',
        clinical_impression: 'Acute Anteroseptal Myocardial Infarction (STEMI)',
        key_findings: [
          'Heart Rate: 96 bpm, Sinus Rhythm',
          'Significant ST-segment elevation (>2.5mm) in precordial leads V1, V2, V3, V4',
          'Reciprocal ST depression in inferior leads II, III, aVF',
          'Hyperacute T waves followed by early Q-wave development in V1-V2',
        ],
        extracted_metrics: { 'Heart Rate': '96 bpm', 'Rhythm': 'Sinus Rhythm', 'ST Elevation': 'Leads V1-V4 (>2.5mm)', 'Reciprocal Changes': 'Leads II, III, aVF' },
        abnormality_flags: ['CRITICAL ALERT: ST-Elevation in Anteroseptal Leads (V1-V4)', 'Reciprocal ST Depression in Inferior Leads'],
        suggested_diagnosis: 'Acute Anteroseptal STEMI (Myocardial Infarction)',
        recommended_actions: ['তাৎক্ষণিক সিসিইউ (CCU) বা কার্ডিওলজি রেফারেল', 'Aspirin 300mg + Clopidogrel 300mg + Atorvastatin 80mg লোডিং ডোজ', 'প্রাইমারি পিসিআই (PCI) বা থ্রম্বোলাইসিস প্রিপারেশন'],
        ai_summary: 'ইসিজি ট্রেসিং বিশ্লেষণে V1-V4 লিডে আশঙ্কাজনক ST-এলিভেশন ও রেসিপ্রোকাল ডিপ্রেশন পরিলক্ষিত হচ্ছে যা তাৎক্ষণিক হার্ট অ্যাটাক (STEMI) নির্দেশ করে।',
      };
    }
    return {
      report_type: 'ecg',
      test_name: '12-Lead Electrocardiogram (ECG)',
      clinical_impression: 'ইসিজি ট্রেসিং স্বাভাবিক: সাইনাস রিদম (HR 72 bpm), কোনো অ্যাকিউট ইসকেমিক বা ST-T পরিবর্তন নেই।',
      key_findings: [
        'Normal Sinus Rhythm at 72 bpm',
        'Normal P wave morphology and PR interval (150 ms)',
        'Normal QRS complex axis and duration (88 ms)',
        'No ST-segment elevation or depression, normal T waves',
      ],
      extracted_metrics: { 'Heart Rate': '72 bpm', 'Rhythm': 'Normal Sinus', 'ST Segment': 'Isoelectric (Normal)', 'QTc': '410 ms (Normal)' },
      abnormality_flags: [],
      suggested_diagnosis: '',
      recommended_actions: ['কোনো জরুরি কার্ডিয়াক হস্তক্ষেপের প্রয়োজন নেই, রুটিন স্বাস্থ্যবিধি বজায় রাখুন।'],
      ai_summary: 'ইসিজি ট্রেসিং সম্পূর্ণ স্বাভাবিক সীমার মধ্যে রয়েছে, কোনো অ্যাকিউট ইসকেমিক পরিবর্তন নেই।',
    };
  }

  // 2. MRI & CT Scan Analysis (এমআরআই ও সিটি স্ক্যান)
  if (combined.includes('mri') || combined.includes('ct scan') || combined.includes('spine') || combined.includes('এমআরআই')) {
    const isAbnormalMri = combined.includes('disc') || combined.includes('extrusion') || combined.includes('herniat') || combined.includes('prolapse') || combined.includes('pivd') || combined.includes('stenosis') || combined.includes('sciatica');
    if (isAbnormalMri) {
      return {
        report_type: 'mri',
        test_name: 'MRI of Lumbar Spine (L-Spine)',
        clinical_impression: 'L4-L5 Posterior Central & Left Paracentral Disc Extrusion with Left L5 Traversing Nerve Root Impingement (PIVD)',
        key_findings: [
          'Loss of normal lumbar lordosis secondary to paravertebral muscle spasm',
          'L4-L5 intervertebral disc desiccation with significant posterior disc herniation (6.2 mm)',
          'Definite thecal sac compression and crowding of the cauda equina nerve roots',
          'Severe left neural foraminal narrowing with impingement of the traversing left L5 root',
        ],
        extracted_metrics: { 'Herniation Level': 'L4-L5 (6.2 mm)', 'Nerve Impingement': 'Left L5 Root (+)', 'Thecal Sac': 'Compressed' },
        abnormality_flags: ['Significant L4-L5 Disc Herniation (PIVD)', 'Left L5 Nerve Root Impingement / Radiculopathy'],
        suggested_diagnosis: 'Lumbar PIVD (L4-L5 Disc Extrusion with Sciatica / Radiculopathy)',
        recommended_actions: ['স্পাইন সার্জন বা নিউরোমেডিসিন বিশেষজ্ঞের পরামর্শ', 'ভারী বস্তু তোলা ও সামনে ঝুঁকে বসা সম্পূর্ণ নিষেধ', 'স্বল্পমেয়াদী ব্যথানাশক + নার্ভ পেইনের ওষুধ (Pregabalin) + PPI'],
        ai_summary: 'লাম্বার স্পাইন এমআরআই ফিল্ম বিশ্লেষণে L4-L5 ডিস্ক স্থানচ্যুতি ও বামদিকের L5 নার্ভ রুটে চাপ পরিলক্ষিত হয়েছে যা কোমর ও পায়ে ব্যথার (Sciatica) কারণ।',
      };
    }
    return {
      report_type: 'mri',
      test_name: 'MRI Scan',
      clinical_impression: 'এমআরআই স্ক্যান স্বাভাবিক: কোনো ডিস্ক স্থানচ্যুতি, স্পাইনাল স্টেনোসিস বা নার্ভ কম্প্রেশন পাওয়া যায়নি।',
      key_findings: ['Normal anatomical vertebral alignment and spinal curvature', 'Normal intervertebral disc height and signal intensity', 'Spinal canal, thecal sac and exit foramina are widely patent'],
      extracted_metrics: { 'Spinal Alignment': 'Normal', 'Thecal Sac': 'Normal' },
      abnormality_flags: [],
      suggested_diagnosis: '',
      recommended_actions: ['রুটিন পর্যবেক্ষণ ও নিয়মিত হালকা ব্যায়াম।'],
      ai_summary: 'এমআরআই স্ক্যান সম্পূর্ণ স্বাভাবিক সীমার মধ্যে রয়েছে, কোনো অ্যাক্সট্রা-ডুরাল বা নার্ভের চাপ নেই।',
    };
  }

  // 3. X-Ray Analysis (এক্স-রে)
  if (combined.includes('xray') || combined.includes('x-ray') || combined.includes('chest') || combined.includes('lung') || combined.includes('এক্স-রে')) {
    const isAbnormalXray = combined.includes('consolidation') || combined.includes('pneumonia') || combined.includes('opacity') || combined.includes('infiltrate') || combined.includes('fracture');
    if (isAbnormalXray) {
      return {
        report_type: 'xray',
        test_name: 'Digital Chest X-Ray P/A View',
        clinical_impression: 'Right Lower Lobe Consolidation (Community Acquired Lobar Pneumonia)',
        key_findings: [
          'Dense non-homogeneous opacity in the right lower pulmonary zone',
          'Air bronchogram sign clearly visible within the consolidated segment',
          'Costophrenic and cardiophrenic angles appear sharp bilaterally',
        ],
        extracted_metrics: { 'Site': 'Right Lower Lobe', 'Consolidation': 'Present (+)', 'CTR': '0.45 (Normal)' },
        abnormality_flags: ['Right Lower Lobe Lobar Consolidation', 'Active Bacterial Pulmonary Infection'],
        suggested_diagnosis: 'Community Acquired Pneumonia (CAP)',
        recommended_actions: ['উপযুক্ত অ্যান্টিবায়োটিক থেরাপি (যেমন: Co-amoxiclav বা Azithromycin)', 'পর্যাপ্ত উষ্ণ পানি পান ও কুসুম গরম পানির ভাপ'],
        ai_summary: 'বুকের ডিজিটাল এক্স-রেতে ডান ফুসফুসে নিউমোনিয়ার কনসলিডেশন দৃশ্যমান। উপযুক্ত অ্যান্টিবায়োটিক দিয়ে চিকিৎসা প্রয়োজন।',
      };
    }
    return {
      report_type: 'xray',
      test_name: 'Chest X-Ray P/A View',
      clinical_impression: 'বুকের এক্স-রে সম্পূর্ণ স্বাভাবিক: ফুসফুসের ফিল্ড পরিষ্কার, হৃদপিণ্ডের আকার স্বাভাবিক ও ডায়াফ্রাম স্পষ্ট।',
      key_findings: ['Both lung fields are clear of focal consolidation, mass or infiltrate', 'Normal cardiothoracic ratio (<0.50)', 'Costophrenic and cardiophrenic angles appear sharp bilaterally'],
      extracted_metrics: { 'Lung Fields': 'Clear', 'CTR': '<0.50 (Normal)' },
      abnormality_flags: [],
      suggested_diagnosis: '',
      recommended_actions: ['রুটিন পর্যবেক্ষণ।'],
      ai_summary: 'বুকের এক্স-রে পরীক্ষায় কোনো সক্রিয় প্যাথলজি পাওয়া যায়নি।',
    };
  }

  // 4. Diabetes / Glycemic Report (সুগার / ডায়াবেটিস)
  if (combined.includes('sugar') || combined.includes('glucose') || combined.includes('hba1c') || combined.includes('রক্তের শর্করা')) {
    const isHighSugar = combined.includes('high') || combined.includes('elevated') || combined.includes('uncontrolled') || combined.includes('160') || combined.includes('180') || combined.includes('200') || combined.includes('8.') || combined.includes('9.') || combined.includes('10.');
    if (isHighSugar) {
      return {
        report_type: 'lab_report',
        test_name: 'Comprehensive Glycemic Profile',
        clinical_impression: 'Uncontrolled Type 2 Diabetes Mellitus with High Glycemic Variability',
        key_findings: ['HbA1c significantly elevated at 8.4% (Target: <7.0%)', 'Fasting Blood Glucose: 168 mg/dL (Normal: 70-100 mg/dL)'],
        extracted_metrics: { 'HbA1c': '8.4 %', 'Fasting Blood Sugar': '168 mg/dL' },
        abnormality_flags: ['Significantly Elevated HbA1c (8.4%)', 'High Fasting Hyperglycemia (168 mg/dL)'],
        suggested_diagnosis: 'Uncontrolled Type 2 Diabetes Mellitus',
        recommended_actions: ['অ্যান্টিডায়াবেটিক ওষুধের ডোজ সমন্বয়', 'খাদ্যাভ্যাসে মিষ্টি সম্পূর্ণ বর্জন ও প্রতিদিন ৩০ মিনিট হাঁটা'],
        ai_summary: 'রিপোর্টে রক্তের গ্লুকোজ ও HbA1c (৮.৪%) বেশি পাওয়া গেছে যা অনিয়ন্ত্রিত ডায়াবেটিস নির্দেশ করে।',
      };
    }
    return {
      report_type: 'lab_report',
      test_name: 'Glycemic Profile',
      clinical_impression: 'রক্তের শর্করা স্বাভাবিক: ফাস্টিং সুগার ও HbA1c প্রমিত সীমার মধ্যে রয়েছে।',
      key_findings: ['Fasting Blood Sugar: 88 mg/dL (Normal: 70 - 100 mg/dL)', 'HbA1c: 5.4% (Normal: <5.7%)'],
      extracted_metrics: { 'Fasting Blood Sugar': '88 mg/dL', 'HbA1c': '5.4 %' },
      abnormality_flags: [],
      suggested_diagnosis: '',
      recommended_actions: ['সুষম খাদ্যাভ্যাস বজায় রাখুন।'],
      ai_summary: 'রক্তের গ্লুকোজ ও HbA1c রিপোর্ট স্বাভাবিক রয়েছে।',
    };
  }

  // 5. Renal Function Test (কিডনি ফাংশন টেস্ট / Creatinine)
  if (combined.includes('creatinine') || combined.includes('urea') || combined.includes('egfr') || combined.includes('ক্রিয়েটিনিন')) {
    const isHighCreatinine = combined.includes('high') || combined.includes('elevated') || combined.includes('1.6') || combined.includes('1.7') || combined.includes('1.8') || combined.includes('2.');
    if (isHighCreatinine) {
      return {
        report_type: 'lab_report',
        test_name: 'Renal Function Test (RFT)',
        clinical_impression: 'Moderate Renal Impairment / Stage 3a Chronic Kidney Disease',
        key_findings: ['Serum Creatinine elevated at 1.72 mg/dL (Normal: 0.7 - 1.3 mg/dL)', 'Estimated GFR: 48 mL/min/1.73m²'],
        extracted_metrics: { 'Serum Creatinine': '1.72 mg/dL', 'eGFR': '48 mL/min/1.73m²' },
        abnormality_flags: ['Elevated Serum Creatinine (1.72 mg/dL)', 'Reduced eGFR (Stage 3a CKD)'],
        suggested_diagnosis: 'Chronic Kidney Disease (Stage 3a)',
        recommended_actions: ['NSAIDs ও নেফ্রোটক্সিক ওষুধ সম্পূর্ণ বর্জন', 'কিডনি বিশেষজ্ঞ (নেফ্রোলজিস্ট) এর ফলো-আপ'],
        ai_summary: 'রেনাল ফাংশন টেস্টে সিরাম ক্রিয়েটিনিন বেশি পাওয়া গেছে। ব্যথানাশক ওষুধ সম্পূর্ণ এড়িয়ে চলুন।',
      };
    }
    return {
      report_type: 'lab_report',
      test_name: 'Renal Function Test (RFT)',
      clinical_impression: 'কিডনি ফাংশন টেস্ট সম্পূর্ণ স্বাভাবিক (Normal Renal Function)।',
      key_findings: ['Serum Creatinine: 0.9 mg/dL (Normal: 0.7 - 1.3 mg/dL)', 'Estimated GFR: >90 mL/min/1.73m²'],
      extracted_metrics: { 'Serum Creatinine': '0.9 mg/dL', 'eGFR': '>90 mL/min' },
      abnormality_flags: [],
      suggested_diagnosis: '',
      recommended_actions: ['পর্যাপ্ত পানি পান করুন।'],
      ai_summary: 'কিডনির কার্যক্ষমতা সম্পূর্ণ স্বাভাবিক সীমার মধ্যে রয়েছে।',
    };
  }

  // 6. Complete Blood Count (CBC)
  if (combined.includes('cbc') || combined.includes('hemoglobin') || combined.includes('platelet') || combined.includes('wbc') || combined.includes('রক্তের')) {
    return getCbcProtocol(combined);
  }

  // 7. Liver Function Test (LFT)
  if (combined.includes('lft') || combined.includes('alt') || combined.includes('sgpt') || combined.includes('bilirubin') || combined.includes('জন্ডিস') || combined.includes('লিভার')) {
    return getLftProtocol(combined);
  }

  // 8. Lipid Profile
  if (combined.includes('lipid') || combined.includes('cholesterol') || combined.includes('triglyceride') || combined.includes('চর্বি')) {
    return getLipidProtocol(combined);
  }

  // 9. Urine R/M/E
  if (combined.includes('urine') || combined.includes('প্রস্রাব') || combined.includes('uti') || combined.includes('r/m/e')) {
    return getUrineProtocol(combined);
  }

  // 10. Thyroid Function Test (TSH)
  if (combined.includes('thyroid') || combined.includes('tsh') || combined.includes('থাইরয়েড') || combined.includes('ft4')) {
    return getThyroidProtocol(combined);
  }

  // 11. USG of Abdomen
  if (combined.includes('usg') || combined.includes('ultrasound') || combined.includes('আল্ট্রা')) {
    return getUsgProtocol(combined);
  }

  // 12. Generic Normal Fallback for other lab tests
  return {
    report_type: (payload?.reportType as any) || 'lab_report',
    test_name: payload?.testName || 'Investigation Report',
    clinical_impression: 'পরীক্ষার রিপোর্ট স্বাভাবিক: কোনো আশঙ্কাজনক বা তাৎক্ষণিক প্যাথলজি শনাক্ত হয়নি।',
    key_findings: ['সকল ক্লিনিক্যাল প্যারামিটার স্বাভাবিক সীমার মধ্যে রয়েছে।'],
    extracted_metrics: {},
    abnormality_flags: [],
    suggested_diagnosis: '',
    recommended_actions: ['রুটিন স্বাস্থ্যবিধি মেনে চলুন।'],
    ai_summary: 'রিপোর্টে কোনো অস্বাভাবিকতা পরিলক্ষিত হয়নি।',
  };
}
