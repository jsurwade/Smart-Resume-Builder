const BASE = (() => {
  try {
    const envUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || ''
    if (envUrl) return envUrl
    if (typeof window !== 'undefined' && window.location?.protocol?.startsWith('http')) {
      const isLocal = /^localhost(:\d+)?$/i.test(window.location.hostname) || window.location.hostname === '127.0.0.1'
      if (isLocal) return 'http://localhost:4000/api'
    }
    return '/api'
  } catch {
    return '/api'
  }
})()

async function request(path, options = {}) {
  try {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    return res.json()
  } catch (e) {
    throw e
  }
}

export async function fetchResume(id) {
  return request(`${BASE}/resume/${encodeURIComponent(id)}`, { method: 'GET' })
}

export async function saveResume(id, data) {
  return request(`${BASE}/resume/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  })
}

export async function health() {
  return request(`${BASE.replace(/\/$/, '')}/health`)
}
