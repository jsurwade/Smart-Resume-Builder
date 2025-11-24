import React from 'react'

export default function BoldDark({ data }) {
  return (
    <div className="text-gray-900">
      <div className="bg-gray-900 text-white -m-8 p-8 mb-6">
        <h1 className="text-3xl font-extrabold">{data.personalInfo?.fullName || 'Your Name'}</h1>
        <p className="text-sm opacity-80">{data.personalInfo?.jobTitle}</p>
      </div>
      {data.summary && (
        <div className="mb-4">
          <h2 className="font-bold mb-2">SUMMARY</h2>
          <p className="text-sm text-gray-700">{data.summary}</p>
        </div>
      )}
    </div>
  )
}
