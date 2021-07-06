import * as UserController from '../controllers/UserController.js'
import * as ChatroomController from '../controllers/ChatroomController.js'
import * as MessageController from '../controllers/MessageController.js'
import AppError from '../errors/AppError.js'

export const whisper = async (socket, io, argument) => {
  let [targetUsername, ...message] = argument.split(' ')
  message = message.join(' ').trim()

  if (!message) {
    throw new AppError('Message is empty')
  }

  const userPromise = UserController.getUser({ _id: socket.userId })
  const targetUserPromise = UserController.getUser({ username: targetUsername })
  const [user, targetUser] = await Promise.all([userPromise, targetUserPromise])
  if (!user) {
    throw new AppError(
      `No user found for id ${socket.userId}`,
      StatusCodes.NOT_FOUND
    )
  }
  if (!targetUser) {
    throw new AppError(
      `No user found for username ${targetUsername}`,
      StatusCodes.NOT_FOUND
    )
  }

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
