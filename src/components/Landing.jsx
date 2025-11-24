import React from 'react'

export default function Landing({ onStartClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">📄 Resume Builder</h1>
          <div className="space-x-4">
            <button className="text-gray-600 hover:text-gray-900 transition">Features</button>
            <button className="text-gray-600 hover:text-gray-900 transition">Templates</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Smart Resume Builder</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your professional resume your way. No AI, fully customizable, ATS-optimized, export-ready.
          </p>
          <div className="space-x-4 flex justify-center">
            <button
              onClick={onStartClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              Start Building →
            </button>
            <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              View Templates
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {[
            { emoji: '✓', title: '100% Manual Control', desc: 'No AI, you decide every word' },
            { emoji: '👁️', title: 'Live Preview', desc: 'See changes instantly' },
            { emoji: '🎨', title: '18 Templates', desc: 'Professional designs' },
            { emoji: '📥', title: 'Multi-Format Export', desc: 'PDF, DOCX, TXT' }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105">
              <div className="text-4xl mb-3">{feature.emoji}</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12">
          <h3 className="text-2xl font-bold text-center mb-8">Choose From 18 Professional Templates</h3>
          <div className="grid md:grid-cols-6 gap-4">
            {['Minimalist', 'Modern Blue', 'Bold Dark', 'Creative', 'Corporate', 'Elegant'].map((t) => (
              <div key={t} className="text-center">
                <div className="bg-gray-200 h-24 rounded-lg mb-2"></div>
                <p className="text-sm font-semibold text-gray-700">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
