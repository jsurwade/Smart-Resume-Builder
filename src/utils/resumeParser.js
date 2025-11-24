// Converts raw resume text into a structured object
export function parseResumeText(raw) {
  const text = (raw || '').toString()
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  return {
    personalInfo: {
      fullName: lines[0] || '',
      email: extractEmail(text) || '',
      phone: extractPhone(text) || '',
      location: extractLocation(text) || ''
    },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    languages: [],
    interests: [],
    references: [],
    customFields: []
  }
}

export function extractEmail(text) {
  const match = text.match(/[\w.-]+@[\w.-]+\.\w+/)
  return match ? match[0] : ''
}

export function extractPhone(text) {
  const match = text.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
  return match ? match[0] : ''
}

export function extractLocation(text) {
  const match = text.match(/\b([A-Z][a-z]+(?:\s|,\s)?){1,3}(?:USA|UK|India|Canada)?\b/)
  return match ? match[0] : ''
}
