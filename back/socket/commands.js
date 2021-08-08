import * as ChatroomController from '../controllers/ChatroomController.js'
import * as MessageController from '../controllers/MessageController.js'
import AppError from '../errors/AppError.js'
import { checkArgument, checkUserAndTargetUserExists } from './utils.js'

export const mods = async (socket, io, chatroomId, argument) => {
  if (argument) throw new AppError('Invalid synthax')

  const chatroom = await ChatroomController.getOneChatroom({ _id: chatroomId }, 'mods')

  const modUsernames = chatroom.mods.map((mod) => mod.username)
  const message = modUsernames.join(' ')

  io.to(chatroomId).emit('chat message', {
    username: process.env.NODE_SERVERNAME,
    message,
  })
}

export const mod = async (socket, io, chatroomId, argument) => {
  const { targetUsername, message } = checkArgument(argument, false)
  const { user, targetUser } = await checkUserAndTargetUserExists(socket.userId, targetUsername)

  const chatroomWasUpdated = await ChatroomController.addOrRemoveUser(chatroomId, targetUser._id, 'MOD')

  io.to(chatroomId).emit('chat message', {
    username: process.env.NODE_SERVERNAME,
    message: chatroomWasUpdated
      ? `${targetUsername} was granted mod permissions by ${user.username}`
      : `${targetUsername} was alredy a mod`,
  })
}

export const unmod = async (socket, io, chatroomId, argument) => {
  const { targetUsername, message } = checkArgument(argument, false)
  const { user, targetUser } = await checkUserAndTargetUserExists(socket.userId, targetUsername)

  const chatroomWasUpdated = await ChatroomController.addOrRemoveUser(chatroomId, targetUser._id, 'UNMOD')

  io.to(chatroomId).emit('chat message', {
    username: process.env.NODE_SERVERNAME,
    message: chatroomWasUpdated
      ? `${user.username} removed ${targetUsername}'s mod permissions`
      : `${targetUsername} is not a mod`,
  })
}

export const ban = async (socket, io, chatroomId, argument) => {
  const { targetUsername, message } = checkArgument(argument, false)
  const { user, targetUser } = await checkUserAndTargetUserExists(socket.userId, targetUsername)

  for (let [socketId, socket] of io.sockets.sockets) {
    if (socket.userId.toString() === targetUser._id.toString()) {
      socket.leave(chatroomId)
    }
  }
  const chatroomWasUpdated = await ChatroomController.addOrRemoveUser(chatroomId, targetUser._id, 'BAN')

  io.to(chatroomId).emit('chat message', {
    username: process.env.NODE_SERVERNAME,
    message: chatroomWasUpdated
      ? `${targetUsername} was banned by ${user.username}`
      : `${targetUsername} was already banned`,
  })
}

export const unban = async (socket, io, chatroomId, argument) => {
  const { targetUsername, message } = checkArgument(argument, false)
  const { user, targetUser } = await checkUserAndTargetUserExists(socket.userId, targetUsername)

  for (let [socketId, socket] of io.sockets.sockets) {
    if (socket.userId.toString() === targetUser._id.toString()) {
      socket.join(chatroomId)
    }
  }
  const chatroomWasUpdated = await ChatroomController.addOrRemoveUser(chatroomId, targetUser._id, 'UNBAN')

  io.to(chatroomId).emit('chat message', {
    username: process.env.NODE_SERVERNAME,
    message: chatroomWasUpdated
      ? `${targetUsername} was unbanned by ${user.username}`
      : `${targetUsername} was not banned`,
  })
}

export const whisper = async (socket, io, argument) => {
  const { targetUsername, message } = checkArgument(argument, true)
  const { user, targetUser } = await checkUserAndTargetUserExists(socket.userId, targetUsername)

  let chatroom = await ChatroomController.getOneChatroom({
    users: [socket.userId, targetUser._id],
    private: true,
  })
  if (!chatroom) {
    chatroom = await ChatroomController.createPrivate(socket.userId, targetUser._id)
  }

  const chatroomId = chatroom._id.toString()
  socket.join(chatroomId)
  io.to(chatroomId).emit('chat message', {
    username: user.username,
    message,
  })

  await MessageController.insert(socket, chatroomId, message)
}
