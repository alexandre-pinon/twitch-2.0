import { StatusCodes } from 'http-status-codes'

import * as ChatroomController from '../controllers/ChatroomController.js'
import * as UserController from '../controllers/UserController.js'
import * as MessageController from '../controllers/MessageController.js'
import setupTest, { serverSocket } from './setup.js'
import Message from '../models/Message.js'
import Chatroom from '../models/Chatroom.js'
import { seedChatroom, seedUser } from './seed.js'
import { expectError } from './utils.js'

setupTest('controller-testing', true)

describe('Testing user methods', () => {
  it('Test feature: get user', async () => {
    let userObj = await UserController.getUser({})
    expect(userObj).toBeNull()

    const user = await seedUser()

    userObj = await UserController.getUser({
      _id: user._id,
      username: user.username,
    })
    expect(userObj._id).toEqual(user._id)

    userObj = await UserController.getUser({ pomme: 'pote' })
    expect(userObj._id).toEqual(user._id)

    userObj = await UserController.getUser({ username: 'jean-benoit' })
    expect(userObj).toBeNull()
  })
})

describe('Testing chat methods', () => {
  it('Test feature: get chat', async () => {
    let chatroomObj = await ChatroomController.getChatroom({})
    expect(chatroomObj).toBeNull()

    let user = await seedUser()
    const chatroom = await seedChatroom(user, null, true)

    chatroomObj = await ChatroomController.getChatroom({ _id: chatroom._id })
    expect(chatroomObj._id).toEqual(chatroom._id)

    chatroomObj = await ChatroomController.getChatroom({
      users: [null],
    })
    expect(chatroomObj).toBeNull()

    chatroomObj = await ChatroomController.getChatroom({
      users: [user._id],
    })
    expect(chatroomObj._id).toEqual(chatroom._id)
  })

  it('Test feature: create private chat', async () => {
    let [user1, user2] = await seedUser(2)
    const chatroom = await ChatroomController.createPrivate(
      user1._id,
      user2._id
    )
    expect(chatroom.users[0]).toEqual(user1._id)
    expect(chatroom.users[1]).toEqual(user2._id)
  })

  it('Test error: private chat creation error if no users', async () => {
    let userId1,
      userId2 = null
    try {
      await ChatroomController.createPrivate(userId1, userId2)
    } catch (error) {
      expectError(
        error,
        `No user found for id ${userId1}`,
        StatusCodes.NOT_FOUND
      )
    }

    const user = await seedUser()
    userId1 = user._id
    try {
      await ChatroomController.createPrivate(userId1, userId2)
    } catch (error) {
      expectError(
        error,
        `No user found for id ${userId2}`,
        StatusCodes.NOT_FOUND
      )
    }
  })

  it('Test feature: add user to chat', async () => {
    let user = await seedUser()
    let chatroom = await seedChatroom()

    expect(chatroom.users).toHaveLength(0)

    await ChatroomController.addOrRemoveUser(chatroom._id, user._id, 'ADD')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(1)

    // Cannot add same user twice!
    await ChatroomController.addOrRemoveUser(chatroom._id, user._id, 'ADD')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(1)
  })

  it('Test feature: remove user from chat', async () => {
    let user = await seedUser()
    let chatroom = await seedChatroom(user)

    expect(chatroom.users).toHaveLength(1)

    await ChatroomController.addOrRemoveUser(chatroom._id, user._id, 'REMOVE')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(0)

    // User not in chat: do nothing
    await ChatroomController.addOrRemoveUser(chatroom._id, user._id, 'REMOVE')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(0)
  })

  it('Test feature: ban user from chat', async () => {
    let user = await seedUser()
    let chatroom = await seedChatroom(user)

    expect(chatroom.users).toHaveLength(1)
    expect(chatroom.banned_users).toHaveLength(0)

    await ChatroomController.addOrRemoveUser(chatroom._id, user._id, 'BAN')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(0)
    expect(chatroom.banned_users).toHaveLength(1)

    // Cannot add same user twice!
    await ChatroomController.addOrRemoveUser(chatroom._id, user._id, 'BAN')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(0)
    expect(chatroom.banned_users).toHaveLength(1)
  })

  it('Test feature: unban user from chat', async () => {
    let user = await seedUser()
    let chatroom = await seedChatroom(null, user)

    expect(chatroom.users).toHaveLength(0)
    expect(chatroom.banned_users).toHaveLength(1)

    await ChatroomController.addOrRemoveUser(chatroom._id, user._id, 'UNBAN')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(1)
    expect(chatroom.banned_users).toHaveLength(0)

    // Cannot add same user twice!
    await ChatroomController.addOrRemoveUser(chatroom._id, user._id, 'UNBAN')
    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.users).toHaveLength(1)
    expect(chatroom.banned_users).toHaveLength(0)
  })

  it('Test error: chat add & remove error if no user/chat/action', async () => {
    let userId = null
    let chatroomId = null
    let action = 'blargh'
    try {
      await ChatroomController.addOrRemoveUser(chatroomId, userId, action)
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
      await ChatroomController.addOrRemoveUser(chatroomId, userId, action)
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
      await ChatroomController.addOrRemoveUser(chatroomId, userId, action)
    } catch (error) {
      expectError(error, `Unknown action ${action}`)
    }
  })
})

describe('Testing message methods', () => {
  it('Test feature: insert message', async () => {
    const user = await seedUser()
    let chatroom = await seedChatroom()
    const message = 'EHE TE NANDAYO ?!'
    serverSocket.userId = user._id
    serverSocket.join(chatroom._id)

    let messages = await Message.find({})
    expect(messages).toHaveLength(0)
    expect(chatroom.messages).toHaveLength(0)

    await MessageController.insert(serverSocket, chatroom._id, message)

    messages = await Message.find({})
    expect(messages).toHaveLength(1)
    expect(messages[0].message).toBe(message)
    expect(messages[0].user).toEqual(user._id)

    chatroom = await Chatroom.findById(chatroom._id)
    expect(chatroom.messages).toHaveLength(1)
    expect(chatroom.messages[0]).toEqual(messages[0]._id)
  })

  it('Test error: message insertion error if no user/chat', async () => {
    let userId = null
    let chatroomId = null
    const message = 'EHE TE NANDAYO ?!'
    serverSocket.userId = userId
    try {
      await MessageController.insert(serverSocket, chatroomId, message)
    } catch (error) {
      expectError(
        error,
        `No user found for id ${userId}`,
        StatusCodes.NOT_FOUND
      )
    }

    const user = await seedUser()
    userId = user._id
    serverSocket.userId = userId
    try {
      await MessageController.insert(serverSocket, chatroomId, message)
    } catch (error) {
      expectError(
        error,
        `No chat found for id ${chatroomId}`,
        StatusCodes.NOT_FOUND
      )
    }
  })
})
