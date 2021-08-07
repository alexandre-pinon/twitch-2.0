import express from 'express'

import {
  getAllLiveStreams,
  insertStream,
} from '../controllers/StreamController.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const streamRouter = express.Router()
streamRouter.get('/get', catchAsync(getAllLiveStreams))
streamRouter.post('/insert', catchAsync(insertStream))

export default streamRouter
