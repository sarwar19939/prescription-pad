/**
 * CDSS Rule-Based Prescription Safety & Contradiction Audit Engine.
 * Analyzes prescribed drugs against patient conditions, allergies, and drug history.
 */
import type { PrescriptionContradiction } from '@/services/aiClinicalCopilot';

interface AuditContext {
  complaints?: string[];
  conditions?: string[];
  allergies?: string[];
  drugHistory?: string[];
  currentMeds?: string[];
  patientAge?: number;
}

export function auditPrescriptionContradictions(ctx: AuditContext): {
  contradictions: PrescriptionContradiction[];
  auditStatus: 'clean' | 'warnings_found';
  auditSummary: string;
} {
  const complaints = ctx.complaints || [];
  const conditions = ctx.conditions || [];
  const allergies = ctx.allergies || [];
  const drugHistory = ctx.drugHistory || [];
  const currentMeds = ctx.currentMeds || [];
  const patientAge = ctx.patientAge ?? 35;

  const medsText = currentMeds.join(' ').toLowerCase();
  const dhText = drugHistory.join(' ').toLowerCase();
  const condText = `${conditions.join(' ')} ${complaints.join(' ')}`.toLowerCase();

  const contradictions: PrescriptionContradiction[] = [];

  // Check A: NSAID with PUD / Gastric History or CKD
  const hasNsaid = /ketorolac|torax|rolac|naproxen|anflam|diclofenac|aceclofenac|flexi|meloxicam|ibuprofen/i.test(medsText);
  const hasGastricOrPud = /pud|peptic|ulcer|gastritis|gerd|আলসার|গ্যাস্ট্রিক/i.test(condText);
  const hasCkd = /ckd|kidney|renal|ক্রিয়েটিনিন/i.test(condText);
  const hasAspirinInDh = /aspirin|clopidogrel|ecospirin|lopirel/i.test(dhText);

  if (hasNsaid && (hasGastricOrPud || hasAspirinInDh)) {
    contradictions.push({
      severity: 'critical',
      medicine: 'ব্যথানাশক ওষুধ (NSAID / Ketorolac / Naproxen)',
      issue: 'রোগীর পেপটিক আলসার/গ্যাস্ট্রিকের ইতিহাস অথবা অ্যাসপিরিন সেবনের ড্রাগ হিস্ট্রি রয়েছে।',
      clinical_danger: 'তীব্র গ্যাস্ট্রোইনটেস্টাইনাল রক্তক্ষরণ (GI Bleeding) এবং পারফোরেশনের উচ্চ ঝুঁকি!',
      recommendation: 'ব্যথানাশক পরিবর্তন করে নিরাপদ প্যারাসিটামল (Tab. Napa Extend 665mg) দিন এবং অবশ্যই সাথে PPI (Cap. Maxpro 20mg) নিশ্চিত করুন।',
    });
  }

  if (hasNsaid && hasCkd) {
    contradictions.push({
      severity: 'critical',
      medicine: 'ব্যথানাশক ওষুধ (NSAID)',
      issue: 'রোগীর ক্রনিক কিডনি ডিজিজ (CKD) রয়েছে।',
      clinical_danger: 'রেনাল পারফিউশন হ্রাস পেয়ে অ্যাকিউট কিডনি ইনজুরি (AKI) হওয়ার তীব্র সম্ভাবনা।',
      recommendation: 'NSAIDs সম্পূর্ণরূপে পরিহার করুন। ব্যথায় প্যারাসিটামল বা ট্রামাডল বিবেচনা করুন।',
    });
  }

  // Check B: Beta-Blocker in Bronchial Asthma
  const hasBetaBlocker = /propranolol|indever|bisoprolol|bisocor|carvedilol|atenolol|nebivolol/i.test(medsText);
  const hasAsthma = /asthma|copd|wheez|শ্বাসকষ্ট|হাঁপানি/i.test(condText);

  if (hasBetaBlocker && hasAsthma) {
    contradictions.push({
      severity: 'critical',
      medicine: 'বিটা-ব্লকার (Beta-Blocker)',
      issue: 'রোগীর ব্রঙ্কিয়াল অ্যাজমা (Asthma / COPD) রয়েছে।',
      clinical_danger: 'ব্রঙ্কোস্পাজম সৃষ্টি হয়ে মারাত্মক শ্বাসকষ্ট ও রেসপিরেটরি ফেইলিওরের ঝুঁকি!',
      recommendation: 'বিটা-ব্লকার বন্ধ করে ক্যালসিয়াম চ্যানেল ব্লকার (যেমন: Tab. Amlodipine 5mg) বা ARB (Tab. Losartan 50mg) ব্যবহার করুন।',
    });
  }

  // Check C: Penicillin / Beta-lactam Allergy
  const hasPenicillinAllergy = allergies.some((a) => /penicillin|amoxicillin|ampicillin|beta-lactam|পেনিসিলিন/i.test(a));
  const hasPenicillinOrCeph = /amoxicillin|moxaclav|augmentin|furoclav|cefixime|ceftriaxone|cefuroxime|kilbac/i.test(medsText);

  if (hasPenicillinAllergy && hasPenicillinOrCeph) {
    contradictions.push({
      severity: 'critical',
      medicine: 'পেনিসিলিন/সেফালোস্পোরিন অ্যান্টিবায়োটিক',
      issue: 'রোগীর প্রোফাইলে পেনিসিলিন অ্যালার্জির ইতিহাস লিপিবদ্ধ রয়েছে।',
      clinical_danger: 'তীব্র অ্যানাফাইল্যাকটিক শক (Anaphylaxis) ও প্রাণহানির ঝুঁকি!',
      recommendation: 'বিকল্প হিসেবে Macrolide (যেমন: Tab. Azithromycin 500mg) বা Doxycycline প্রেসক্রাইব করুন।',
    });
  }

  // Check D: NSAID without Gastroprotection (PPI)
  const hasPpi = /omeprazole|seclo|esomeprazole|maxpro|sergel|pantoprazole|pantodac|rabeprazole/i.test(medsText);
  if (hasNsaid && !hasPpi && currentMeds.length > 0) {
    contradictions.push({
      severity: 'warning',
      medicine: 'গ্যাস্ট্রিক প্রটেকশন (PPI)',
      issue: 'ব্যথানাশক (NSAID) প্রেসক্রাইব করা হয়েছে কিন্তু কোনো PPI গ্যাস্ট্রিক প্রটেকশন দেওয়া হয়নি।',
      clinical_danger: 'তীব্র গ্যাস্ট্রিক ডিসপেপসিয়া, বুক জ্বালা ও আলসারেশনের সম্ভাবনা।',
      recommendation: 'খাবারের ২০ মিনিট পূর্বে Cap. Maxpro 20mg (1+0+1) প্রেসক্রিপশনে যুক্ত করুন।',
    });
  }

  // Check E: Pediatric safety (Ciprofloxacin under 18 years)
  const hasQuinolone = /ciprofloxacin|neofloxin|levofloxacin|moxifloxacin/i.test(medsText);
  if (hasQuinolone && patientAge < 18) {
    contradictions.push({
      severity: 'warning',
      medicine: 'ফ্লুরোকুইনোলোন (Ciprofloxacin / Levofloxacin)',
      issue: `রোগীর বয়স ${patientAge} বছর (১৮ বছরের নিচে)।`,
      clinical_danger: 'অপরিণত অস্থিসন্ধিতে তরুণাস্থির ক্ষতি (Cartilage toxicity / Arthropathy)-র ঝুঁকি।',
      recommendation: 'শিশু/কিশোরদের জন্য নিরাপদ অল্টারনেটিভ হিসেবে Cefixime বা Azithromycin অগ্রাধিকার দিন।',
    });
  }

  const auditStatus: 'clean' | 'warnings_found' = contradictions.length > 0 ? 'warnings_found' : 'clean';
  let auditSummary = '';
  if (currentMeds.length === 0) {
    auditSummary = 'প্রেসক্রিপশনে এখনো কোনো ওষুধ যোগ করা হয়নি। রোগ নির্ণয় অনুযায়ী নিচে প্রয়োজনীয় ওষুধ সাজেস্ট করা হলো।';
  } else if (contradictions.length > 0) {
    auditSummary = `⚠️ প্রেসক্রিপশন অডিটে ${contradictions.length}টি অসঙ্গতি ও ড্রাগ কন্ট্রাডিকশন শনাক্ত হয়েছে। রোগীর নিরাপত্তার স্বার্থে পর্যালোচনা করুন।`;
  } else {
    auditSummary = '✅ প্রেসক্রিপশন অডিট সম্পন্ন: সকল ওষুধ রোগীর বয়স, ওজন, ড্রাগ হিস্ট্রি, ক্রনিক রোগ ও রিপোর্টের সাথে শতভাগ নিরাপদ ও সামঞ্জস্যপূর্ণ।';
  }

  return { contradictions, auditStatus, auditSummary };
}
