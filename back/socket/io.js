import jwt from 'jwt-then'

import * as UserController from '../controllers/UserController.js'
import * as ChatroomController from '../controllers/ChatroomController.js'
import * as MessageController from '../controllers/MessageController.js'
import AppError from '../errors/AppError.js'
import { catchAsyncSocket } from '../errors/ErrorHandler.js'
import { ban, mod, unmod, unban, whisper, mods } from './commands.js'
import { StatusCodes } from 'http-status-codes'

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

  if (!message) throw new AppError('Message is empty')

  const chatroom = await ChatroomController.getOneChatroom({ _id: chatroomId })
  if (!chatroom)
    throw new AppError(
      `No chatroom found for id ${chatroomId}`,
      StatusCodes.NOT_FOUND
    )
  if (chatroom.banned_users.includes(socket.userId))
    throw new AppError("You're banned from this chat!", StatusCodes.FORBIDDEN)

  chatroom.private
    ? await handlePrivateMessage(socket, io, chatroomId, message)
    : await handlePublicMessage(socket, io, chatroomId, message)
}

const handlePrivateMessage = async (socket, io, chatroomId, message) => {
  const user = await UserController.getOneUser({ _id: socket.userId })
  if (!user)
    throw new AppError(
      `No user found for id ${socket.userId}`,
      StatusCodes.NOT_FOUND
    )

  io.to(chatroomId).emit('chat message', {
    username: user.username,
    message,
  })
  await MessageController.insert(socket, chatroomId, message)
}

const handlePublicMessage = async (socket, io, chatroomId, message) => {
  message[0] === '/'
    ? await handleCommands(socket, io, chatroomId, message)
    : await handlePrivateMessage(socket, io, chatroomId, message)
}

const handleCommands = async (socket, io, chatroomId, message) => {
  let [command, ...argument] = message.split(' ')
  argument = argument.join(' ')

  let commands = {
    '/mods': async () => {
      await mods(socket, io, chatroomId, argument)
    },
    '/mod': async () => {
      await mod(socket, io, chatroomId, argument)
    },
    '/unmod': async () => {
      await unmod(socket, io, chatroomId, argument)
    },
    '/ban': async () => {
      await ban(socket, io, chatroomId, argument)
    },
    '/unban': async () => {
      await unban(socket, io, chatroomId, argument)
    },
    '/w': async () => {
      await whisper(socket, io, argument)
    },
    default: () => {
      throw new AppError('Unknown command')
    },
  }

  await (commands[command] || commands['default'])()
}
