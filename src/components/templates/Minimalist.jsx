import React from 'react'

export default function Minimalist({ data, colors }) {
  return (
    <div>
      <h1 className="text-3xl font-bold" style={{ color: colors.accent }}>
        {data.personalInfo?.fullName || 'Your Name'}
      </h1>
      <p className="text-gray-600 mb-4">{data.personalInfo?.jobTitle}</p>
      
      <div className="border-b-2 pb-4 mb-4" style={{ borderColor: colors.accent }}>
        <p className="text-sm">{data.personalInfo?.email}</p>
        <p className="text-sm">{data.personalInfo?.phone}</p>
      </div>

      {data.summary && (
        <div className="mb-4">
          <h2 className="font-bold mb-2" style={{ color: colors.accent }}>SUMMARY</h2>
          <p className="text-sm text-gray-700">{data.summary}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold mb-2" style={{ color: colors.accent }}>EXPERIENCE</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
                <p className="font-semibold text-sm">{exp.jobTitle}</p>
                <p className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="text-xs text-gray-600">{exp.company}</p>
            </div>
          ))}
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div>
          <h2 className="font-bold mb-2" style={{ color: colors.accent }}>SKILLS</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
