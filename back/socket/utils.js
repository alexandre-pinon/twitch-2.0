import { StatusCodes } from 'http-status-codes'
import * as UserController from '../controllers/UserController.js'
import AppError from '../errors/AppError.js'

export const checkUserAndTargetUserExists = async (userId, targetUsername) => {
  const userPromise = UserController.getOneUser({ _id: userId })
  const targetUserPromise = UserController.getOneUser({
    username: targetUsername,
  })
  const [user, targetUser] = await Promise.all([userPromise, targetUserPromise])
  if (!user) throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)
  if (!targetUser) throw new AppError(`No user found for username ${targetUsername}`, StatusCodes.NOT_FOUND)

  return { user, targetUser }
}

export const checkArgument = (argument, emptyUsername, notEmptyUsername, emptyMessage, notEmptyMessage) => {
  let [targetUsername, ...message] = argument.split(' ')
  message = message.join(' ').trim()

  if (emptyUsername && targetUsername) throw new AppError('Invalid syntax')
  if (notEmptyUsername && !targetUsername) throw new AppError('Invalid syntax: no user provided')
  if (emptyMessage && message) throw new AppError('Invalid syntax')
  if (notEmptyMessage && !message) throw new AppError('Message is empty')

  return { targetUsername, message }
}
