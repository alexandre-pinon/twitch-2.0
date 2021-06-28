import express from 'express'

import { createAjax } from '../controllers/ChatroomController.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const chatroomRouter = express.Router()
chatroomRouter.post('/create', catchAsync(createAjax))

export default chatroomRouter
