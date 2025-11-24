import React, { useState } from 'react'

export default function CoverLetterBuilder() {
  const [content, setContent] = useState('')
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Cover Letter</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className="w-full border border-gray-300 rounded-lg p-3"
        placeholder="Write your cover letter..."
      />
    </div>
  )
}
