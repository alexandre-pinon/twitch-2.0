import express from 'express'

import {
  activate2FA,
  login,
  register,
  register2FA,
} from '../controllers/UserController.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const userRouter = express.Router()
userRouter.post('/login', catchAsync(login))
userRouter.post('/register', catchAsync(register))
userRouter.post('/register2FA', catchAsync(register2FA))
userRouter.post('/activate2FA', catchAsync(activate2FA))

export default userRouter
