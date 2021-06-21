import { StatusCodes, getReasonPhrase } from 'http-status-codes'

class AppError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.statusCode = statusCode || StatusCodes.BAD_REQUEST
    this.status = getReasonPhrase(this.statusCode)
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
