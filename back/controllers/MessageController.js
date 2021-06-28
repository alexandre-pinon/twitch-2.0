import User from '../models/User.js'
import Message from '../models/Message.js'
import AppError from '../errors/AppError.js'

export const insert = async (socket, io, chatroomId, message) => {
  const userPromise = User.findById(socket.userId)
  const chatPromise = Chatroom.findById(chatroomId)
  const [user, chatroom] = await Promise.all([userPromise, chatPromise])

  if (!user) {
    throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)
  }
  if (!chatroom) {
    throw new AppError(
      `No chat found for id ${chatroomId}`,
      StatusCodes.NOT_FOUND
    )
  }

  io.to(chatroomId).emit('message', {
    name: user.name,
    message,
  })

  const newMessage = await new Message({
    user: socket.userId,
    message,
  }).save()
  chatroom.messages.push(newMessage._id)
}
