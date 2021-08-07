import supertest from 'supertest'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jwt-then'
import base32 from 'thirty-two'

import app from '../app.js'
import setupTest from './setup.js'
import User from '../models/User.js'
import Chatroom from '../models/Chatroom.js'
import { seedStream, seedUser } from './seed.js'
import { expectResponseError, expectResponseSuccess } from './utils.js'

setupTest('route-testing')
const request = supertest(app)

describe('Testing user auth', () => {
  const username = 'testUser'
  const password = '123456'
  const email = 'test@gmail.com'

  it('Test error: login error if bad credentials', async () => {
    let response = await request.post('/user/login')
    expectResponseError(response, 'Username and Password did not match')
  })

  it('Test error: register error if bad credentials', async () => {
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

  it('Test feature: register & login', async () => {
    let response = await request
      .post('/user/register')
      .send({ username, email, password })
    expectResponseSuccess(
      response,
      `User ${username} registered successfully`,
      StatusCodes.CREATED
    )

    response = await request.post('/user/login').send({ username, password })
    const payload = await jwt.verify(response.body.token, process.env.SECRET)
    const user = await User.findOne({ username })

    expect(payload.id).toEqual(user._id.toString())
    expectResponseSuccess(response, `User logged in successfully`)
  })

  it('Test feature: 2FA register', async () => {
    let user = await seedUser()

    expect(user.hash2FA).toBeUndefined()

    let response = await request
      .post('/user/login')
      .send({ username: user.username, password: 'password1' })
    response = await request
      .post('/user/register2FA')
      .send({ token: response.body.token })

    expectResponseSuccess(response, `Successfully added hash for 2FA`)

    user = await User.findById(user._id)
    const secret = base32.encode(user.hash2FA).toString()

    expect(user.hash2FA).toBeDefined()
    expect(response.body.otpuri).toBe(
      `otpauth://totp/${user.username}?secret=${secret}&issuer=${process.env.NODE_SERVERNAME}`
    )
  })
})

describe('Testing chatroom routes', () => {
  it('Test error: chat creation error if no user', async () => {
    let response = await request.post('/chatroom/create')
    expectResponseError(
      response,
      'No user found for id undefined',
      StatusCodes.NOT_FOUND
    )
  })
  it('Test feature: create chat', async () => {
    let chatroom = await Chatroom.find({})
    expect(chatroom.length).toBe(0)

    const testUser = await seedUser()
    let response = await request
      .post('/chatroom/create')
      .send({ userId: testUser._id })
    expectResponseSuccess(response, 'created', StatusCodes.CREATED)

    chatroom = await Chatroom.find({})
    expect(chatroom.length).toBe(1)
  })
})

describe('Testing stream routes', () => {
  it('Test error: no streams found', async () => {
    let response = await request.get('/stream/get')
    expectResponseSuccess(response, '', StatusCodes.NOT_FOUND)
  })
  it('Test feature: get all streams', async () => {
    const stream = await seedStream()
    let response = await request.get('/stream/get')
    expectResponseSuccess(response, '')
  })
})
