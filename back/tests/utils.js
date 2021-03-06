import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { seedUser } from './seed'

export const expectError = (error, errormessage, statusCode, status) => {
  statusCode = statusCode || StatusCodes.BAD_REQUEST
  status = status || getReasonPhrase(statusCode)

  expect(error.message).toBe(errormessage)
  expect(error.statusCode).toBe(statusCode)
  expect(error.status).toBe(status)
}

export const expectSocketError = (error, errormessage, statusCode, status) => {
  statusCode = statusCode || StatusCodes.BAD_REQUEST
  status = status || getReasonPhrase(statusCode)

  expect(error.message).toBe(errormessage)
  expect(error.error.statusCode).toBe(statusCode)
  expect(error.error.status).toBe(status)
}

export const expectResponseError = (response, errorMessage, statusCode, status) => {
  statusCode = statusCode || StatusCodes.BAD_REQUEST
  status = status || getReasonPhrase(statusCode)

  expect(response.body.error.statusCode).toBe(statusCode)
  expect(response.body.error.status).toBe(status)
  expect(response.body.message).toContain(errorMessage)
}

export const expectResponseSuccess = (response, message, statusCode, statusMessage) => {
  statusCode = statusCode || StatusCodes.OK
  statusMessage = statusMessage || getReasonPhrase(statusCode)

  expect(response.statusCode).toBe(statusCode)
  expect(response.res.statusMessage).toBe(statusMessage)
  if (message) expect(response.body.message).toContain(message)
}

export const authenticateUserAndGetToken = async (request, user) => {
  if (!user) user = await seedUser()
  let response = await request.post('/user/login').send({ username: user.username, password: 'password1' })

  return response.body.token
}
