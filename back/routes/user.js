import express from 'express'

import { login, register } from '../controllers/UserController.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const userRouter = express.Router()
userRouter.post('/login', catchAsync(login))
userRouter.post('/register', catchAsync(register))

export default userRouter
