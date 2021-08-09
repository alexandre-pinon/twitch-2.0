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

  if (!user) throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)
  if (!targetUser) throw new AppError(`No user found for id ${targetUserId}`, StatusCodes.NOT_FOUND)

  return await new Chatroom({
    users: [user, targetUser],
    private: true,
  }).save()
}

export const create = async (userId) => {
  const user = await User.findById(userId)
  if (!user) throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)

  const chatroom = await new Chatroom({ users: [user] }).save()

  return { message: `Chatroom ${chatroom._id} created` }
}

export const addOrRemoveUser = async (chatroomId, userId, action) => {
  const userPromise = User.findById(userId)
  const chatPromise = Chatroom.findById(chatroomId)
  const [user, chatroom] = await Promise.all([userPromise, chatPromise])

  if (!user) throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)
  if (!chatroom) throw new AppError(`No chat found for id ${chatroomId}`, StatusCodes.NOT_FOUND)

  let updateChatroom = false
  switch (action) {
    case 'MOD':
      if (!chatroom.mods.includes(userId)) {
        chatroom.mods.push(userId)
        updateChatroom = true
      }
      break
    case 'UNMOD':
      if (chatroom.mods.includes(userId)) {
        chatroom.mods.pull(userId)
        updateChatroom = true
      }
      break
    case 'UNBAN':
      if (chatroom.banned_users.includes(userId)) {
        chatroom.banned_users.pull(userId)
        updateChatroom = true
      }
    case 'ADD':
      if (!chatroom.users.includes(userId)) {
        chatroom.users.push(userId)
        updateChatroom = true
      }
      break
    case 'BAN':
      if (!chatroom.banned_users.includes(userId)) {
        chatroom.banned_users.push(userId)
        updateChatroom = true
      }
    case 'REMOVE':
      if (chatroom.users.includes(userId)) {
        chatroom.users.pull(userId)
        updateChatroom = true
      }
      break
    default:
      throw new AppError(`Unknown action ${action}`)
  }

  if (updateChatroom) await chatroom.save()
  return updateChatroom
}

export const getOneChatroom = async (params, populateUsers = null) => {
  const query = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => Object.keys(Chatroom.schema.tree).includes(key))
  )
  if (populateUsers) {
    if (!Object.keys(Chatroom.schema.tree).includes(populateUsers)) {
      throw new AppError(`Unknown field ${populateUsers}`)
    }
    return await Chatroom.findOne(query).populate({
      path: populateUsers,
      model: 'User',
    })
  }

  return await Chatroom.findOne(query)
}
