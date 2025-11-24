import React from 'react'
export default function CreativeProfile({ data }) {
  return (
    <div>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 -m-8 p-8 text-white">
        <h1 className="text-3xl font-extrabold">{data.personalInfo?.fullName || 'Your Name'}</h1>
        <p className="opacity-90">{data.personalInfo?.jobTitle}</p>
      </div>
      {data.summary && <p className="mt-4 text-sm text-gray-700">{data.summary}</p>}
    </div>
  )
}
