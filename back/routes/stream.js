import express from 'express'

import { getAllStreams } from '../controllers/StreamController.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const streamRouter = express.Router()
streamRouter.get('/get', catchAsync(getAllStreams))

export default streamRouter
