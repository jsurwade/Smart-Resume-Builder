import mongoose from 'mongoose'

const ResumeSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    data: { type: Object, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

export default mongoose.model('Resume', ResumeSchema, 'resumes')
