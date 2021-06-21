require('dotenv').config({ path: '.back.env' })
const mongoose = require('mongoose')

mongoose.connect(process.env.NODE_STAGING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('MongoDB Connected!')
})

require('./models/User')

const app = require('./app')
const port = process.env.NODE_PORT || 8000
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
