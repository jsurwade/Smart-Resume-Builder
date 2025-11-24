import React from 'react'
export default function ModernMinimalPhoto({ data }) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-3" />
      <h1 className="text-2xl font-bold">{data.personalInfo?.fullName || 'Your Name'}</h1>
      <p className="text-sm text-gray-600">{data.personalInfo?.jobTitle}</p>
    </div>
  )
}
