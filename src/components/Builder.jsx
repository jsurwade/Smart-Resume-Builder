import React, { useState, useEffect } from 'react'
import Preview from './Preview'
import SaveLoadPanel from './SaveLoadPanel'
import ColorPicker from './ColorPicker'
import FontSelector from './FontSelector'
import ExportPanel from './ExportPanel'
import ATSChecker from './ATSChecker'
import AnalyticsDashboard from './AnalyticsDashboard'
import CoverLetterBuilder from './CoverLetterBuilder'
import { save as lsSave, load as lsLoad } from '../utils/localStorage'
import { saveResume, fetchResume } from '../api'

export default function Builder({ initialData, selectedTemplate, onBack, userId }) {
  const [resumeData, setResumeData] = useState(initialData || getDefaultResumeData())
  const [colors, setColors] = useState({
    accent: '#2563eb',
    background: '#ffffff',
    text: '#111827'
  })
  const [font, setFont] = useState('Inter')
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved')
  const [showExport, setShowExport] = useState(false)
  const [showSaveLoad, setShowSaveLoad] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCover, setShowCover] = useState(false)
  const [activeTab, setActiveTab] = useState(
    (() => {
      try {
        const t = localStorage.getItem('activeTab')
        return t || 'personal'
      } catch {
        return 'personal'
      }
    })()
  )
  const [recentSaves, setRecentSaves] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('currentResumeData', JSON.stringify(resumeData))
      localStorage.setItem('resumeColors', JSON.stringify(colors))
      localStorage.setItem('resumeFont', font)
      const persist = async () => {
        try {
          if (userId) {
            await saveResume(userId, resumeData)
          }
          setAutoSaveStatus('saved')
        } catch (_) {
          setAutoSaveStatus('saved')
        }
      }
      persist()
    }, 3000)

    return () => clearTimeout(timer)
  }, [resumeData, colors, font, userId])

  useEffect(() => {
    const idx = lsLoad('saved_index', []) || []
    setRecentSaves(idx.slice(0, 3))
  }, [showSaveLoad])

  useEffect(() => {
    try {
      localStorage.setItem('activeTab', activeTab)
    } catch {}
  }, [activeTab])

  // Ensure page restore returns to Builder when user is editing
  useEffect(() => {
    try {
      localStorage.setItem('currentPage', 'builder')
    } catch {}
  }, [])

  useEffect(() => {
    const handler = () => {
      try {
        localStorage.setItem('currentResumeData', JSON.stringify(resumeData))
        localStorage.setItem('resumeColors', JSON.stringify(colors))
        localStorage.setItem('resumeFont', font)
        try { localStorage.setItem('currentPage', 'builder') } catch {}
        if (userId && typeof fetch === 'function') {
          const body = JSON.stringify({ data: resumeData })
          const url = `${(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '/api'}/resume/${encodeURIComponent(userId)}`
          fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
        }
      } catch {}
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [resumeData, colors, font, userId])

  function getDefaultResumeData() {
    return {
      personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        github: '',
        photoUrl: ''
      },
      summary: '',
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      achievements: [],
      languages: [],
      interests: [],
      references: [],
      customFields: []
    }
  }

  const handlePersonalInfoChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
    setAutoSaveStatus('saving')
  }

  const handleSummaryChange = (value) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }))
    setAutoSaveStatus('saving')
  }

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }))
  }

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...resumeData.experience]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData(prev => ({ ...prev, experience: updated }))
    setAutoSaveStatus('saving')
  }

  const handleRemoveExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const handleSkillAdd = (skill) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }))
      setAutoSaveStatus('saving')
    }
  }

  const handleSkillRemove = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900">← Back</button>
            <h1 className="text-2xl font-bold">Resume Builder</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {autoSaveStatus === 'saved' && '✓ Saved'}
              {autoSaveStatus === 'saving' && '⟳ Saving...'}
            </span>
            {userId && (
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 border rounded px-2 py-1">
                <span className="truncate max-w-[140px]">{userId}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(userId)}
                  className="underline"
                >
                  Copy ID
                </button>
              </div>
            )}
            <button
              onClick={() => {
                const id = `${Date.now()}`
                const name = resumeData?.personalInfo?.fullName || 'Resume'
                lsSave(`saved_${id}`, resumeData)
                const idx = lsLoad('saved_index', []) || []
                const next = [{ id, name, date: new Date().toISOString() }, ...idx]
                lsSave('saved_index', next)
                setRecentSaves(next.slice(0,3))
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Save Current
            </button>
            <button
              onClick={async () => {
                try {
                  setAutoSaveStatus('saving')
                  if (userId) {
                    await saveResume(userId, resumeData)
                  }
                  setAutoSaveStatus('saved')
                } catch {}
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Save to Cloud
            </button>
            <button
              onClick={async () => {
                try {
                  if (userId) {
                    const res = await fetchResume(userId)
                    if (res && res.data) {
                      setResumeData(res.data)
                    }
                  }
                } catch {}
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Load from Cloud
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Analytics
            </button>
            <button
              onClick={() => setShowCover(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cover Letter
            </button>
            <button
              onClick={() => setShowSaveLoad(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Save/Load
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Preview 
              data={resumeData}
              template={selectedTemplate}
              colors={colors}
              font={font}
            />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex border-b overflow-x-auto">
                {['personal', 'summary', 'experience', 'education', 'skills', 'custom'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-semibold whitespace-nowrap transition ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'personal' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={resumeData.personalInfo.jobTitle}
                      onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {activeTab === 'summary' && (
                  <textarea
                    placeholder="Write your professional summary..."
                    value={resumeData.summary}
                    onChange={(e) => handleSummaryChange(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    {resumeData.experience.map((exp, i) => (
                      <div key={i} className="border border-gray-300 p-4 rounded-lg">
                        <div className="flex justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Experience {i + 1}</h4>
                          <button
                            onClick={() => handleRemoveExperience(i)}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={exp.jobTitle}
                          onChange={(e) => handleUpdateExperience(i, 'jobTitle', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                        />
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(i, 'company', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleAddExperience}
                      className="w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 font-semibold hover:bg-blue-50"
                    >
                      + Add Experience
                    </button>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {resumeData.skills.map((skill, i) => (
                        <div key={i} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                          <span>{skill}</span>
                          <button
                            onClick={() => handleSkillRemove(i)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add skill and press Enter..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSkillAdd(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-lg">Customization</h3>
              
              <ColorPicker 
                colors={colors}
                onColorChange={setColors}
              />

              <FontSelector 
                font={font}
                onFontChange={setFont}
              />
            </div>

            <ATSChecker data={resumeData} />

            {recentSaves.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm font-semibold mb-2">Recent saves:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSaves.map(s => (
                    <span key={s.id} className="text-xs px-2 py-1 rounded border">{s.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showExport && (
        <ExportPanel 
          data={resumeData}
          template={selectedTemplate}
          colors={colors}
          font={font}
          onClose={() => setShowExport(false)}
        />
      )}

      {showSaveLoad && (
        <SaveLoadPanel
          currentData={resumeData}
          onLoad={(data) => {
            setResumeData(data)
            setShowSaveLoad(false)
          }}
          onClose={() => setShowSaveLoad(false)}
        />
      )}

      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Analytics</h2>
              <button onClick={() => setShowAnalytics(false)} className="px-3 py-1 border rounded-lg">Close</button>
            </div>
            <AnalyticsDashboard />
          </div>
        </div>
      )}

      {showCover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cover Letter</h2>
              <button onClick={() => setShowCover(false)} className="px-3 py-1 border rounded-lg">Close</button>
            </div>
            <CoverLetterBuilder />
          </div>
        </div>
      )}
    </div>
  )
}
