import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.DB_NAME || 'resume_builder'
  if (!uri) {
    throw new Error('Missing MONGODB_URI')
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(uri, {
    dbName,
    serverSelectionTimeoutMS: 5000,
  })

  mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.log(`[db] connected to ${dbName}`)
  })
  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('[db] connection error:', err?.message || err)
  })
}
