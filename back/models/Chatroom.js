import mongoose from 'mongoose'

const chatroomSchema = new mongoose.Schema({
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  },
  messages: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Message',
  },
  private: {
    type: Boolean,
    default: false,
  },
})

export default mongoose.model('Chatroom', chatroomSchema)
