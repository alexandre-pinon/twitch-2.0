import * as UserController from '../controllers/UserController.js'
import * as ChatroomController from '../controllers/ChatroomController.js'
import * as MessageController from '../controllers/MessageController.js'
import AppError from '../errors/AppError.js'
import { handleJoinRoom, handleLeaveRoom } from './io.js'
import { checkUserAndTargetUserExists } from './utils.js'

export const ban = async (socket, io, chatroomId, argument) => {
  let [targetUsername, ...message] = argument.split(' ')
  message = message.join(' ').trim()

  if (message) throw new AppError('Invalid syntax')

  const { user, targetUser } = await checkUserAndTargetUserExists(
    socket.userId,
    targetUsername
  )

  for (let [socketId, socket] of io.sockets.sockets) {
    if (socket.userId.toString() === targetUser._id.toString()) {
      await handleLeaveRoom(socket, chatroomId)
    }
  }

  io.to(chatroomId).emit('chat message', {
    username: user.username,
    message: `${targetUsername} was banned by ${user.username}`,
  })
}

export const unban = async (socket, io, chatroomId, argument) => {
  let [targetUsername, ...message] = argument.split(' ')
  message = message.join(' ').trim()

  if (message) throw new AppError('Invalid syntax')

  const { user, targetUser } = await checkUserAndTargetUserExists(
    socket.userId,
    targetUsername
  )

  for (let [socketId, socket] of io.sockets.sockets) {
    if (socket.userId.toString() === targetUser._id.toString()) {
      await handleJoinRoom(socket, chatroomId)
    }
  }

  io.to(chatroomId).emit('chat message', {
    username: user.username,
    message: `${targetUsername} was unbanned by ${user.username}`,
  })
}

export const whisper = async (socket, io, argument) => {
  let [targetUsername, ...message] = argument.split(' ')
  message = message.join(' ').trim()

  if (!message) {
    throw new AppError('Message is empty')
  }

  const { user, targetUser } = await checkUserAndTargetUserExists(
    socket.userId,
    targetUsername
  )

  let chatroom = await ChatroomController.getChatroom({
    users: [socket.userId, targetUser._id],
    private: true,
  })
  if (!chatroom) {
    chatroom = await ChatroomController.createPrivate(
      socket.userId,
      targetUser._id
    )
  }

  const chatroomId = chatroom._id.toString()
  socket.join(chatroomId)
  io.to(chatroomId).emit('chat message', {
    username: user.username,
    message,
  })

  await MessageController.insert(socket, chatroomId, message)
}
