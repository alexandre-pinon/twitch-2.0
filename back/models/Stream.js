import mongoose from 'mongoose'

const streamSchema = new mongoose.Schema(
  {
    streamer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: 'Streamer is required!',
    },
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chatroom',
      required: 'Chat is required!',
    },
    live: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: ['GAME', 'IRL'],
      default: 'IRL',
    },
    tags: {
      type: [String],
    },
    game_title: {
      type: String,
      default: 'Just Chatting',
    },
    title: {
      type: String,
      required: 'Title is required!',
    },
    description: {
      type: String,
    },
    max_viewers: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Stream', streamSchema)
