import express from 'express'
import cors from 'cors'

import * as ErrorHandler from './errors/ErrorHandler.js'
import userRouter from './routes/user.js'
import chatroomRouter from './routes/chatroom.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', userRouter)
app.use('/chatroom', chatroomRouter)

app.use(ErrorHandler.notFound)
app.use(ErrorHandler.mongooseErrors)

export default app
