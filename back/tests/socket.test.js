import setupTest, { clientSocket, io, serverSocket } from './setup.js'
import Message from '../models/Message.js'
import Chatroom from '../models/Chatroom.js'
import { seedChatroom, seedUser } from './seed.js'
import {
  handleChatMessage,
  handleJoinRoom,
  handleLeaveRoom,
} from '../socket/io.js'
import { catchAsyncSocket } from '../errors/ErrorHandler.js'
import { expectSocketError } from './utils.js'

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
        clientSocket.emit('join room', chatroom._id)
      })
    }

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
        clientSocket.emit('leave room', chatroom._id)
      })
    }

    await leaveRoomPromise()
  })

  it('Test chat message', async () => {
    const user = await seedUser()
    const testMessage = 'EHE TE NANDAYO ?!'
    let chatroom = await seedChatroom()
    serverSocket.userId = user._id
    //<!> chatroom._id !== (string) chatroomId <!>
    await handleJoinRoom(serverSocket, chatroom._id.toString())

    let messages = await Message.find({})
    expect(messages).toHaveLength(0)
    expect(chatroom.messages).toHaveLength(0)

    const chatMessagePromise = async () => {
      const clientPromise = new Promise((resolve, reject) => {
        clientSocket.on('chat message', ({ username, message }) => {
          expect(username).toBe(user.username)
          expect(message).toBe(testMessage)
          resolve()
        })
      })
      const serverPromise = new Promise((resolve, reject) => {
        serverSocket.on('chat message', async (chatroomId, message) => {
          await handleChatMessage(serverSocket, io, chatroomId, message)
          messages = await Message.find({})
          expect(messages).toHaveLength(1)
          expect(messages[0].message).toBe(message)
          expect(messages[0].user).toEqual(user._id)

          chatroom = await Chatroom.findById(chatroom._id)
          expect(chatroom.messages).toHaveLength(1)
          expect(chatroom.messages[0]).toEqual(messages[0]._id)
          resolve()
        })
      })
      clientSocket.emit('chat message', chatroom._id, testMessage)
      return Promise.all([serverPromise, clientPromise])
    }

    await chatMessagePromise()
  })

  it('Test empty chat message', async () => {
    const user = await seedUser()
    const testMessage = ''
    let chatroom = await seedChatroom()
    serverSocket.userId = user._id
    //<!> chatroom._id !== (string) chatroomId <!>
    await handleJoinRoom(serverSocket, chatroom._id.toString())

    const emptyMessagePromise = async () => {
      const clientPromise = new Promise((resolve, reject) => {
        clientSocket.on('server error', (error) => {
          expectSocketError(error, 'Message is empty')
          resolve()
        })
      })
      const serverPromise = new Promise((resolve, reject) => {
        serverSocket.on('chat message', async (chatroomId, message) => {
          catchAsyncSocket(handleChatMessage)(
            serverSocket,
            io,
            chatroomId,
            message
          )
          resolve()
        })
      })
      clientSocket.emit('chat message', chatroom._id, testMessage)
      return Promise.all([serverPromise, clientPromise])
    }

    await emptyMessagePromise()
  })
})
