import jwt from 'jwt-then'

import * as UserController from '../controllers/UserController.js'
import * as ChatroomController from '../controllers/ChatroomController.js'
import * as MessageController from '../controllers/MessageController.js'
import AppError from '../errors/AppError.js'
import { catchAsyncSocket } from '../errors/ErrorHandler.js'
import { whisper } from './commands.js'

export const authenticateUser = async (socket, next) => {
  const token = socket.handshake.auth.token
  const payload = await jwt.verify(token, process.env.SECRET)
  socket.userId = payload.id
  next()
}

export const handleSocket = (socket, io) => {
  console.log('Connected: ' + socket.userId)

  socket.on('disconnect', () => {
    console.log('Disconnected: ' + socket.userId)
  })

  socket.on('join room', (chatroomId) => {
    catchAsyncSocket(handleJoinRoom)(socket, chatroomId)
  })

  socket.on('leave room', (chatroomId) => {
    catchAsyncSocket(handleLeaveRoom)(socket, chatroomId)
  })

  socket.on('chat message', (chatroomId, message) => {
    catchAsyncSocket(handleChatMessage)(socket, io, chatroomId, message)
  })
}

export const handleJoinRoom = async (socket, chatroomId) => {
  socket.join(chatroomId)
  console.log(`User ${socket.userId} joined chatroom ${chatroomId}`)
  await ChatroomController.addOrRemoveUser(chatroomId, socket.userId, 'ADD')
}

export const handleLeaveRoom = async (socket, chatroomId) => {
  socket.leave(chatroomId)
  console.log(`User ${socket.userId} left chatroom ${chatroomId}`)
  await ChatroomController.addOrRemoveUser(chatroomId, socket.userId, 'REMOVE')
}

export const handleChatMessage = async (socket, io, chatroomId, message) => {
  message = message.trim()

  if (!message) {
    throw new AppError('Message is empty')
  }

  const user = await UserController.getUser({ _id: socket.userId })
  if (!user) {
    throw new AppError(
      `No user found for id ${socket.userId}`,
      StatusCodes.NOT_FOUND
    )
  }

  io.to(chatroomId).emit('chat message', {
    username: user.username,
    message,
  })

  message[0] === '/'
    ? await handleCommands(socket, chatroomId, message)
    : await MessageController.insert(socket, chatroomId, message)
}

export const handleCommands = async (socket, chatroomId, message) => {
  let [command, ...argument] = message.split(' ')
  argument = argument.join(' ')

  let commands = {
    '/w': whisper(socket, argument),
    default: () => {
      throw new AppError('Unknown command')
    },
  }

  ;(commands[command] || commands['default'])()
}
