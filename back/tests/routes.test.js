import supertest from 'supertest'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jwt-then'
import base32 from 'thirty-two'

import app from '../app.js'
import setupTest from './setup.js'
import User from '../models/User.js'
import Message from '../models/Message.js'
import Stream from '../models/Stream.js'
import Chatroom from '../models/Chatroom.js'
import { seedChatroom, seedMessage, seedStream, seedUser } from './seed.js'
import { authenticateUserAndGetToken, expectResponseError, expectResponseSuccess } from './utils.js'

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

    response = await request.post('/user/register').send({ username, email: 'test@bademail.com' })
    expectResponseError(response, 'Email is not supported from your domain')

    response = await request.post('/user/register').send({ username, email, password: '12345' })
    expectResponseError(response, 'Password must be atleast 6 characters long')
  })

  it('Test feature: register & login', async () => {
    let response = await request.post('/user/register').send({ username, email, password })
    expectResponseSuccess(response, `User ${username} registered successfully`, StatusCodes.CREATED)

    response = await request.post('/user/login').send({ username, password })
    const payload = await jwt.verify(response.body.token, process.env.SECRET)
    const user = await User.findOne({ username })

    expect(payload.id).toEqual(user._id.toString())
    expectResponseSuccess(response, `User logged in successfully`)
  })

  it('Test feature: 2FA register', async () => {
    let user = await seedUser()

    expect(user.hash2FA).toBeUndefined()

    const token = await authenticateUserAndGetToken(request, user)
    const response = await request.post('/user/register2FA').set('Authorization', `Bearer ${token}`)

    expectResponseSuccess(response, `Successfully added hash for 2FA`)

    user = await User.findById(user._id)

    expect(user.hash2FA).toBeDefined()
    expect(response.body.hash2FA).toBe(user.hash2FA)
  })
})

describe('Testing chatroom routes', () => {
  it('Test error: forbidden', async () => {
    let chatroom = await Chatroom.find({})
    expect(chatroom).toHaveLength(0)

    let response = await request.post('/chatroom/create')
    expectResponseError(response, 'Forbidden 😠', StatusCodes.FORBIDDEN)

    chatroom = await Chatroom.find({})
    expect(chatroom).toHaveLength(0)
  })
  it('Test feature: create chat', async () => {
    let chatroom = await Chatroom.find({})
    expect(chatroom).toHaveLength(0)

    const token = await authenticateUserAndGetToken(request)
    const response = await request.post('/chatroom/create').set('Authorization', `Bearer ${token}`)
    expectResponseSuccess(response, 'created', StatusCodes.CREATED)

    chatroom = await Chatroom.find({})
    expect(chatroom).toHaveLength(1)
  })
})

describe('Testing stream routes', () => {
  it('Test error: get all live streams no streams found', async () => {
    const response = await request.get('/stream/get')
    expectResponseError(response, 'No stream found', StatusCodes.NOT_FOUND)
  })
  it('Test feature: get all live streams', async () => {
    const stream = await seedStream()
    const response = await request.get('/stream/get')
    expectResponseSuccess(response, '')

    expect(response.body.streams).toHaveLength(1)
    expect(response.body.streams[0]._id).toEqual(stream._id.toString())
  })

  it('Test error: invalid stream key', async () => {
    let stream = await Stream.find({})
    expect(stream).toHaveLength(0)

    const token = await authenticateUserAndGetToken(request)
    const response = await request.post('/stream/insert').set('Authorization', `Bearer ${token}`)
    expectResponseError(response, `No user found for streamKey undefined`, StatusCodes.NOT_FOUND)

    stream = await Stream.find({})
    expect(stream).toHaveLength(0)
  })
  it('Test feature: insert stream', async () => {
    let stream = await Stream.find({})
    expect(stream).toHaveLength(0)

    let streamer = await seedUser()
    const token = await authenticateUserAndGetToken(request, streamer)
    let response = await request.post('/user/registerStreamKey').set('Authorization', `Bearer ${token}`)
    expectResponseSuccess(response, 'Successfully generated stream key')

    streamer = await User.findById(streamer._id)
    response = await request
      .post('/stream/insert')
      .set('Authorization', `Bearer ${token}`)
      .send({ streamKey: streamer.streamKey })
    expectResponseSuccess(response, 'created', StatusCodes.CREATED)

    stream = await Stream.find({})
    expect(stream).toHaveLength(1)
  })

  it('Test error: invalid stream id/key', async () => {
    const token = await authenticateUserAndGetToken(request)
    const response = await request.delete('/stream/remove/1').set('Authorization', `Bearer ${token}`)
    expectResponseError(response, `No stream found for id 1`, StatusCodes.NOT_FOUND)
  })
  it('Test feature: clean remove stream', async () => {
    const [user, chatroom] = await Promise.all([seedUser(), seedChatroom()])
    const [stream, messages] = await Promise.all([seedStream(user, chatroom), seedMessage(2, user)])
    chatroom.messages = messages
    await chatroom.save()

    let res = await Promise.all([Stream.find({}), Chatroom.find({}), Message.find({})])
    expect(res[0]).toHaveLength(1)
    expect(res[1]).toHaveLength(1)
    expect(res[2]).toHaveLength(2)

    const token = await authenticateUserAndGetToken(request, user)
    const response = await request
      .delete(`/stream/remove/key/${user.streamKey}`)
      .set('Authorization', `Bearer ${token}`)
    expectResponseSuccess(response, `Stream ${stream._id} deleted!`)

    res = await Promise.all([Stream.find({}), Chatroom.find({}), Message.find({})])
    expect(res[0]).toHaveLength(0)
    expect(res[1]).toHaveLength(1)
    expect(res[2]).toHaveLength(2)
  })
})
