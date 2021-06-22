import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import AppError from './AppError.js'

export const catchAsync = (fn) => {
  return (request, response, next) => {
    fn(request, response, next).catch((error) => {
      if (error instanceof AppError) {
        sendError(error, request, response, next)
      } else {
        next(error)
      }
    })
  }
}

export const catchAsyncSocket = (fn) => {
  return (socket, next) => {
    fn(socket, next).catch((error) => {
      next(error)
    })
  }
}

export const notFound = (request, response, next) => {
  const error = new AppError('Route not found', StatusCodes.NOT_FOUND)
  sendError(error, request, response, next)
}

export const mongooseErrors = (error, request, response, next) => {
  let err = { ...error }
  if (err.name === 'CastError') err = handleCastErrorDB(err)
  if (err.code === 11000) err = handleDuplicateFieldsDB(err)
  if (err.name === 'ValidationError') err = handleValidationErrorDB(err)
  sendError(err, request, response, next)
}

const sendError = (error, request, response, next) => {
  error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  error.status = error.status || ReasonPhrases.INTERNAL_SERVER_ERROR

  if (process.env.NODE_ENV === 'DEV') {
    sendErrorDev(error, response)
  } else if (process.env.NODE_ENV === 'PROD') {
    sendErrorProd(error, response)
  }
}

const sendErrorDev = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  })
}

const sendErrorProd = (error, response) => {
  if (error.isOperational) {
    response.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    })
  } else {
    console.error('ERROR 💥: ', error)

    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: 'Something went very wrong!',
    })
  }
}

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`
  return new AppError(message)
}

const handleDuplicateFieldsDB = (error) => {
  const value = error.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
  const message = `Duplicate field value: ${value}. Please use anothe value!`
  return new AppError(message)
}

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message)
}
