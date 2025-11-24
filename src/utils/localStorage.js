const PREFIX = 'resume_builder_v1_'

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key)
}

export function listKeys() {
  return Object.keys(localStorage).filter(k => k.startsWith(PREFIX))
}
