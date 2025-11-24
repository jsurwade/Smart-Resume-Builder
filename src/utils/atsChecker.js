// Simple ATS scoring utility used by ATSChecker component
export function scoreATS(data) {
  let score = 0
  const feedback = []

  if (data.personalInfo?.email) score += 15
  else feedback.push('Add email address')

  if (data.personalInfo?.phone) score += 15
  else feedback.push('Add phone number')

  if (data.summary && data.summary.length > 50) score += 15
  else feedback.push('Add professional summary (50+ chars)')

  if (data.experience?.length > 0) score += 20
  else feedback.push('Add work experience')

  if (data.education?.length > 0) score += 15
  else feedback.push('Add education')

  if (data.skills?.length >= 5) score += 20
  else feedback.push('Add at least 5 skills')

  return { score, feedback }
}
