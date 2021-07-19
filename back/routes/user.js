import express from 'express'

import { login, register, register2FA } from '../controllers/UserController.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const userRouter = express.Router()
userRouter.post('/login', catchAsync(login))
userRouter.post('/register', catchAsync(register))
userRouter.post('/register2FA', catchAsync(register2FA))

export default userRouter
