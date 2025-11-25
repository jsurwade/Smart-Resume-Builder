import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db.js'
import Resume from './models/Resume.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const PORT = process.env.PORT || 4000

await connectDB()

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/pingdb', async (req, res) => {
  try {
    // If the connection is healthy, this will succeed quickly
    await Resume.estimatedDocumentCount()
    res.json({ ok: true, ping: true })
  } catch (e) {
    console.error('Ping failed:', e?.message || e)
    res.status(500).json({ ok: false, error: 'MongoDB ping failed' })
  }
})

app.get('/api/resume/:id', async (req, res) => {
  try {
    const { id } = req.params
    const doc = await Resume.findById(id).lean()
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json({ data: doc.data || null, updatedAt: doc.updatedAt || null })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.put('/api/resume/:id', async (req, res) => {
  try {
    const { id } = req.params
    const payload = req.body?.data
    if (typeof payload !== 'object' || payload === null) {
      return res.status(400).json({ error: 'Invalid data' })
    }
    const updated = await Resume.findByIdAndUpdate(
      id,
      { $set: { data: payload } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    res.json({ ok: true, updatedAt: updated.updatedAt })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

