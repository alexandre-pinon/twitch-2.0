import express from 'express'

import * as StreamController from '../controllers/StreamController.js'
import auth from '../middleware/auth.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const streamRouter = express.Router()
streamRouter.get('/get', catchAsync(StreamController.getAllLiveStreams))
streamRouter.get('/get/:streamId', catchAsync(StreamController.getOneStream))
streamRouter.get('/get/key/:streamKey', catchAsync(StreamController.getOneStream))

streamRouter.post('/insert', catchAsync(auth), catchAsync(StreamController.insertStream))

streamRouter.delete('/remove/:streamId', catchAsync(auth), catchAsync(StreamController.removeStream))
streamRouter.delete('/remove/key/:streamKey', catchAsync(auth), catchAsync(StreamController.removeStream))

export default streamRouter
