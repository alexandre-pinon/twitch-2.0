import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Server } from 'socket.io'

import app from './app.js'
import User from './models/User.js'
import { catchAsyncSocket } from './errors/ErrorHandler.js'
import { authenticateUser } from './io/utils.js'

dotenv.config({ path: '.back.env' })

process.on('uncaughtException', (error) => {
  console.log(error.name, error.message)
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  process.exit(1)
})

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
  console.log(`Starting server on ${process.env.NODE_ENV} environment..`)
  console.log(`Server listening on port ${port}`)
})

const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_ORIGIN,
  },
})

io.use(catchAsyncSocket(authenticateUser))

io.on('connection', (socket) => {
  console.log('Connected: ' + socket.userId)

  socket.on('disconnect', () => {
    console.log('Disconnected: ' + socket.userId)
  })
})

process.on('unhandledRejection', (error) => {
  console.log(error.name, error.message)
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  process.exit(1)
})
