import { exportPDF } from './exportPDF'
import { exportDOCX as exportDOCXImpl } from './exportDOCX'

export { exportPDF }

export async function exportDOCX(data, template, colors, font) {
  return exportDOCXImpl(data, template, colors, font)
}

export async function exportTXT(data) {
  const content = `Name: ${data.personalInfo?.fullName || ''}\nEmail: ${data.personalInfo?.email || ''}\nPhone: ${data.personalInfo?.phone || ''}\n\nSummary:\n${data.summary || ''}`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'Resume.txt'
  a.click()
  URL.revokeObjectURL(url)
}
