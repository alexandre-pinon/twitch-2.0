import { StatusCodes } from 'http-status-codes'

import Message from '../models/Message.js'
import Chatroom from '../models/Chatroom.js'
import { seedChatroom, seedUser } from './seed.js'
import { catchAsyncSocket } from '../errors/ErrorHandler.js'
import { expectSocketError } from './utils.js'
import setupTest, {
  clientSocket,
  io,
  secondClientSocket,
  secondServerSocket,
  serverSocket,
} from './setup.js'
import {
  handleChatMessage,
  handleJoinRoom,
  handleLeaveRoom,
} from '../socket/io.js'

setupTest('socket-testing', true)

describe('Testing socket events', () => {
  it('Test events: join & leave room', async () => {
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

  it('Test event: chat message', async () => {
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

  it('Test error: empty chat message', async () => {
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
        serverSocket.on('chat message', (chatroomId, message) => {
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

describe('Testing commands', () => {
  it('Test command: whisper', async () => {
    const [user1, user2] = await seedUser(2)
    const commandMessage = `/w ${user2.username} `
    const stringMessage = 'HELLO'
    let chatroom = await seedChatroom()
    serverSocket.userId = user1._id
    //<!> chatroom._id !== (string) chatroomId <!>
    await handleJoinRoom(serverSocket, chatroom._id.toString())

    let messages = await Message.find({})
    expect(messages).toHaveLength(0)
    expect(chatroom.messages).toHaveLength(0)

    const privateMessagePromise = async () => {
      const clientPromise = new Promise((resolve, reject) => {
        clientSocket.on('chat message', ({ username, message }) => {
          expect(username).toBe(user1.username)
          expect(message).toBe(stringMessage)
          resolve()
        })
      })
      const serverPromise = new Promise((resolve, reject) => {
        serverSocket.on('chat message', async (chatroomId, message) => {
          await handleChatMessage(serverSocket, io, chatroomId, message)
          messages = await Message.find({})
          expect(messages).toHaveLength(1)
          expect(messages[0].message).toBe(stringMessage)
          expect(messages[0].user).toEqual(user1._id)

          chatroom = await Chatroom.findOne({
            users: [user1._id, user2._id],
            private: true,
          })
          expect(chatroom.messages).toHaveLength(1)
          expect(chatroom.messages[0]).toEqual(messages[0]._id)
          resolve()
        })
      })
      clientSocket.emit(
        'chat message',
        chatroom._id,
        commandMessage + stringMessage
      )
      return Promise.all([serverPromise, clientPromise])
    }

    await privateMessagePromise()
  })

  it('Test error: unknown command', async () => {
    const user = await seedUser()
    const commandMessage = `/blaargh`
    const chatroom = await seedChatroom()
    serverSocket.userId = user._id
    //<!> chatroom._id !== (string) chatroomId <!>
    await handleJoinRoom(serverSocket, chatroom._id.toString())

    const unknownCommandPromise = async () => {
      const clientPromise = new Promise((resolve, reject) => {
        clientSocket.on('server error', (error) => {
          expectSocketError(error, 'Unknown command')
          resolve()
        })
      })
      const serverPromise = new Promise((resolve, reject) => {
        serverSocket.on('chat message', (chatroomId, message) => {
          catchAsyncSocket(handleChatMessage)(
            serverSocket,
            io,
            chatroomId,
            message
          )
          resolve()
        })
      })
      clientSocket.emit('chat message', chatroom._id, commandMessage)
      return Promise.all([serverPromise, clientPromise])
    }
    await unknownCommandPromise()
  })

  it('Test error: message is empty on whisper', async () => {
    const [user1, user2] = await seedUser(2)
    const commandMessage = `/w ${user2.username}`
    const chatroom = await seedChatroom()
    serverSocket.userId = user1._id
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
        serverSocket.on('chat message', (chatroomId, message) => {
          catchAsyncSocket(handleChatMessage)(
            serverSocket,
            io,
            chatroomId,
            message
          )
          resolve()
        })
      })
      clientSocket.emit('chat message', chatroom._id, commandMessage)
      return Promise.all([serverPromise, clientPromise])
    }

    await emptyMessagePromise()
  })

  it('Test command: ban', async () => {
    const [user1, user2] = await seedUser(2)
    const commandMessage = `/ban ${user2.username}`
    const stringMessage = `${user2.username} was banned by ${user1.username}`
    let chatroom = await seedChatroom()
    const chatroomId = chatroom._id.toString()

    serverSocket.userId = user1._id
    secondServerSocket.userId = user2._id

    await handleJoinRoom(serverSocket, chatroomId)
    await handleJoinRoom(secondServerSocket, chatroomId)

    chatroom = await Chatroom.findById(chatroomId)
    expect(serverSocket.rooms.size).toBe(1)
    expect(secondServerSocket.rooms.size).toBe(1)
    expect(chatroom.users).toHaveLength(2)
    expect(chatroom.banned_users).toHaveLength(0)

    const banPromise = async () => {
      const clientPromise = new Promise((resolve, reject) => {
        clientSocket.on('chat message', ({ username, message }) => {
          expect(username).toBe(user1.username)
          expect(message).toBe(stringMessage)
          resolve()
        })
      })
      const serverPromise = new Promise((resolve, reject) => {
        serverSocket.on('chat message', async (chatroomId, message) => {
          await handleChatMessage(serverSocket, io, chatroomId, message)
          chatroom = await Chatroom.findById(chatroomId)

          expect(serverSocket.rooms.size).toBe(1)
          expect(secondServerSocket.rooms.size).toBe(0)
          expect(chatroom.users).toHaveLength(1)
          expect(chatroom.banned_users).toHaveLength(1)

          resolve()
        })
      })
      clientSocket.emit('chat message', chatroomId, commandMessage)
      return Promise.all([serverPromise, clientPromise])
    }

    await banPromise()
  })

  it('Test error: banned user chat message', async () => {
    const [user1, user2] = await seedUser(2)
    const chatroom = await seedChatroom(user1, user2)

    secondServerSocket.userId = user2._id
    secondServerSocket.join(chatroom._id.toString())

    const errorPromise = async () => {
      const clientPromise = new Promise((resolve, reject) => {
        secondClientSocket.on('server error', (error) => {
          expectSocketError(
            error,
            "You're banned from this chat!",
            StatusCodes.FORBIDDEN
          )
          resolve()
        })
      })
      const serverPromise = new Promise((resolve, reject) => {
        secondServerSocket.on('chat message', (chatroomId, message) => {
          catchAsyncSocket(handleChatMessage)(
            secondServerSocket,
            io,
            chatroomId,
            message
          )
          resolve()
        })
      })
      secondClientSocket.emit('chat message', chatroom._id, 'EHE TE NANDAYO ?!')
      return Promise.all([serverPromise, clientPromise])
    }

    await errorPromise()
  })

  it('Test error: incorrect syntax', async () => {
    const [user1, user2] = await seedUser(2)
    const commandMessage = `/ban ${user2.username} blaargh`
    const chatroom = await seedChatroom()

    serverSocket.userId = user1._id
    secondServerSocket.userId = user2._id

    const errorPromise = async () => {
      const clientPromise = new Promise((resolve, reject) => {
        clientSocket.on('server error', (error) => {
          expectSocketError(error, 'Invalid syntax')
          resolve()
        })
      })
      const serverPromise = new Promise((resolve, reject) => {
        serverSocket.on('chat message', (chatroomId, message) => {
          catchAsyncSocket(handleChatMessage)(
            serverSocket,
            io,
            chatroomId,
            message
          )
          resolve()
        })
      })
      clientSocket.emit('chat message', chatroom._id, commandMessage)
      return Promise.all([serverPromise, clientPromise])
    }

    await errorPromise()
  })

  it('Test command: unban', async () => {
    const [user1, user2] = await seedUser(2)
    const commandMessage = `/unban ${user2.username}`
    const stringMessage = `${user2.username} was unbanned by ${user1.username}`
    let chatroom = await seedChatroom(null, user2)
    const chatroomId = chatroom._id.toString()

    serverSocket.userId = user1._id
    secondServerSocket.userId = user2._id

    await handleJoinRoom(serverSocket, chatroomId)

    chatroom = await Chatroom.findById(chatroomId)
    expect(serverSocket.rooms.size).toBe(1)
    expect(secondServerSocket.rooms.size).toBe(0)
    expect(chatroom.users).toHaveLength(1)
    expect(chatroom.banned_users).toHaveLength(1)

    const unbanPromise = async () => {
      const clientPromise = new Promise((resolve, reject) => {
        clientSocket.on('chat message', ({ username, message }) => {
          expect(username).toBe(user1.username)
          expect(message).toBe(stringMessage)
          resolve()
        })
      })
      const serverPromise = new Promise((resolve, reject) => {
        serverSocket.on('chat message', async (chatroomId, message) => {
          await handleChatMessage(serverSocket, io, chatroomId, message)
          chatroom = await Chatroom.findById(chatroomId)

          expect(serverSocket.rooms.size).toBe(1)
          expect(secondServerSocket.rooms.size).toBe(1)
          expect(chatroom.users).toHaveLength(2)
          expect(chatroom.banned_users).toHaveLength(0)

          resolve()
        })
      })
      clientSocket.emit('chat message', chatroomId, commandMessage)
      return Promise.all([serverPromise, clientPromise])
    }

    await unbanPromise()
  })

  it('Test command: mod', async () => {
    const [user1, user2] = await seedUser(2)
    const commandMessage = `/mod ${user2.username}`
    let stringMessage = `${user2.username} was granted mod permissions by ${user1.username}`
    let chatroom = await seedChatroom()
    const chatroomId = chatroom._id.toString()

    serverSocket.userId = user1._id
    await handleJoinRoom(serverSocket, chatroomId)

    chatroom = await Chatroom.findById(chatroomId)
    expect(chatroom.mods).toHaveLength(0)

    const modPromise = async () => {
      const clientPromise = new Promise((resolve, reject) => {
        clientSocket.on('chat message', ({ username, message }) => {
          expect(username).toBe(user1.username)
          expect(message).toBe(stringMessage)
          resolve()
        })
      })
      const serverPromise = new Promise((resolve, reject) => {
        serverSocket.on('chat message', async (chatroomId, message) => {
          await handleChatMessage(serverSocket, io, chatroomId, message)
          chatroom = await Chatroom.findById(chatroomId)

          expect(chatroom.mods).toHaveLength(1)

          resolve()
        })
      })
      clientSocket.emit('chat message', chatroomId, commandMessage)
      return Promise.all([serverPromise, clientPromise])
    }

    await modPromise()

    stringMessage = `${user2.username} was alredy a mod`
    const secondModPromise = async () => {
      const secondClientPromise = new Promise((resolve, reject) => {
        clientSocket.on('chat message', ({ username, message }) => {
          expect(username).toBe(user1.username)
          expect(message).toBe(stringMessage)
          resolve()
        })
      })
      const secondServerPromise = new Promise((resolve, reject) => {
        serverSocket.on('chat message', async (chatroomId, message) => {
          await handleChatMessage(serverSocket, io, chatroomId, message)
          chatroom = await Chatroom.findById(chatroomId)

          expect(chatroom.mods).toHaveLength(1)

          resolve()
        })
      })
      clientSocket.emit('chat message', chatroomId, commandMessage)
      return Promise.all([secondServerPromise, secondClientPromise])
    }

    await secondModPromise()
  })

  it('Test command: unmod', async () => {
    const [user1, user2] = await seedUser(2)
    const commandMessage = `/unmod ${user2.username}`
    const stringMessage = `${user1.username} removed ${user2.username}'s mod permissions`
    let chatroom = await seedChatroom(null, null, user2)
    const chatroomId = chatroom._id.toString()

    serverSocket.userId = user1._id

    await handleJoinRoom(serverSocket, chatroomId)

    chatroom = await Chatroom.findById(chatroomId)
    expect(chatroom.mods).toHaveLength(1)

    const unmodPromise = async () => {
      const clientPromise = new Promise((resolve, reject) => {
        clientSocket.on('chat message', ({ username, message }) => {
          expect(username).toBe(user1.username)
          expect(message).toBe(stringMessage)
          resolve()
        })
      })
      const serverPromise = new Promise((resolve, reject) => {
        serverSocket.on('chat message', async (chatroomId, message) => {
          await handleChatMessage(serverSocket, io, chatroomId, message)
          chatroom = await Chatroom.findById(chatroomId)

          expect(chatroom.mods).toHaveLength(0)

          resolve()
        })
      })
      clientSocket.emit('chat message', chatroomId, commandMessage)
      return Promise.all([serverPromise, clientPromise])
    }

    await unmodPromise()
  })
})
