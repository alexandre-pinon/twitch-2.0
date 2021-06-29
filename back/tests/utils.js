import { getReasonPhrase, StatusCodes } from 'http-status-codes'

export const expectError = (error, errormessage, statusCode, status) => {
  statusCode = statusCode || StatusCodes.BAD_REQUEST
  status = status || getReasonPhrase(statusCode)

  expect(error.message).toBe(errormessage)
  expect(error.statusCode).toBe(statusCode)
  expect(error.status).toBe(status)
}

export const expectResponseError = (
  response,
  errorMessage,
  statusCode,
  status
) => {
  statusCode = statusCode || StatusCodes.BAD_REQUEST
  status = status || getReasonPhrase(statusCode)

  expect(response.body.error.statusCode).toBe(statusCode)
  expect(response.body.error.status).toBe(status)
  expect(response.body.message).toContain(errorMessage)
}

export const expectResponseSuccess = (
  response,
  message,
  statusCode,
  statusMessage
) => {
  statusCode = statusCode || StatusCodes.OK
  statusMessage = statusMessage || getReasonPhrase(statusCode)

  expect(response.statusCode).toBe(statusCode)
  expect(response.res.statusMessage).toBe(statusMessage)
  expect(response.body.message).toContain(message)
}
