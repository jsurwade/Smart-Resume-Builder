import React, { useState, useEffect } from 'react'
import Landing from './components/Landing'
import TemplateGallery from './components/TemplateGallery'
import DataInputChoice from './components/DataInputChoice'
import Builder from './components/Builder'
import './App.css'
import { getOrCreateUserId } from './utils/userId'
import { fetchResume, saveResume } from './api'

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      return localStorage.getItem('currentPage') || 'landing'
    } catch {
      return 'landing'
    }
  })
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    try {
      return localStorage.getItem('selectedTemplate') || 'Minimalist'
    } catch {
      return 'Minimalist'
    }
  })
  const [resumeData, setResumeData] = useState(null)
  const [userId, setUserId] = useState(null)

  // Diagnostics: log initial state and storage
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('[App] mount; state.currentPage=', currentPage, 'ls.currentPage=', localStorage.getItem('currentPage'))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[App] localStorage read failed on mount', e)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      const id = getOrCreateUserId()
      setUserId(id)
      const savedPage = (() => {
        try { return localStorage.getItem('currentPage') } catch { return null }
      })()
      // eslint-disable-next-line no-console
      console.log('[App] init; savedPage before fetch=', savedPage)
      try {
        // Only attempt backend fetch when served over HTTP(S);
        // when opening dist/index.html via file://, rely on localStorage.
        if (typeof window !== 'undefined' && window.location?.protocol?.startsWith('http')) {
          const res = await fetchResume(id)
          if (res?.data) {
            setResumeData(res.data)
            setCurrentPage(savedPage || 'landing')
            // eslint-disable-next-line no-console
            console.log('[App] init; loaded from backend, navigating to', savedPage || 'landing')
            return
          }
        }
      } catch (_) {
      }
      const saved = localStorage.getItem('currentResumeData')
      if (saved) {
        const parsed = JSON.parse(saved)
        setResumeData(parsed)
        setCurrentPage(savedPage || 'landing')
        // eslint-disable-next-line no-console
        console.log('[App] init; loaded from localStorage, navigating to', savedPage || 'landing')
        // Seed backend with local data if possible
        try {
          if (typeof window !== 'undefined' && window.location?.protocol?.startsWith('http')) {
            await saveResume(id, parsed)
          }
        } catch (_) {}
        return
      }
      // No backend and no local data: keep whatever page was saved
      // eslint-disable-next-line no-console
      console.log('[App] init; no data anywhere, staying on', savedPage)
    }
    init()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('currentPage', currentPage)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[App] Failed to write currentPage to localStorage', e)
    }
  }, [currentPage])

  const handleStartBuilding = () => {
    setCurrentPage('templates')
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    try {
      localStorage.setItem('selectedTemplate', template)
    } catch {}
    setCurrentPage('inputChoice')
  }

  const handleInputChoice = (data) => {
    setResumeData(data)
    setCurrentPage('builder')
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      {currentPage === 'landing' && (
        <Landing onStartClick={handleStartBuilding} />
      )}
      {currentPage === 'templates' && (
        <TemplateGallery onSelectTemplate={handleTemplateSelect} />
      )}
      {currentPage === 'inputChoice' && (
        <DataInputChoice 
          template={selectedTemplate}
          onDataReady={handleInputChoice}
        />
      )}
      {currentPage === 'builder' && (
        <Builder 
          initialData={resumeData}
          selectedTemplate={selectedTemplate}
          onBack={() => setCurrentPage('templates')}
          userId={userId}
        />
      )}
    </div>
  )
}

export default App
