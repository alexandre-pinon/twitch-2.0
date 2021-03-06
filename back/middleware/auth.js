import jwt from 'jwt-then'
import { StatusCodes } from 'http-status-codes'

import AppError from '../errors/AppError.js'

export default async (request, response, next) => {
  try {
    if (!request.headers.authorization) {
      throw new AppError('Forbidden 😠', StatusCodes.FORBIDDEN)
    }
    const token = request.headers.authorization.split(' ')[1]
    const payload = await jwt.verify(token, process.env.SECRET)
    request.body.userId = payload.id
    next()
  } catch (error) {
    throw new AppError('Forbidden 😠', StatusCodes.FORBIDDEN)
  }
}
