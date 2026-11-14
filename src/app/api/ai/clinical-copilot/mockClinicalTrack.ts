/**
 * Clinical Decision Support Coordinator.
 * Dynamically interviews doctor with clarifying questions, adapts differentials based on answers,
 * and confirms treatment protocols for pre-existing or doctor-selected diagnoses.
 */
import type { PrescriptionContradiction, SuggestedMedication } from '@/services/aiClinicalCopilot';
import { DISEASE_PROTOCOL_TEMPLATES } from '@/services/protocolTemplatesData';
import { FEVER_TRACK, GASTRIC_TRACK, GASTRO_TRACK, type CategoryTrackData } from './clinicalTracksData';
import { auditPrescriptionContradictions } from './prescriptionAuditEngine';

export function mockClinicalTrack(context: any) {
  const complaints: string[] = context?.current_complaints || [];
  const allergies: string[] = context?.allergies || [];
  const conditions: string[] = context?.chronic_conditions || [];
  const drugHistory: string[] = context?.drug_history || [];
  const currentMeds: string[] = context?.current_medicines || context?.currentMedicines || [];
  const findings: string = context?.clinicalFindings || '';
  const activeDiagnoses: string[] = context?.activeDiagnoses || context?.active_diagnoses || [];
  const answers: Record<string, string> = context?.doctor_answers || {};
  const patientAge: number = Number(context?.age) || 35;

  const text = `${complaints.join(' ')} ${conditions.join(' ')} ${findings} ${activeDiagnoses.join(' ')}`.toLowerCase();
  const medsText = currentMeds.join(' ').toLowerCase();
  const dhText = drugHistory.join(' ').toLowerCase();

  // 1. Audit Prescription for Contradictions & Medical Errors
  const { contradictions, auditStatus, auditSummary } = auditPrescriptionContradictions({
    complaints,
    conditions,
    allergies,
    drugHistory,
    currentMeds,
    patientAge,
  });

  const warnings: string[] = [];
  allergies.forEach((a) => warnings.push(`Patient has known allergy to: ${a}. Verify drug safety before dispensing.`));

  // Case 0: Empty Context — No complaints, No diagnosis, No findings
  if (complaints.length === 0 && activeDiagnoses.length === 0 && !findings.trim()) {
    return {
      probable_diagnosis: '',
      differential_diagnoses: [],
      suggested_medications: [],
      recommended_investigations: [],
      safety_warnings: warnings,
      prescription_audit_status: auditStatus,
      audit_summary: auditSummary,
      contradictions_and_errors: contradictions,
      clinical_questions: [],
      clinical_summary: 'রোগীর কোনো উপসর্গ বা রোগ নির্ণয় এখনো প্রদান করা হয়নি। চিফ কমপ্লেইন বা ডায়াগনোসিস যুক্ত করলে AI সহায়তা প্রদান করবে।',
      is_confirmed_mode: false,
    };
  }

  // Case 1: Confirmed Diagnosis provided by Doctor
  if (activeDiagnoses.length > 0) {
    const diagLower = activeDiagnoses[0].toLowerCase().trim();
    const matchedProto = DISEASE_PROTOCOL_TEMPLATES.find((p) =>
      p.diagnosisMatch.some((k) => diagLower.includes(k.toLowerCase()) || k.toLowerCase().includes(diagLower)),
    );

    if (matchedProto) {
      const isPediatric = patientAge < 12;
      const protoMeds: SuggestedMedication[] = matchedProto.medicines.map((m) => {
        const usePed = isPediatric && m.pediatric ? m.pediatric : m.adult;
        return {
          generic_name: m.generic_name,
          suggested_brand: m.brand_name,
          dosage_form: usePed.dosage_form,
          strength: usePed.strength,
          schedule: usePed.schedule,
          duration: usePed.duration,
          rationale: `${matchedProto.titleBn} ক্লিনিক্যাল প্রটোকল অনুযায়ী নির্দেশিত।`,
        };
      });

      return {
        probable_diagnosis: activeDiagnoses[0],
        differential_diagnoses: activeDiagnoses,
        suggested_medications: protoMeds,
        recommended_investigations: [],
        safety_warnings: warnings,
        prescription_audit_status: auditStatus,
        audit_summary: auditSummary,
        contradictions_and_errors: contradictions,
        clinical_questions: [],
        clinical_summary: `ডাক্তার কর্তৃক নিশ্চিতকৃত রোগ: "${activeDiagnoses[0]}" এর ক্লিনিক্যাল প্রটোকল প্রস্তুত করা হয়েছে।`,
        is_confirmed_mode: true,
      };
    }
  }

  // Case 2: Symptom matching
  const isGastro =
    text.includes('vomit') ||
    text.includes('diarrhea') ||
    text.includes('diarrhoea') ||
    text.includes('loose motion') ||
    text.includes('watery') ||
    text.includes('stool') ||
    text.includes('cholera') ||
    text.includes('food poisoning') ||
    text.includes('gastroenteritis') ||
    text.includes('dysentery') ||
    text.includes('বমি') ||
    text.includes('পাতলা পায়খানা') ||
    text.includes('ডায়রিয়া') ||
    text.includes('আমাশয়');

  const isFever =
    !isGastro &&
    (text.includes('fever') ||
      text.includes('cough') ||
      text.includes('cold') ||
      text.includes('dengue') ||
      text.includes('sore throat') ||
      text.includes('জ্বর') ||
      text.includes('কাশি') ||
      text.includes('কফ') ||
      text.includes('সর্দি'));

  const isGastric =
    !isGastro &&
    !isFever &&
    (text.includes('gerd') ||
      text.includes('heartburn') ||
      text.includes('acidity') ||
      text.includes('gastric') ||
      text.includes('burning') ||
      text.includes('pud') ||
      text.includes('বুক জ্বালা') ||
      text.includes('টক ঢেকুর') ||
      text.includes('গ্যাস'));

  if (!isGastro && !isFever && !isGastric) {
    return {
      probable_diagnosis: activeDiagnoses[0] || (complaints[0] ? `Suspected ${complaints[0]}` : ''),
      differential_diagnoses: activeDiagnoses.length > 0 ? activeDiagnoses : complaints.slice(0, 3),
      suggested_medications: [],
      recommended_investigations: [],
      safety_warnings: warnings,
      prescription_audit_status: auditStatus,
      audit_summary: auditSummary,
      contradictions_and_errors: contradictions,
      clinical_questions: [],
      clinical_summary: complaints.length > 0
        ? `রোগীর প্রধান উপসর্গ (${complaints.join(', ')}) বিশ্লেষণ করা হয়েছে।`
        : 'রোগীর তথ্য পর্যালোচনা সম্পন্ন।',
      is_confirmed_mode: activeDiagnoses.length > 0,
    };
  }

  let track: CategoryTrackData = GASTRO_TRACK;
  if (isGastro) {
    track = GASTRO_TRACK;
  } else if (isFever) {
    track = FEVER_TRACK;
  } else if (isGastric) {
    track = GASTRIC_TRACK;
  }

  // Doctor pre-existing diagnosis handling
  const isConfirmedMode = activeDiagnoses.length > 0;
  let probableDiagnosis = isConfirmedMode ? activeDiagnoses[0] : track.defaultProbable;
  let differentials = [...track.differentials];
  const medications: SuggestedMedication[] = [...track.medications];

  allergies.forEach((a) => warnings.push(`Patient has known allergy to: ${a}. Verify drug safety before dispensing.`));

  // 3. Dynamic adaptation based on Doctor's Answers to clarifying questions
  const answeredValues = Object.values(answers);
  const stoolAnswer = answers['stool_consistency'] || '';
  const dehyAnswer = answers['dehydration_signs'] || '';
  const feverAnswer = answers['fever_chills'] || '';
  const dengueAnswer = answers['dengue_warning'] || '';

  if (isGastro && !isConfirmedMode) {
    if (stoolAnswer.includes('রক্ত') || stoolAnswer.includes('আম') || stoolAnswer.includes('Dysentery')) {
      probableDiagnosis = 'Bacillary Dysentery (Shigellosis) — রক্ত আমাশয়';
      differentials = [
        'Bacillary Dysentery (Shigellosis)',
        'Acute Watery Diarrhea (AWD)',
        'Amebic Colitis',
      ];
      medications.unshift({
        generic_name: 'Ciprofloxacin',
        suggested_brand: 'Neofloxin',
        strength: '500 mg',
        schedule: '1+0+1',
        duration: '5 Days',
        rationale: 'First-line antimicrobial for acute invasive bacterial dysentery / shigellosis.',
      });
    } else if (dehyAnswer.includes('Severe') || dehyAnswer.includes('চরম নিস্তেজ')) {
      probableDiagnosis = 'Severe Dehydrating Diarrhea (Suspected Cholera)';
      warnings.unshift('EMERGENCY: Patient exhibits severe dehydration signs. Initiate immediate IV Cholera Saline infusion.');
    } else if (stoolAnswer.includes('চালের মাড়') || stoolAnswer.includes('পানির মতো')) {
      probableDiagnosis = 'Acute Watery Diarrhea (AWD) with Dehydration';
    }
  } else if (isFever && !isConfirmedMode) {
    if (dengueAnswer.includes('ব্যথা') || dengueAnswer.includes('ফুসকুড়ি')) {
      probableDiagnosis = 'Dengue Fever Syndrome (DGHS Protocol)';
      differentials = [
        'Dengue Fever Syndrome',
        'Acute Viral Upper Respiratory Infection',
        'Seasonal Influenza',
      ];
      warnings.unshift('Strictly avoid NSAIDs/Steroids due to Dengue hemorrhagic risks. Monitor platelet count daily.');
    } else if (feverAnswer.includes('কাঁপুনি') || feverAnswer.includes('Chills')) {
      probableDiagnosis = 'Enteric (Typhoid) Fever / Severe Sepsis';
      differentials = [
        'Enteric (Typhoid) Fever',
        'Acute Viral Infection',
        'Acute Pyelonephritis',
      ];
    }
  }

  // Ensure probable diagnosis is ranked first in differentials
  differentials = Array.from(new Set([probableDiagnosis, ...differentials]));

  // Clinical Summary Banner
  const relevantAnswers = Object.entries(answers)
    .filter(([qId]) => track.questions.some((q) => q.id === qId))
    .map(([, ans]) => String(ans));

  let summary = '';
  if (isConfirmedMode) {
    summary = `ডাক্তার কর্তৃক নিশ্চিতকৃত ডায়াগনোসিস: "${probableDiagnosis}" এর ওপর ভিত্তি করে প্রটোকল প্রস্তুত করা হয়েছে।`;
  } else if (relevantAnswers.length > 0) {
    summary = `আপনার উত্তর (${relevantAnswers.join('; ')}) বিশ্লেষণ করে সর্বাধিক সম্ভাব্য রোগ "${probableDiagnosis}" নির্ধারণ করা হয়েছে।`;
  } else {
    summary = `রোগীর প্রধান উপসর্গ (${complaints.join(', ') || 'উপসর্গ'}) বিশ্লেষণ করে এআই কো-পাইলটের প্রাথমিক মূল্যায়ন। সঠিকতা নিশ্চিত করতে নিচের প্রশ্নগুলোর উত্তর দিন।`;
  }

  return {
    probable_diagnosis: probableDiagnosis,
    differential_diagnoses: differentials,
    suggested_medications: medications,
    recommended_investigations: track.investigations,
    safety_warnings: warnings,
    prescription_audit_status: auditStatus,
    audit_summary: auditSummary,
    contradictions_and_errors: contradictions,
    clinical_questions: track.questions,
    clinical_summary: summary,
    is_confirmed_mode: isConfirmedMode,
  };
}
