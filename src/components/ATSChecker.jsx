import React from 'react'
import { scoreATS } from '../utils/atsChecker'

export default function ATSChecker({ data }) {
  const { score, feedback } = scoreATS(data)

  const color = score > 75 ? 'green' : score > 50 ? 'yellow' : 'red'

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-bold text-lg mb-4">ATS Score</h3>
      <div className={`text-4xl font-bold text-${color}-600 text-center mb-4`}>
        {score}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`bg-${color}-600 h-2 rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>

      {feedback.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Improvements:</p>
          {feedback.map((item, i) => (
            <p key={i} className="text-sm text-gray-600">• {item}</p>
          ))}
        </div>
      )}
    </div>
  )
}
