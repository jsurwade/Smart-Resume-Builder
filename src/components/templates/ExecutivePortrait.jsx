import React from 'react'
export default function ExecutivePortrait({ data }) {
  return (
    <div>
      <div className="flex items-center gap-4 -m-8 p-8 bg-gray-100">
        <div className="w-16 h-16 rounded-full bg-gray-300" />
        <div>
          <h1 className="text-2xl font-bold">{data.personalInfo?.fullName || 'Your Name'}</h1>
          <p className="text-sm text-gray-600">{data.personalInfo?.jobTitle}</p>
        </div>
      </div>
    </div>
  )
}
