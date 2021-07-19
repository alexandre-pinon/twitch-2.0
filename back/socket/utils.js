import * as UserController from '../controllers/UserController.js'
import AppError from '../errors/AppError.js'

export const checkUserAndTargetUserExists = async (userId, targetUsername) => {
  const userPromise = UserController.getUser({ _id: userId })
  const targetUserPromise = UserController.getUser({ username: targetUsername })
  const [user, targetUser] = await Promise.all([userPromise, targetUserPromise])
  if (!user)
    throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)
  if (!targetUser)
    throw new AppError(
      `No user found for username ${targetUsername}`,
      StatusCodes.NOT_FOUND
    )

  return { user, targetUser }
}

export const checkArgument = (argument, checkIfMessageIsEmpty) => {
  let [targetUsername, ...message] = argument.split(' ')
  message = message.join(' ').trim()

  if (checkIfMessageIsEmpty && !message) throw new AppError('Message is empty')
  if (!checkIfMessageIsEmpty && message) throw new AppError('Invalid syntax')

  return { targetUsername, message }
}
