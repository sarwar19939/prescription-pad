/**
 * Mock Ambient Scribe Handler for Offline Fallback & Testing.
 * Provides standard Medical English chief complaints, history notes, and examination findings.
 */
import type { ScribeExtractionResult } from '@/services/aiScribeService';

export function mockAmbientScribe(payload: any): ScribeExtractionResult {
  const text = (payload?.transcript || '').toLowerCase();

  const isFever = text.includes('জ্বর') || text.includes('fever') || text.includes('গরম');
  const isCough = text.includes('কাশি') || text.includes('cough') || text.includes('কফ');
  const isGastric = text.includes('গ্যাস') || text.includes('বুক জ্বালা') || text.includes('gastric') || text.includes('acidity');

  if (isFever && isCough) {
    return {
      chief_complaints: ['High-grade continuous fever for 3 days', 'Dry irritating cough', 'Generalized body ache & myalgia'],
      vitals_mentioned: { temp: '101°F', pulse: '84 bpm' },
      history_notes: ['No prior history of bronchial asthma, wheezing, or known drug allergies', 'Took paracetamol with transient antipyretic relief'],
      examination_findings: 'Pharynx congested. Chest is clinically clear with bilateral vesicular breath sounds. No ronchi or crepitations.',
      advice: [
        'কুসুম গরম পানিতে লেবু ও মধু মিশিয়ে দিনে ২-৩ বার পান করুন।',
        'লবণ-গরম পানি দিয়ে নিয়মিত গড়গড়া করুন ও ফুটন্ত পানির ভাপ নিন।',
        'ঠাণ্ডা পানি ও আইসক্রিম সম্পূর্ণ পরিহার করুন।',
        'জ্বর ৩ দিনের বেশি স্থায়ী হলে সিবিসি ও ডেঙ্গু এনএস১ টেস্ট করান।',
      ],
      summary: 'Patient presented with 3-day history of febrile illness and cough. Physical exam shows congested pharynx with clear chest.',
    };
  }

  if (isGastric) {
    return {
      chief_complaints: ['Severe retrosternal burning pain (Heartburn)', 'Postprandial upper abdominal distension & fullness', 'Acid regurgitation & sour eructation'],
      vitals_mentioned: { bp: '120/80', pulse: '76 bpm' },
      history_notes: ['Symptoms aggravated following consumption of heavy, oily hotel food', 'No history of hematemesis, melena, or unintentional weight loss'],
      examination_findings: 'Abdomen: Soft, non-distended, mild epigastric tenderness on deep palpation. Normal bowel sounds.',
      advice: [
        'খাওয়ার পরপরই শুয়ে পড়বেন না, অন্তত ২ ঘণ্টা পর ঘুমাতে যান।',
        'চা, কফি, ভাজাপোড়া ও অতিরিক্ত মসলাযুক্ত খাবার বর্জন করুন।',
        'রাতে ঘুমানোর সময় মাথার দিক সামান্য উঁচু রাখুন।',
      ],
      summary: 'Patient presents with severe acid reflux and dyspepsia following heavy dietary intake.',
    };
  }

  return {
    chief_complaints: ['Generalized fatigue & weakness for 1 week', 'Diffuse body ache & malaise'],
    vitals_mentioned: { bp: '120/80', pulse: '74 bpm', temp: '98.4°F' },
    history_notes: ['Sedentary working lifestyle with inadequate hydration and irregular sleep pattern'],
    examination_findings: 'Patient alert and oriented. Systemic clinical examination unremarkable.',
    advice: [
      'প্রতিদিন অন্তত ৮ গ্লাস নিরাপদ বিশুদ্ধ পানি পান করুন।',
      'প্রতি রাতে পর্যাপ্ত ৭-৮ ঘণ্টা গভীর ঘুম নিশ্চিত করুন।',
      'পুষ্টিকর ও সতেজ শাকসবজি এবং ফলমূল নিয়মিত গ্রহণ করুন।',
    ],
    summary: 'Non-specific generalized fatigue. Supportive lifestyle modification and nutritional replenishment indicated.',
  };
}
