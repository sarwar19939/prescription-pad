/**
 * Clinical Vital Signs Analysis & Interpretation Engine.
 * Provides instant real-time clinical assessment, abnormality classification,
 * and AI-grade clinical insights for doctor ergonomics.
 */
import type { Vitals } from '@/types/schema';

export interface VitalAlert {
  field: keyof Vitals;
  severity: 'rose' | 'amber' | 'emerald';
  badge: string;
  detail: string;
}

export interface VitalAnalysis {
  status: 'normal' | 'caution' | 'critical';
  alerts: VitalAlert[];
  aiSummary: string | null;
}

function parseNum(val?: string | number): number | null {
  if (val === undefined || val === null) return null;
  const match = String(val).match(/[-+]?[0-9]*\.?[0-9]+/);
  return match ? parseFloat(match[0]) : null;
}

export function parseBP(bpStr?: string): { sbp: number | null; dbp: number | null } {
  if (!bpStr) return { sbp: null, dbp: null };
  const parts = bpStr.split(/[\/\-,\s]+/).map((p) => parseNum(p));
  return {
    sbp: parts[0] ?? null,
    dbp: parts[1] ?? null,
  };
}

export function analyzeVitals(vitals?: Partial<Vitals> | null): VitalAnalysis {
  if (!vitals) {
    return { status: 'normal', alerts: [], aiSummary: null };
  }

  const alerts: VitalAlert[] = [];

  // 1. Blood Pressure Check
  const { sbp, dbp } = parseBP(vitals.bp);
  if (sbp !== null && dbp !== null) {
    if (sbp >= 180 || dbp >= 120) {
      alerts.push({
        field: 'bp',
        severity: 'rose',
        badge: 'Hypertensive Crisis',
        detail: `BP ${sbp}/${dbp} mmHg is dangerously elevated. Immediate attention required.`,
      });
    } else if (sbp >= 140 || dbp >= 90) {
      alerts.push({
        field: 'bp',
        severity: 'rose',
        badge: 'Stage 2 HTN',
        detail: `BP ${sbp}/${dbp} mmHg. Antihypertensive therapy / dose titration recommended.`,
      });
    } else if (sbp >= 130 || dbp >= 80) {
      alerts.push({
        field: 'bp',
        severity: 'amber',
        badge: 'Stage 1 HTN',
        detail: `BP ${sbp}/${dbp} mmHg. Monitor and consider lifestyle or low-dose therapy.`,
      });
    } else if (sbp < 90 || dbp < 60) {
      alerts.push({
        field: 'bp',
        severity: 'amber',
        badge: 'Hypotension',
        detail: `BP ${sbp}/${dbp} mmHg is low. Check hydration, sepsis, or drug overtitration.`,
      });
    }
  }

  // 2. Pulse / Heart Rate
  const pulse = parseNum(vitals.pulse);
  if (pulse !== null) {
    if (pulse > 100) {
      alerts.push({
        field: 'pulse',
        severity: pulse > 120 ? 'rose' : 'amber',
        badge: `Tachycardia (${pulse} bpm)`,
        detail: 'Elevated heart rate. Check for fever, anxiety, anemia, or arrhythmia.',
      });
    } else if (pulse < 55) {
      alerts.push({
        field: 'pulse',
        severity: pulse < 45 ? 'rose' : 'amber',
        badge: `Bradycardia (${pulse} bpm)`,
        detail: 'Low heart rate. Caution with beta-blockers / calcium channel blockers.',
      });
    }
  }

  // 3. Temperature
  const temp = parseNum(vitals.temp);
  if (temp !== null) {
    // Normal temp is around 98.6°F, fever > 100°F (or if in Celsius > 37.8°C)
    const isFahrenheit = temp > 45;
    const tempF = isFahrenheit ? temp : (temp * 9) / 5 + 32;

    if (tempF >= 102) {
      alerts.push({
        field: 'temp',
        severity: 'rose',
        badge: `High Fever (${temp}°${isFahrenheit ? 'F' : 'C'})`,
        detail: 'High-grade pyrexia. Regular antipyretic schedule indicated.',
      });
    } else if (tempF >= 100) {
      alerts.push({
        field: 'temp',
        severity: 'amber',
        badge: `Fever (${temp}°${isFahrenheit ? 'F' : 'C'})`,
        detail: 'Pyrexia detected. Paracetamol recommended.',
      });
    }
  }

  // 4. Oxygen Saturation (SpO2)
  const spo2 = parseNum(vitals.spo2);
  if (spo2 !== null) {
    if (spo2 < 90) {
      alerts.push({
        field: 'spo2',
        severity: 'rose',
        badge: `Severe Hypoxia (${spo2}%)`,
        detail: 'Critical oxygen desaturation. Supplemental O₂ indicated.',
      });
    } else if (spo2 < 95) {
      alerts.push({
        field: 'spo2',
        severity: 'amber',
        badge: `Borderline SpO₂ (${spo2}%)`,
        detail: 'Mild hypoxia. Evaluate respiratory status and auscultation.',
      });
    }
  }

  // Determine overall status
  const hasCritical = alerts.some((a) => a.severity === 'rose');
  const hasCaution = alerts.some((a) => a.severity === 'amber');
  const status: VitalAnalysis['status'] = hasCritical ? 'critical' : hasCaution ? 'caution' : 'normal';

  // Generate concise clinical AI summary
  let aiSummary: string | null = null;
  if (alerts.length > 0) {
    aiSummary = alerts.map((a) => a.badge).join(' · ');
  }

  return { status, alerts, aiSummary };
}
