// check-regressions.mjs
// Scans built output for prohibited strings that should not appear in production.
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve('.next'); // relative to frontend root
const PROHIBITED = [
  'Kembali ke Beranda',
  '← Kembali ke Beranda',
];

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

async function main() {
  let found = false;
  for await (const file of walk(ROOT)) {
    const content = await fs.readFile(file, 'utf8');
    for (const term of PROHIBITED) {
      if (content.includes(term)) {
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
