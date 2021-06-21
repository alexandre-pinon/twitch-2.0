import dotenv from 'dotenv'
import mongoose from 'mongoose'

import app from './app.js'
import User from './models/User.js'

dotenv.config({ path: '.back.env' })

mongoose.connect(process.env.NODE_STAGING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('MongoDB Connected!')
})

const port = process.env.NODE_PORT || 8000
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
