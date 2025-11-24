import React, { useState } from 'react'
import UploadParser from './UploadParser'

export default function DataInputChoice({ template, onDataReady }) {
  const [showUpload, setShowUpload] = useState(false)

  const handleManualEntry = () => {
    const emptyData = {
      personalInfo: {},
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
    onDataReady(emptyData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">How would you like to start?</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition transform hover:scale-105">
            <div className="text-6xl mb-4">✏️</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Fill Details Manually</h2>
            <p className="text-gray-600 mb-8">Start from scratch and build your resume step by step</p>
            <button
              onClick={handleManualEntry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Start Building
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition transform hover:scale-105">
            <div className="text-6xl mb-4">📤</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Upload Existing Resume</h2>
            <p className="text-gray-600 mb-8">Upload PDF or DOCX and we'll extract the text for you</p>
            <button
              onClick={() => setShowUpload(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Upload & Edit
            </button>
          </div>
        </div>

        {showUpload && <UploadParser onComplete={onDataReady} onClose={() => setShowUpload(false)} />}
      </div>
    </div>
  )
}
