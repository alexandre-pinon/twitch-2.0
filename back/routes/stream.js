import express from 'express'

import {
  getAllLiveStreams,
  getOneStream,
  insertStream,
  removeStream,
} from '../controllers/StreamController.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const streamRouter = express.Router()
streamRouter.get('/get', catchAsync(getAllLiveStreams))
streamRouter.get('/get/:streamId', catchAsync(getOneStream))
streamRouter.get('/get/key/:streamKey', catchAsync(getOneStream))
streamRouter.post('/insert', catchAsync(insertStream))
streamRouter.delete('/remove/:streamId', catchAsync(removeStream))
streamRouter.delete('/remove/key/:streamKey', catchAsync(removeStream))

export default streamRouter
