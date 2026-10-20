import { spawn, execSync } from 'child_process';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Resolve project root (scripts folder is inside frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const projectRoot = resolve(__dirname, '..');

// Start Next.js production server in background
const server = spawn('npm', ['run', 'start', '--', '-p', '3000'], {
  cwd: projectRoot,
  detached: true,
  stdio: 'ignore',
});
// Detach so we can kill later
process.on('exit', () => {
  try { process.kill(-server.pid); } catch {}
});

// Wait for server to be ready (simple delay)
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
(async () => {
  console.log('Waiting for server to start...');
  await wait(8000); // 8 seconds
  console.log('Running Lighthouse (mobile)...');
  const outputDir = resolve(projectRoot, 'docs', 'screenshots');
  execSync(
    `npx lighthouse http://localhost:3000 --preset=mobile --output=json --output=html --quiet --chrome-flags="--headless" --output-path=${outputDir}/lighthouse`,
    { stdio: 'inherit' }
  );
  console.log('Lighthouse completed, output in docs/screenshots');
  // Kill the server process group
  try { process.kill(-server.pid); } catch {}
})();