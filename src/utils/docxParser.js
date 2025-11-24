// Parses DOCX files into plain text using global mammoth (loaded via index.html)
export async function parseDocxFile(file) {
  if (!file) return ''
  const arrayBuffer = await file.arrayBuffer()
  const result = await window.mammoth.extractRawText({ arrayBuffer })
  return result.value || ''
}
