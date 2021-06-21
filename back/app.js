import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.js'
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

export default app
