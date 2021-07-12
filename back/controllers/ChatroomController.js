import { StatusCodes } from 'http-status-codes'

import User from '../models/User.js'
import Chatroom from '../models/Chatroom.js'
import AppError from '../errors/AppError.js'

export const createAjax = async (request, response) => {
  const res = await create(request.body.userId)
  response.status(StatusCodes.CREATED).json(res)
}

export const createPrivate = async (userId, targetUserId) => {
  const userPromise = User.findById(userId)
  const targetUserPromise = User.findById(targetUserId)
  const [user, targetUser] = await Promise.all([userPromise, targetUserPromise])

  if (!user)
    throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)
  if (!targetUser)
    throw new AppError(
      `No user found for id ${targetUserId}`,
      StatusCodes.NOT_FOUND
    )

  return await new Chatroom({ users: [user, targetUser], private: true }).save()
}

export const create = async (userId) => {
  const user = await User.findById(userId)
  if (!user)
    throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)

  const chatroom = await new Chatroom({ users: [user] }).save()

  return { message: `Chatroom ${chatroom._id} created` }
}

export const addOrRemoveUser = async (chatroomId, userId, action) => {
  const userPromise = User.findById(userId)
  const chatPromise = Chatroom.findById(chatroomId)
  const [user, chatroom] = await Promise.all([userPromise, chatPromise])

  if (!user)
    throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)
  if (!chatroom)
    throw new AppError(
      `No chat found for id ${chatroomId}`,
      StatusCodes.NOT_FOUND
    )

  switch (action) {
    case 'ADD':
      if (!chatroom.users.includes(userId)) {
        chatroom.users.push(userId)
        await chatroom.save()
      }
      break
    case 'REMOVE':
      if (chatroom.users.includes(userId)) {
        chatroom.users.pull(userId)
        await chatroom.save()
      }
      break
    default:
      throw new AppError(`Unknown action ${action}`)
  }
}

export const getChatroom = async (params) => {
  const query = Object.fromEntries(
    Object.entries(params).filter(([key, value]) =>
      Object.keys(Chatroom.schema.tree).includes(key)
    )
  )
  return await Chatroom.findOne(query)
}
