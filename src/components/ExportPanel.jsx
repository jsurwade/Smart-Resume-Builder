import React, { useState } from 'react'
import { exportPDF, exportDOCX, exportTXT } from '../utils/exportFunctions'

export default function ExportPanel({ data, template, colors, font, onClose }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format) => {
    setExporting(true)
    try {
      if (format === 'pdf') {
        await exportPDF(data, template, colors, font)
      } else if (format === 'docx') {
        await exportDOCX(data, template, colors, font)
      } else if (format === 'txt') {
        await exportTXT(data)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Export Resume</h2>

        <div className="space-y-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            📄 Export as PDF
          </button>
          <button
            onClick={() => handleExport('docx')}
            disabled={exporting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            📝 Export as DOCX
          </button>
          <button
            onClick={() => handleExport('txt')}
            disabled={exporting}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            📋 Export as TXT
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  )
}
