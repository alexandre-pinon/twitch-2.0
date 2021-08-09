import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import Client from 'socket.io-client'

import app from '../app'

dotenv.config({ path: '.back.env' })
mongoose.promise = global.Promise

export let io, serverSocket, secondServerSocket, clientSocket, secondClientSocket

export default (databaseName, withSocket = false) => {
  // Connect to Mongoose
  beforeAll(async () => {
    const url = `${process.env.NODE_TEST}${databaseName}?retryWrites=true&w=majority`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    if (withSocket) {
      const socketSetup = await setupSocket(io, serverSocket, clientSocket)
      io = socketSetup.io
      serverSocket = socketSetup.serverSocket
      secondServerSocket = socketSetup.secondServerSocket
      clientSocket = socketSetup.clientSocket
      secondClientSocket = socketSetup.secondClientSocket
    }
  })

  // Cleans up database between each test
  afterEach(async () => {
    await removeAllCollections()
    if (withSocket) {
      serverSocket.removeAllListeners()
      leaveAllRooms(serverSocket)
      secondServerSocket.removeAllListeners()
      leaveAllRooms(secondServerSocket)
      clientSocket.removeAllListeners()
      secondClientSocket.removeAllListeners()
    }
  })

  // Disconnect Mongoose
  afterAll(async () => {
    await dropAllCollections()
    mongoose.connection.close()
    if (withSocket) {
      io.close()
      clientSocket.close()
      secondClientSocket.close()
    }
  })
}

const removeAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

const dropAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running')) return
      console.log(error.message)
    }
  }
}

const leaveAllRooms = (socket) => {
  socket.rooms.forEach((room) => {
    socket.leave(room)
  })
}

const setupSocket = async (io, serverSocket, clientSocket) => {
  return new Promise((resolve, reject) => {
    const server = app.listen()
    const frontOrigin = `${process.env.FRONT_ORIGIN}:${server.address().port}`
    io = new Server(server, {
      cors: {
        origin: frontOrigin,
      },
    })
    clientSocket = new Client(frontOrigin)
    io.on('connection', () => {
      if (io.sockets.sockets.size === 2) {
        const socketsIterator = io.sockets.sockets.values()
        serverSocket = socketsIterator.next().value
        secondServerSocket = socketsIterator.next().value
      }
    })
    clientSocket.on('connect', () => {
      secondClientSocket = new Client(frontOrigin)
      secondClientSocket.on('connect', () => {
        resolve({
          io,
          serverSocket,
          secondServerSocket,
          clientSocket,
          secondClientSocket,
        })
      })
    })
  })
}
