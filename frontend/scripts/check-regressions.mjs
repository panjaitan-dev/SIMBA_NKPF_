// check-regressions.mjs
// Scans SOURCE files for prohibited strings that should not appear in production.
// Scans src/ directory instead of .next/ to avoid stale cache false positives.
import { promises as fs } from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');
const PROHIBITED = [
  'Kembali ke Beranda',
  '← Kembali ke Beranda',
];
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
    console.log('Regression check passed. No prohibited strings found in source files.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Error during regression check:', err);
  process.exit(1);
});
