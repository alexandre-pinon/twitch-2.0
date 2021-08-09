import express from 'express'

import * as ChatroomController from '../controllers/ChatroomController.js'
import auth from '../middleware/auth.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const chatroomRouter = express.Router()
chatroomRouter.post('/create', catchAsync(auth), catchAsync(ChatroomController.createAjax))

export default chatroomRouter
