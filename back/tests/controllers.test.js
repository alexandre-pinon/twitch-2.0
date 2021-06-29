import supertest from 'supertest'
import { StatusCodes } from 'http-status-codes'

import app from '../app.js'
import setupDB from './setup.js'
import Chatroom from '../models/Chatroom.js'
import { seedChatroom, seedUser } from './seed.js'
import { expectError } from './utils.js'
import { addOrRemoveUser } from '../controllers/ChatroomController.js'

setupDB('controller-testing')
const request = supertest(app)

describe('Testing chat methods', () => {
  it('Test adding user to chat', async () => {
    let user = await seedUser()
    let chatroom = await seedChatroom()

    expect(chatroom.users).toHaveLength(0)

    await addOrRemoveUser(chatroom._id, user._id, 'ADD')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(1)

    // Cannot add same user twice!
    await addOrRemoveUser(chatroom._id, user._id, 'ADD')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(1)
  })

  it('Test removing user from chat', async () => {
    let user = await seedUser()
    let chatroom = await seedChatroom(user)

    expect(chatroom.users).toHaveLength(1)

    await addOrRemoveUser(chatroom._id, user._id, 'REMOVE')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(0)

    // User not in chat: do nothing
    await addOrRemoveUser(chatroom._id, user._id, 'REMOVE')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(0)
  })

  it('Test error handling', async () => {
    let userId = null
    let chatroomId = null
    let action = 'blargh'
    try {
      await addOrRemoveUser(chatroomId, userId, action)
    } catch (error) {
      expectError(
        error,
        `No user found for id ${userId}`,
        StatusCodes.NOT_FOUND
      )
    }

    const user = await seedUser()
    userId = user._id
    try {
      await addOrRemoveUser(chatroomId, userId, action)
    } catch (error) {
      expectError(
        error,
        `No chat found for id ${chatroomId}`,
        StatusCodes.NOT_FOUND
      )
    }

    const chatroom = await seedChatroom()
    chatroomId = chatroom._id
    try {
      await addOrRemoveUser(chatroomId, userId, action)
    } catch (error) {
      expectError(error, `Unknown action ${action}`)
    }
  })
})
