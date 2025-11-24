import React from 'react'

export default function ModernBlue({ data, colors }) {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-3xl font-bold" style={{ color: '#1d4ed8' }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
        <p className="text-sm text-gray-600">{data.personalInfo?.email} · {data.personalInfo?.phone}</p>
      </div>
      <div>
        <h2 className="font-bold mb-2" style={{ color: '#1d4ed8' }}>SUMMARY</h2>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>
    </div>
  )
}
