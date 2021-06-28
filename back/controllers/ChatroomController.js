import { StatusCodes } from 'http-status-codes'

import User from '../models/User.js'
import Chatroom from '../models/Chatroom.js'
import AppError from '../errors/AppError.js'

export const createAjax = async (request, response) => {
  const res = await create(request.body.userId)
  response.status(StatusCodes.CREATED).json(res)
}

export const create = async (userId) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)
  }

  const chatroom = await new Chatroom({ users: [user] }).save()

  return { message: `Chatroom ${chatroom._id} created` }
}

export const addOrRemoveUser = async (chatroomId, userId, action) => {
  const chatroom = await Chatroom.findById(chatroomId)
  if (!chatroom) {
    throw new AppError(
      `No chat found for id ${chatroomId}`,
      StatusCodes.NOT_FOUND
    )
  }

  switch (action) {
    case 'ADD':
      if (!chatroom.users.includes(userId)) {
        chatroom.users.push(userId)
        chatroom.save()
      }
      break
    case 'REMOVE':
      if (chatroom.users.includes(userId)) {
        chatroom.users.pull(userId)
        chatroom.save()
      }
      break
    default:
      throw new AppError(`Unknown action ${action}`)
  }
}
