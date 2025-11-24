import React from 'react'

const FONTS = [
  'Inter',
  'Lato',
  'Roboto',
  'Georgia',
  'Playfair Display',
  'Montserrat'
]

export default function FontSelector({ font, onFontChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">Font</label>
      <select
        value={font}
        onChange={(e) => onFontChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        {FONTS.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
    </div>
  )
}
