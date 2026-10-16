const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const html = await get('https://frontend-ten-phi-12.vercel.app/register');
  const scriptRegex = /src="(\/_next\/static\/[^"]+\.js)"/g;
  let m;
  const scripts = [];
  while ((m = scriptRegex.exec(html)) !== null) {
    scripts.push(m[1]);
  }

  for (const s of scripts) {
    const url = 'https://frontend-ten-phi-12.vercel.app' + s;
    const js = await get(url);
    if (js.includes('localhost:5000') || js.includes('api')) {
      const idx = js.indexOf('localhost:5000');
      if (idx !== -1) {
        console.log('Found localhost:5000 in', s, ':', js.substring(idx - 30, idx + 40));
      }
      const bIdx = js.indexOf('baseURL');
      if (bIdx !== -1) {
        console.log('Found baseURL in', s, ':', js.substring(bIdx - 30, bIdx + 60));
      }
    }
  }
}

main().catch(console.error);
