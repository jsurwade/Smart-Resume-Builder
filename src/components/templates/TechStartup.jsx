import React from 'react'

export default function TechStartup({ data }) {
  return (
    <div>
      <div className="-m-8 p-8 bg-black text-white">
        <h1 className="text-3xl font-extrabold tracking-tight">{data.personalInfo?.fullName || 'Your Name'}</h1>
        <p className="text-sm opacity-80">{data.personalInfo?.jobTitle}</p>
      </div>
      {data.summary && (
        <p className="mt-4 text-sm text-gray-700">{data.summary}</p>
      )}
    </div>
  )
}
