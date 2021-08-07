import express from 'express'

import { getAllLiveStreams } from '../controllers/StreamController.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const streamRouter = express.Router()
streamRouter.get('/get', catchAsync(getAllLiveStreams))

export default streamRouter
