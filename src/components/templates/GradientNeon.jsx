import React from 'react'
export default function GradientNeon({ data }) {
  return (
    <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 -m-8 p-8 text-white">
      <h1 className="text-3xl font-extrabold">{data.personalInfo?.fullName || 'Your Name'}</h1>
      <p className="opacity-90">{data.personalInfo?.jobTitle}</p>
    </div>
  )
}
