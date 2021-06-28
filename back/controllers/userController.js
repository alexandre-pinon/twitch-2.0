import jwt from 'jwt-then'
import { sha256 } from 'js-sha256'
import { StatusCodes } from 'http-status-codes'

import User from '../models/User.js'
import AppError from '../errors/AppError.js'

export const register = async (request, response) => {
  const { username, email, password, description, avatar } = request.body
  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com|outlook.fr/

  if (!username) {
    throw new AppError('Username is required.')
  }
  if (!emailRegex.test(email)) {
    throw new AppError('Email is not supported from your domain.')
  }
  if (password.length < 6) {
    throw new AppError('Password must be atleast 6 characters long.')
  }

  const userExists = await User.findOne({
    email,
  })

  if (userExists) {
    throw new AppError(
      'User with same email already exists.',
      StatusCodes.CONFLICT
    )
  }

  await new User({
    username,
    email,
    password: sha256(password + process.env.SALT),
    description,
    avatar,
  }).save()

  response.status(StatusCodes.CREATED).json({
    message: `User ${username} registered successfully!`,
  })
}

export const login = async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({
    username,
    password: sha256(password + process.env.SALT),
  })
  if (!user) {
    throw new AppError('Username and Password did not match')
  }

  const token = await jwt.sign({ id: user.id }, process.env.SECRET)

  response.json({
    message: 'User logged in successfully!',
    token,
  })
}
