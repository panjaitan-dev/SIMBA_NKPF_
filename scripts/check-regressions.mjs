// check-regressions.mjs
// Scans built output for prohibited strings that should not appear in production.
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve('frontend/.next');
const PROHIBITED = [
  'Kembali ke Beranda',
  '← Kembali ke Beranda',
];

const AI_PROHIBITED = [
  'claude',
  'anthropic',
  'chatgpt',
  'openai',
  'gemini',
  'copilot',
  'windsurf',
  'antigravity',
  'anti gravity',
  'as an ai',
  'ai-generated',
  'ai assistant',
  'co-authored-by',
  'dibuat dengan ai',
  'dibantu ai',
  'menggunakan ai',
];

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
    for (const term of PROHIBITED) {
      if (content.includes(term)) {
        console.error(`Prohibited term "${term}" found in ${file}`);
        found = true;
      }
    }
    const lower = content.toLowerCase();
    for (const term of AI_PROHIBITED) {
      if (lower.includes(term.toLowerCase())) {
        console.error(`Prohibited AI attribution term "${term}" found in ${file}`);
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
