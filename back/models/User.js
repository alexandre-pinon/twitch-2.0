import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: 'Username is required!',
    unique: true,
  },
  email: {
    type: String,
    required: 'Email is required!',
    unique: true,
  },
  password: {
    type: String,
    required: 'Password is required!',
  },
  hash2FA: {
    type: String,
  },
  active2FA: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
  stream_key: {
    type: String,
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  },
  subscribers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  },
})

export default mongoose.model('User', userSchema)
