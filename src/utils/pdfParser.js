// Parses PDF files into plain text using global pdfjsLib (loaded via index.html)
export async function parsePdfFile(file) {
  if (!file) return ''
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    fullText += textContent.items.map(item => item.str).join(' ') + '\n'
  }
  return fullText
}
