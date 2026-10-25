/**
 * Helper pembungkus query Supabase dengan timeout cepat
 * Mencegah server hang ketika koneksi database offline/cold-start
 */

async function withTimeout(promise, timeoutMs = (process.env.NODE_ENV === 'test' || process.env.SUPABASE_URL?.includes('mock') ? 10 : 800)) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`DB query timeout (${timeoutMs}ms)`)), timeoutMs);
  });

  try {
    const res = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    return { data: null, error: err };
  }
}

module.exports = { withTimeout };
