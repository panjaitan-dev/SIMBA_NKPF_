// check-regressions.mjs
// Scans built output for prohibited strings that should not appear in production.
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve('frontend/.next');

// Encoded to avoid self-detection; each entry is Base64-encoded.
const PROHIBITED_B64 = [
  'S2VtYmFsaSBrZSBCZXJhbmRh',       // Kembali ke Beranda
  '4oaQIEtlbWJhbGkga2UgQmVyYW5kYQ==', // ← Kembali ke Beranda
  'Y2xhdWRl',                         // c]aude
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

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name === 'cache') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && !entry.name.endsWith('.map')) {
      yield full;
    }
  }
}

async function main() {
  let found = false;
  for await (const file of walk(ROOT)) {
    let content;
    try {
      content = await fs.readFile(file, 'utf8');
    } catch {
      continue;
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
    console.log('Regression check passed.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Error during regression check:', err);
  process.exit(1);
});
