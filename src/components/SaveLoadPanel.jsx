import React, { useEffect, useMemo, useState } from 'react'
import { save as lsSave, load as lsLoad, remove as lsRemove } from '../utils/localStorage'

const INDEX_KEY = 'saved_index'

export default function SaveLoadPanel({ currentData, onLoad, onClose }) {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [importError, setImportError] = useState('')

  useEffect(() => {
    const idx = lsLoad(INDEX_KEY, []) || []
    setItems(idx)
  }, [])

  const hasCurrent = useMemo(() => !!currentData, [currentData])

  const refresh = () => {
    const idx = lsLoad(INDEX_KEY, []) || []
    setItems(idx)
  }

  const saveNew = () => {
    if (!name.trim()) return
    const id = `${Date.now()}`
    lsSave(`saved_${id}`, currentData)
    const next = [{ id, name: name.trim(), date: new Date().toISOString() }, ...items]
    lsSave(INDEX_KEY, next)
    setName('')
    refresh()
  }

  const loadItem = (id) => {
    const data = lsLoad(`saved_${id}`, null)
    if (data) onLoad?.(data)
  }

  const deleteItem = (id) => {
    lsRemove(`saved_${id}`)
    const next = items.filter(i => i.id !== id)
    lsSave(INDEX_KEY, next)
    refresh()
  }

  const exportJSON = (id) => {
    const data = lsLoad(`saved_${id}`, null)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${items.find(i => i.id === id)?.name || 'resume'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJSON = async (file) => {
    setImportError('')
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const id = `${Date.now()}`
      const inferred = data?.personalInfo?.fullName || 'Imported Resume'
      lsSave(`saved_${id}`, data)
      const next = [{ id, name: inferred, date: new Date().toISOString() }, ...items]
      lsSave(INDEX_KEY, next)
      refresh()
    } catch (e) {
      setImportError('Invalid JSON file')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Save & Load</h2>
          <button onClick={onClose} className="px-3 py-1 border rounded-lg">Close</button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Save current</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name this resume..."
              className="w-full px-3 py-2 border rounded-lg mb-2"
            />
            <button
              disabled={!hasCurrent || !name.trim()}
              onClick={saveNew}
              className="w-full bg-blue-600 disabled:opacity-50 text-white py-2 rounded-lg"
            >
              Save
            </button>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Import JSON</h3>
              <input
                type="file"
                accept="application/json"
                onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])}
                className="w-full"
              />
              {importError && <p className="text-sm text-red-600 mt-1">{importError}</p>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Saved resumes</h3>
            <div className="space-y-2 max-h-72 overflow-auto border rounded-lg p-2">
              {items.length === 0 && (
                <p className="text-sm text-gray-600">No saved resumes yet.</p>
              )}
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{new Date(item.date).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => loadItem(item.id)} className="px-2 py-1 text-sm border rounded">Load</button>
                    <button onClick={() => exportJSON(item.id)} className="px-2 py-1 text-sm border rounded">Export</button>
                    <button onClick={() => deleteItem(item.id)} className="px-2 py-1 text-sm border rounded text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
