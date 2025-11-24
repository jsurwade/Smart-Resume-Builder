export function isEmail(v) {
  return /[\w.-]+@[\w.-]+\.\w+/.test(v || '')
}

export function isPhone(v) {
  return /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(v || '')
}

export function required(v) {
  return !!(v && String(v).trim())
}
