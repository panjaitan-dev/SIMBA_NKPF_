// check-regressions.mjs
// Scans SOURCE files for prohibited strings that should not appear in production.
// Scans src/ directory instead of .next/ to avoid stale cache false positives.
import { promises as fs } from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');

// Encoded to avoid self-detection; each entry is Base64-encoded.
const PROHIBITED_B64 = [
  'S2VtYmFsaSBrZSBCZXJhbmRh',       // Kembali ke Beranda
  '4oaQIEtlbWJhbGkga2UgQmVyYW5kYQ==', // ← Kembali ke Beranda
  'UG9ydGFsIFJlc21p',                 // Portal Resmi
  'VGVyaW50ZWdyYXNpIEJQUw==',         // Terintegrasi BPS
  'TWV1cmF4YQ==',                     // Meuraxa
  'VGV1a3UgSXNrYW5kYXI=',             // Teuku Iskandar
  'MDgxMi02NTQzLTExMDE=',             // 0812-6543-1101
  'U2Nyb2xsIHVudHVrIG1lbmplbGFqYWhp', // Scroll untuk menjelajahi
  'MzQgcHJvdmluc2k=',                 // 34 provinsi
  'JFxcdGltZXMk',                     // $\\times$
  'bG9yZW0=',                         // lorem
  'R2VkdW5nIE1hbmdnYWxh',             // Gedung Manggala
  'VW5pdCBQZXJjb250b2hhbiBSZXNtaQ==', // Unit Percontohan Resmi
  'Y2xhdWRl',                         // c***
  'YW50aHJvcGlj',                     // anth***
  'Y2hhdGdwdA==',                     // ch***
  'b3BlbmFp',                         // op***
  'Z2VtaW5p',                         // ge***
  'Y29waWxvdA==',                     // cop***
  'd2luZHN1cmY=',                     // wi***
  'YW50aWdyYXZpdHk=',                 // anti***
  'YW50aSBncmF2aXR5',                 // anti gr***
  'YXMgYW4gYWk=',                     // as an ***
  'YWktZ2VuZXJhdGVk',                 // ***-generated
  'YWkgYXNzaXN0YW50',                 // *** assistant
  'Y28tYXV0aG9yZWQtYnk=',             // co-auth***
  'ZGlidWF0IGRlbmdhbiBhaQ==',         // dibuat dengan ***
  'ZGliYW50dSBhaQ==',                 // dibantu ***
  'bWVuZ2d1bmFrYW4gYWk=',             // menggunakan ***
];
const PROHIBITED = PROHIBITED_B64.map(b => Buffer.from(b, 'base64').toString('utf8'));

const EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js', '.json']);

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and .next
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      yield* walk(full);
    } else if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name))) {
      yield full;
    }
  }
}

async function main() {
  let found = false;
  for await (const file of walk(SRC_DIR)) {
    let content;
    try {
      content = await fs.readFile(file, 'utf8');
    } catch {
      continue; // skip binary or inaccessible files
    }
    const lower = content.toLowerCase();
    for (const term of PROHIBITED) {
      if (lower.includes(term.toLowerCase())) {
        console.error(`Prohibited term "${term}" found in ${file}`);
        found = true;
      }
    }
  }
  if (found) {
    console.error('Regression check failed.');
    process.exit(1);
  } else {
    console.log('Regression check passed. No prohibited strings found in source files.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Error during regression check:', err);
  process.exit(1);
});
