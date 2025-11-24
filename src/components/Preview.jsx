import React from 'react'
import Minimalist from './templates/Minimalist'
import ModernBlue from './templates/ModernBlue'
import BoldDark from './templates/BoldDark'

const TEMPLATE_MAP = {
  'Minimalist': Minimalist,
  'Modern Blue': ModernBlue,
  'Bold Dark': BoldDark,
}

export default function Preview({ data, template, colors, font }) {
  const TemplateComponent = TEMPLATE_MAP[template] || Minimalist

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sticky top-20 h-fit overflow-hidden border-2 border-gray-200">
      <div className="text-center text-xs text-gray-500 mb-3">A4 Preview</div>
      <div className="bg-gray-100 p-2 rounded overflow-auto max-h-96" style={{ fontFamily: font }}>
        <div className="bg-white p-8 shadow-lg w-full" style={{ backgroundColor: colors.background, color: colors.text }}>
          <TemplateComponent data={data} colors={colors} font={font} />
        </div>
      </div>
    </div>
  )
}
