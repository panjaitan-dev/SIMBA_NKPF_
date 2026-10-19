/**
 * auth-client.ts — Utilitas sinkronisasi token, role, dan cookie autentikasi di browser
 */

export function setAuthCookies(token: string, role: string) {
  if (typeof document === 'undefined') return
  const maxAge = 7 * 24 * 60 * 60 // 7 hari
  document.cookie = `simba_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`
  document.cookie = `simba_role=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function clearAuthCookies() {
  if (typeof document === 'undefined') return
  document.cookie = 'simba_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
  document.cookie = 'simba_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
}

export function getClientAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  const local = localStorage.getItem('simba_token')
  if (local) return local

  const cookies = document.cookie.split(';')
  for (const c of cookies) {
    const [key, val] = c.trim().split('=')
    if (key === 'simba_token' && val) return decodeURIComponent(val)
  }
  return null
}

export function getClientAuthRole(): string | null {
  if (typeof window === 'undefined') return null
  const local = localStorage.getItem('simba_role')
  if (local) return local

  const cookies = document.cookie.split(';')
  for (const c of cookies) {
    const [key, val] = c.trim().split('=')
    if (key === 'simba_role' && val) return decodeURIComponent(val)
  }
  return null
}
