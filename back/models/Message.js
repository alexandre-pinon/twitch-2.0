import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: 'User is required',
      ref: 'User',
    },
    message: {
      type: String,
      required: 'Message is required',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Message', messageSchema)
