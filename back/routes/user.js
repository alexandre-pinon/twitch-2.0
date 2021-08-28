import express from 'express'

import * as UserController from '../controllers/UserController.js'
import auth from '../middleware/auth.js'
import { catchAsync } from '../errors/ErrorHandler.js'

const userRouter = express.Router()

userRouter.get('/get/:username', catchAsync(auth), catchAsync(UserController.getByUsername))

userRouter.post('/login', catchAsync(UserController.login))
userRouter.post('/register', catchAsync(UserController.register))
userRouter.post('/registerStreamKey', catchAsync(auth), catchAsync(UserController.registerStreamKey))
userRouter.post('/register2FA', catchAsync(auth), catchAsync(UserController.register2FA))
userRouter.post('/activate2FA', catchAsync(auth), catchAsync(UserController.activate2FA))

export default userRouter
