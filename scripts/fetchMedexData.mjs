/**
 * Script to fetch and format MedEx Bangladesh medicine dataset (21,000+ medicines)
 * and output a clean, lightweight JSON for MedRecord offline indexing.
 */
import fs from 'fs';
import path from 'path';

const CSV_URL = 'https://huggingface.co/datasets/Mahadih534/all-Bangladeshi-medicines/raw/main/medicine.csv';
const OUTPUT_FILE = path.resolve('public/data/medex-medicines.json');

function mapDosageForm(rawForm = '') {
  const f = rawForm.toLowerCase().trim();
  if (f.includes('tablet') || f.includes('tab')) return 'Tab';
  if (f.includes('capsule') || f.includes('cap')) return 'Cap';
  if (f.includes('syrup') || f.includes('suspension') || f.includes('liquid') || f.includes('oral')) return 'Syr';
  if (f.includes('injection') || f.includes('inj') || f.includes('infusion')) return 'Inj';
  if (f.includes('ointment') || f.includes('cream') || f.includes('gel')) return 'Oint';
  if (f.includes('drop')) return 'Drop';
  return 'Tab';
}

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

async function run() {
  console.log('Fetching MedEx Bangladesh medicine database...');
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);

  const csvText = await res.text();
  const lines = csvText.split('\n');
  console.log(`Downloaded ${lines.length} lines. Parsing records...`);

  const medicines = [];
  const seen = new Set();

  // Header: brand id,brand name,type,slug,dosage form,generic,strength,manufacturer,package container,Package Size
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const cols = parseCSVLine(line);
    if (cols.length < 8) continue;

    const brand = cols[1];
    const rawForm = cols[4];
    const generic = cols[5];
    const strength = cols[6];
    const manufacturer = cols[7];

    if (!brand || !generic) continue;

    const form = mapDosageForm(rawForm);
    const key = `${brand.toLowerCase()}|${strength.toLowerCase()}|${form}`;
    if (seen.has(key)) continue;
    seen.add(key);

    medicines.push({
      brand_name: brand,
      generic_name: generic,
      dosage_form: form,
      strength: strength || 'Standard',
      manufacturer: manufacturer || 'Pharmaceutical',
    });
  }

  console.log(`Parsed ${medicines.length} unique Bangladeshi medicines from MedEx.`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(medicines));
  const stats = fs.statSync(OUTPUT_FILE);
  console.log(`Saved to ${OUTPUT_FILE} (${(stats.size / 1024 / 1024).toFixed(2)} MB).`);
}

run().catch((err) => {
  console.error('Failed to import MedEx data:', err);
  process.exit(1);
});
