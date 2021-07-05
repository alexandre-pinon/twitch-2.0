import { StatusCodes } from 'http-status-codes'

import * as ChatroomController from '../controllers/ChatroomController.js'
import * as MessageController from '../controllers/MessageController.js'
import setupTest, { clientSocket, io, serverSocket } from './setup.js'
import Message from '../models/Message.js'
import User from '../models/User.js'
import Chatroom from '../models/Chatroom.js'
import { seedChatroom, seedUser } from './seed.js'
import { expectError, socketPromise } from './utils.js'
import { handleJoinRoom, handleLeaveRoom } from '../socket/io.js'

setupTest('socket-testing', true)

describe('Testing socket events', () => {
  it('Test join & leave room', async () => {
    const user = await seedUser()
    let chatroom = await seedChatroom()
    serverSocket.userId = user._id

    expect(serverSocket.rooms.size).toBe(1)
    expect(chatroom.users).toHaveLength(0)

    const joinRoomPromise = async () => {
      return new Promise((resolve, reject) => {
        serverSocket.on('join room', async (chatroomId) => {
          await handleJoinRoom(serverSocket, chatroomId)
          chatroom = await Chatroom.findById(chatroomId)

          expect(serverSocket.rooms.size).toBe(2)
          expect(chatroom.users).toHaveLength(1)
          expect(chatroom.users[0]).toEqual(user._id)

          resolve()
        })
      })
    }

    clientSocket.emit('join room', chatroom._id)
    await joinRoomPromise()

    const leaveRoomPromise = async () => {
      return new Promise((resolve, reject) => {
        serverSocket.on('leave room', async (chatroomId) => {
          await handleLeaveRoom(serverSocket, chatroomId)
          chatroom = await Chatroom.findById(chatroomId)

          expect(serverSocket.rooms.size).toBe(1)
          expect(chatroom.users).toHaveLength(0)

          resolve()
        })
      })
    }

    clientSocket.emit('leave room', chatroom._id)
    await leaveRoomPromise()
  })
})
