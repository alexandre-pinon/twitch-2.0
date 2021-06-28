import jwt from 'jwt-then'

import * as ChatroomController from '../controllers/ChatroomController.js'
import * as MessageController from '../controllers/MessageController.js'
import Chatroom from '../models/Chatroom.js'
import AppError from '../errors/AppError.js'
import { catchAsyncSocket } from '../errors/ErrorHandler.js'

export const authenticateUser = async (socket, next) => {
  const token = socket.handshake.auth.token
  const payload = await jwt.verify(token, process.env.SECRET)
  socket.userId = payload.id
  next()
}

export const handleSocket = (socket) => {
  console.log('Connected: ' + socket.userId)

  socket.on('disconnect', () => {
    console.log('Disconnected: ' + socket.userId)
  })

  socket.on('join room', (chatroomId) => {
    catchAsyncSocket(handleJoinRoom(socket, chatroomId))
  })

  socket.on('leave room', (chatroomId) => {
    catchAsyncSocket(handleLeaveRoom(socket, chatroomId))
  })

  socket.on('chat message', (chatroomId, message) => {
    catchAsyncSocket(handleChatMessage(socket, chatroomId, message))
  })

  socket.on('private message', (chatroomId, message) => {
    console.log('WIP!')
  })
}

const handleJoinRoom = async (socket, chatroomId) => {
  socket.join(chatroomId)
  console.log(`User ${socket.userId} joined chatroom ${chatroomId}`)
  ChatroomController.addOrRemoveUser(chatroomId, socket.userId, 'ADD')
}

const handleLeaveRoom = async (socket, chatroomId) => {
  socket.leave(chatroomId)
  console.log(`User ${socket.userId} left chatroom ${chatroomId}`)
  ChatroomController.addOrRemoveUser(chatroomId, socket.userId, 'REMOVE')
}

const handleChatMessage = async (socket, chatroomId, message) => {
  message = message.trim()

  if (!message) {
    throw new AppError('Message is empty')
  }

  message[0] === '/'
    ? console.log('WIP!')
    : MessageController.insert(socket, io, chatroomId, message)
}
