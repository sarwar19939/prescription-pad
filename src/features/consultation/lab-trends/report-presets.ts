/**
 * Common investigation and imaging presets for ECG, MRI, X-ray, and pathology.
 */
export interface ReportPreset {
  name: string;
  reportType?: 'ecg' | 'mri' | 'ct' | 'xray' | 'lab_report';
  metrics: Record<string, string>;
}

export const COMMON_REPORT_PRESETS: ReportPreset[] = [
  {
    name: '12-Lead ECG',
    reportType: 'ecg',
    metrics: { 'Heart Rate': '', 'Rhythm': '', 'ST Segment': '' },
  },
  {
    name: 'Brain MRI / Spine',
    reportType: 'mri',
    metrics: { 'Sequences': '', 'Impression': '' },
  },
  {
    name: 'Chest X-Ray (P/A)',
    reportType: 'xray',
    metrics: { 'Lung Fields': '', 'Cardiothoracic Ratio': '', 'Costophrenic Angles': '' },
  },
  {
    name: 'Glycemic Panel',
    reportType: 'lab_report',
    metrics: { 'HbA1c': '', 'Fasting Blood Sugar': '', '2-Hour Post-Prandial': '' },
  },
  {
    name: 'Renal Function (RFT)',
    reportType: 'lab_report',
    metrics: { 'Serum Creatinine': '', 'Blood Urea': '', 'eGFR': '' },
  },
  {
    name: 'Lipid Profile',
    reportType: 'lab_report',
    metrics: { 'Total Cholesterol': '', 'Triglycerides': '', 'HDL': '', 'LDL': '' },
  },
  {
    name: 'CBC with ESR',
    reportType: 'lab_report',
    metrics: { 'Hemoglobin': '', 'WBC Count': '', 'Platelet Count': '', 'ESR': '' },
  },
];
