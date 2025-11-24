import React from 'react'
export default function MonochromeZigzag({ data }) {
  return (
    <div>
      <h1 className="text-3xl font-black tracking-wide">{data.personalInfo?.fullName || 'Your Name'}</h1>
      <div className="h-1 bg-gradient-to-r from-black via-gray-500 to-black my-3" />
      <p className="text-sm text-gray-700">{data.summary}</p>
    </div>
  )
}
