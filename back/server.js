import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Server } from 'socket.io'

import app from './app.js'
import { catchAsyncSocket } from './errors/ErrorHandler.js'
import { handleSocket, authenticateUser } from './socket/io.js'

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
    origin: '*',
  },
})

io.use(catchAsyncSocket(authenticateUser))
io.on('connection', (socket) => handleSocket(socket, io))

process.on('unhandledRejection', (error) => {
  console.log(error.name, error.message)
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  process.exit(1)
})
