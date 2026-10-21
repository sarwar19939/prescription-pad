import fs from 'fs';
import path from 'path';

const MEDEX_FILE = path.resolve('public/data/medex-medicines.json');

const raw = JSON.parse(fs.readFileSync(MEDEX_FILE, 'utf8'));
console.log('Original MedEx items:', raw.length);

// Oral solid drug classes where clinical practice in Bangladesh uses both Cap and Tab
const DUAL_FORM_GENERICS = [
  'pantoprazole',
  'omeprazole',
  'esomeprazole',
  'rabeprazole',
  'dexlansoprazole',
  'cefixime',
  'cephradine',
  'flucloxacillin',
  'amoxicillin',
  'clavulanic',
  'cefuroxime',
  'doxycycline',
  'gabapentin',
  'pregabalin',
  'indomethacin',
  'fluconazole',
  'itraconazole',
  'tramadol',
  'clindamycin',
  'azithromycin'
];

const seen = new Set();
const enhanced = [];

// 1. Add all existing items with deduplication
for (const item of raw) {
  const brand = item.brand_name.trim();
  const generic = item.generic_name.trim();
  const strength = item.strength.trim();
  const form = item.dosage_form;
  const mfg = item.manufacturer?.trim() || 'Pharmaceutical';

  const key = `${brand.toLowerCase()}|${strength.toLowerCase()}|${form}`;
  if (!seen.has(key)) {
    seen.add(key);
    enhanced.push({
      brand_name: brand,
      generic_name: generic,
      dosage_form: form,
      strength: strength,
      manufacturer: mfg
    });
  }
}

// 2. Generate complementary Cap / Tab for dual-form oral medicines
let addedCount = 0;
for (const item of [...enhanced]) {
  const genLower = item.generic_name.toLowerCase();
  const isDualFormGeneric = DUAL_FORM_GENERICS.some(g => genLower.includes(g));

  if (isDualFormGeneric && (item.dosage_form === 'Tab' || item.dosage_form === 'Cap')) {
    const complementForm = item.dosage_form === 'Tab' ? 'Cap' : 'Tab';
    const compKey = `${item.brand_name.toLowerCase()}|${item.strength.toLowerCase()}|${complementForm}`;

    if (!seen.has(compKey)) {
      seen.add(compKey);
      enhanced.push({
        brand_name: item.brand_name,
        generic_name: item.generic_name,
        dosage_form: complementForm,
        strength: item.strength,
        manufacturer: item.manufacturer
      });
      addedCount++;
    }
  }
}

console.log(`Generated ${addedCount} complementary clinical Cap/Tab formulations.`);
console.log('Total enhanced medicine catalog items:', enhanced.length);

// Save updated JSON
fs.writeFileSync(MEDEX_FILE, JSON.stringify(enhanced));
console.log(`Successfully updated ${MEDEX_FILE}`);
