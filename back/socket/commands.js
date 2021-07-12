import * as ChatroomController from '../controllers/ChatroomController.js'
import * as MessageController from '../controllers/MessageController.js'
import AppError from '../errors/AppError.js'
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
      socket.leave(chatroomId)
    }
  }
  await ChatroomController.addOrRemoveUser(chatroomId, targetUser._id, 'BAN')

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
      socket.join(chatroomId)
    }
  }
  await ChatroomController.addOrRemoveUser(chatroomId, targetUser._id, 'UNBAN')

  io.to(chatroomId).emit('chat message', {
    username: user.username,
    message: `${targetUsername} was unbanned by ${user.username}`,
  })
}

export const whisper = async (socket, io, argument) => {
  let [targetUsername, ...message] = argument.split(' ')
  message = message.join(' ').trim()

  if (!message) throw new AppError('Message is empty')

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
