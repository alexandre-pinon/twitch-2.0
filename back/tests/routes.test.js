import supertest from 'supertest'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import app from '../app.js'
import setupDB from './setup.js'
import Chatroom from '../models/Chatroom.js'
import { seedUser } from './seed.js'
import { expectResponseError, expectResponseSuccess } from './utils.js'

setupDB('route-testing')
const request = supertest(app)

describe('Testing user auth', () => {
  const username = 'testUser'
  const password = '123456'
  const email = 'test@gmail.com'

  it('Failed login -> bad credentials', async () => {
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
      StatusCodes.CREATED
    )

    response = await request.post('/user/login').send({ username, password })
    expectResponseSuccess(response, `User logged in successfully`)
  })
})

describe('Testing chatroom routes', () => {
  it('Failed create -> no users', async () => {
    let response = await request.post('/chatroom/create')
    expectResponseError(
      response,
      'No user found for id undefined',
      StatusCodes.NOT_FOUND
    )
  })
  it('Success create', async () => {
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