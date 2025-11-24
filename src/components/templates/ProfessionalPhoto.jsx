import React from 'react'
export default function ProfessionalPhoto({ data }) {
  return (
    <div className="grid grid-cols-3 gap-4 items-center">
      <div className="col-span-1">
        <div className="w-24 h-24 bg-gray-300 rounded-full" />
      </div>
      <div className="col-span-2">
        <h1 className="text-2xl font-bold">{data.personalInfo?.fullName || 'Your Name'}</h1>
        <p className="text-sm text-gray-600">{data.personalInfo?.jobTitle}</p>
      </div>
    </div>
  )
}
