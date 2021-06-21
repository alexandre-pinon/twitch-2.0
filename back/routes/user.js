import { Router } from 'express'
import { login, register } from '../controllers/userController'

Router.post('/login', login)
Router.post('/register', register)

export default Router
