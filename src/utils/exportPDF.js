import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportPDF(data, template, colors, font) {
  try {
    const element = document.createElement('div')
    element.innerHTML = renderResumeHTML(data, template, colors, font)
    document.body.appendChild(element)

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: colors.background
    })

    document.body.removeChild(element)

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

    const filename = `Resume_${data.personalInfo?.fullName || 'Resume'}_${new Date().toLocaleDateString()}.pdf`
    pdf.save(filename)
  } catch (error) {
    console.error('PDF export error:', error)
    throw error
  }
}

function renderResumeHTML(data, template, colors, font) {
  return `
    <div style="font-family: ${font}; color: ${colors.text}; background: ${colors.background}; padding: 40px;">
      <h1 style="color: ${colors.accent}; margin: 0;">${data.personalInfo?.fullName}</h1>
      <p style="margin: 5px 0;">${data.personalInfo?.jobTitle}</p>
      <p style="margin: 5px 0; font-size: 12px;">${data.personalInfo?.email} | ${data.personalInfo?.phone}</p>
    </div>
  `
}
