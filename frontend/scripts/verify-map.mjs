// verify-map.mjs
// Script to validate the Indonesia provinces SVG used in the project.
// It ensures the SVG contains exactly 38 <path> elements, each with an id matching the official BPS province codes.
// If any check fails, the script exits with code 1 and prints an error message.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SVG_PATH = path.resolve(process.cwd(), 'public/svg/indonesia-provinces.svg');

// Official BPS two‑digit province codes (38 provinces, including the four new Papua provinces).
const ALLOWED_IDS = [
  '11','12','13','14','15','16','17','18','19','21',
  '31','32','33','34','35','36',
  '51','52','53',
  '61','62','63','64','65',
  '71','72','73','74','75','76',
  '81','82','91','92','93','94','95','96'
];

async function main() {
  try {
    const data = await readFile(SVG_PATH, { encoding: 'utf8' });
    const pathRegex = /<path[^>]*id="(\d{2})"[^>]*d="([^\"]+)"[^>]*>/g;
    const ids = [];
    let match;
    while ((match = pathRegex.exec(data)) !== null) {
      ids.push({ id: match[1], d: match[2] });
    }
    if (ids.length !== 38) {
      console.error(`❌ Expected 38 <path> elements, found ${ids.length}`);
      process.exit(1);
    }
    // Check each id is allowed and d attribute non‑empty.
    for (const { id, d } of ids) {
      if (!ALLOWED_IDS.includes(id)) {
        console.error(`❌ Invalid province id "${id}" found in SVG`);
        process.exit(1);
      }
      if (!d || d.trim() === '' || d.includes('...')) {
        console.error(`❌ Path id "${id}" has an empty or placeholder "d" attribute`);
        process.exit(1);
      }
    }
    console.log('✅ SVG verification passed: 38 valid province paths');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error reading SVG file:', err);
    process.exit(1);
  }
}

main();
