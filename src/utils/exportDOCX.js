export async function exportDOCX(data, template, colors, font) {
  const content = `Name: ${data.personalInfo?.fullName || ''}\nEmail: ${data.personalInfo?.email || ''}\nPhone: ${data.personalInfo?.phone || ''}\n\nSummary:\n${data.summary || ''}`
  const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'Resume.docx'
  a.click()
  URL.revokeObjectURL(url)
}
