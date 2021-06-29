import { getReasonPhrase, StatusCodes } from 'http-status-codes'

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
  expect(response.body.message).toBe(errorMessage)
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
  expect(response.body.message).toBe(message)
}
