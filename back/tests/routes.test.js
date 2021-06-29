import app from '../app.js'
import supertest from 'supertest'
import setupDB from './setup.js'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { expectResponseError, expectResponseSuccess } from './utils.js'

setupDB('endpoint-testing')
const request = supertest(app)

describe('Testing user auth', () => {
  const username = 'test_user'
  const password = '123456'
  const email = 'test@gmail.com'

  it('Failed login -> empty DB!', async () => {
    let response = await request.post('/user/login')
    expectResponseError(response, 'Username and Password did not match')
  })

  it('Failed register -> bad credentials', async () => {
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

  it('Success register & login', async () => {
    let response = await request
      .post('/user/register')
      .send({ username, email, password })
    expectResponseSuccess(
      response,
      `User ${username} registered successfully`,
      StatusCodes.CREATED,
      ReasonPhrases.CREATED
    )

    response = await request.post('/user/login').send({ username, password })
    expectResponseSuccess(response, `User logged in successfully`)
  })
})
