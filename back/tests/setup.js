import mongoose from 'mongoose'
import dotenv from 'dotenv'

import { seedUser } from './seed'

dotenv.config({ path: '.back.env' })
mongoose.promise = global.Promise

export default (databaseName) => {
  // Connect to Mongoose
  beforeAll(async () => {
    const url = `${process.env.NODE_TEST}${databaseName}?retryWrites=true&w=majority`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  })

  // Cleans up database between each test
  afterEach(async () => {
    await removeAllCollections()
  })

  // Disconnect Mongoose
  afterAll(async () => {
    await dropAllCollections()
    await mongoose.connection.close()
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
      if (error.message.includes('a background operation is currently running'))
        return
      console.log(error.message)
    }
  }
}
