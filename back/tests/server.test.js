import app from '../app.js'
import supertest from 'supertest'
import setupDB from './setup.js'
import { getReasonPhrase, ReasonPhrases, StatusCodes } from 'http-status-codes'

setupDB('endpoint-testing')
const request = supertest(app)

const expectResponseError = (response, errorMessage, statusCode, status) => {
  statusCode = statusCode || StatusCodes.BAD_REQUEST
  status = status || getReasonPhrase(statusCode)

  expect(response.body.error.statusCode).toBe(statusCode)
  expect(response.body.error.status).toBe(status)
  expect(response.body.message).toBe(errorMessage)
}

const expectResponseSuccess = (
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

describe('Testing user auth', () => {
  const username = 'test_user'
  const password = '123456'
  const email = 'test@gmail.com'

  it('Failed login user -> empty DB !', async () => {
    let response = await request.post('/user/login')
    expectResponseError(response, 'Username and Password did not match')
  })

  it('Failed register user', async () => {
    let response = await request.post('/user/register')
    expectResponseError(response, 'Username is required')

    response = await request
      .post('/user/register')
      .send({ username, email: 'test@bademail.com' })
    expectResponseError(response, 'Email is not supported from your domain')

    response = await request
      .post('/user/register')
      .send({ username, email, password: '12345' })
    expectResponseError(response, 'Password must be atleast 6 characters long')
  })

  it('Success register user', async () => {
    let response = await request
      .post('/user/register')
      .send({ username, email, password })
    expectResponseSuccess(
      response,
      `User ${username} registered successfully`,
      StatusCodes.CREATED,
      ReasonPhrases.CREATED
    )
  })
})
