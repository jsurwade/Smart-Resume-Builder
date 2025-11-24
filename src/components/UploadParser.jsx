import React, { useRef, useState } from 'react'
import { parsePdfFile } from '../utils/pdfParser'
import { parseDocxFile } from '../utils/docxParser'

export default function UploadParser({ onComplete, onClose }) {
  const fileInput = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = async (file) => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setError('Please upload a PDF or DOCX file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let text = ''
      if (file.type === 'application/pdf') {
        text = await parsePdfFile(file)
      } else {
        text = await parseDocxFile(file)
      }

      const parsed = parseResumeText(text)
      
      onComplete({
        personalInfo: parsed.personalInfo || {},
        summary: parsed.summary || '',
        experience: parsed.experience || [],
        education: parsed.education || [],
        projects: parsed.projects || [],
        skills: parsed.skills || [],
        certifications: parsed.certifications || [],
        achievements: parsed.achievements || [],
        languages: parsed.languages || [],
        interests: parsed.interests || [],
        references: parsed.references || [],
        customFields: parsed.customFields || []
      })
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to parse resume. Please try manual entry.')
    } finally {
      setLoading(false)
    }
  }

  const parseResumeText = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l)

    return {
      personalInfo: {
        fullName: lines[0] || '',
        email: extractEmail(text) || '',
        phone: extractPhone(text) || ''
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

  const extractEmail = (text) => {
    const match = text.match(/[\w.-]+@[\w.-]+\.\w+/)
    return match ? match[0] : ''
  }

  const extractPhone = (text) => {
    const match = text.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
    return match ? match[0] : ''
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Upload Your Resume</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          ref={fileInput}
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
          className="hidden"
        />

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Parsing your resume...</p>
          </div>
        ) : (
          <>
            <div
              onClick={() => fileInput.current?.click()}
              className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-600 transition bg-blue-50"
            >
              <div className="text-4xl mb-2">📄</div>
              <p className="text-gray-700 font-semibold mb-1">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-sm">PDF or DOCX (max 5MB)</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onClose()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => fileInput.current?.click()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Select File
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
