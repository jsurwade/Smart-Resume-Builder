import React from 'react'

const PRESETS = [
  { name: 'Professional Blue', accent: '#2563eb', background: '#ffffff', text: '#111827' },
  { name: 'Elegant Gray', accent: '#6b7280', background: '#ffffff', text: '#1f2937' },
  { name: 'Bold Red', accent: '#dc2626', background: '#ffffff', text: '#111827' },
  { name: 'Creative Purple', accent: '#7c3aed', background: '#ffffff', text: '#111827' },
]

export default function ColorPicker({ colors, onColorChange }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => onColorChange(preset)}
            className="px-3 py-1 text-sm rounded-lg border-2 border-gray-300 hover:border-blue-600 transition"
            title={preset.name}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Accent Color</label>
        <input
          type="color"
          value={colors.accent}
          onChange={(e) => onColorChange({ ...colors, accent: e.target.value })}
          className="w-16 h-10 rounded cursor-pointer"
        />
      </div>
    </div>
  )
}
