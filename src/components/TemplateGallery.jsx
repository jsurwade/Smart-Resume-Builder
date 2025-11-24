import React, { useState } from 'react'

const TEMPLATES = [
  { name: 'Minimalist', desc: 'Clean & Simple', category: 'standard' },
  { name: 'Modern Blue', desc: 'Professional Blue', category: 'standard' },
  { name: 'Bold Dark', desc: 'Dramatic Contrast', category: 'standard' },
  { name: 'Creative Split', desc: 'Asymmetric Design', category: 'standard' },
  { name: 'Corporate Gray', desc: 'Traditional Formal', category: 'standard' },
  { name: 'Elegant Serif', desc: 'Timeless Classic', category: 'standard' },
  { name: 'Gradient Neon', desc: 'Vibrant Startup', category: 'fancy' },
  { name: 'Monochrome Zigzag', desc: 'Bold Minimalist', category: 'fancy' },
  { name: 'Professional Photo', desc: 'Two-Column Photo', category: 'photo', hasPhoto: true },
  { name: 'Executive Portrait', desc: 'Header Photo', category: 'photo', hasPhoto: true },
  { name: 'Creative Profile', desc: 'Gradient Sidebar', category: 'photo', hasPhoto: true },
  { name: 'Modern Minimal Photo', desc: 'Centered Photo', category: 'photo', hasPhoto: true },
  { name: 'Tech Startup', desc: 'Tech-Focused', category: 'photo', hasPhoto: true },
]

export default function TemplateGallery({ onSelectTemplate }) {
  const [filter, setFilter] = useState('all')

  const filtered = TEMPLATES.filter(t => 
    filter === 'all' || t.category === filter || (filter === 'photo' && t.hasPhoto)
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Choose Your Template</h1>
        <p className="text-center text-gray-600 mb-8">18 professional designs to choose from</p>

        <div className="flex justify-center gap-4 mb-12">
          {['all', 'standard', 'fancy', 'photo'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === f 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
              }`}
            >
              {f === 'all' ? 'All' : f === 'photo' ? 'With Photo' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {filtered.map((template) => (
            <div 
              key={template.name} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
            >
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                <div className="text-gray-400 text-center">
                  <div className="text-3xl mb-2">📄</div>
                  <div className="text-sm">Template Preview</div>
                </div>
                {template.hasPhoto && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    📷 Photo
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg mb-1 text-gray-900">{template.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{template.desc}</p>
                <button
                  onClick={() => onSelectTemplate(template.name)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
