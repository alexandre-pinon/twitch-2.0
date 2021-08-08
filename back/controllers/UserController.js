import jwt from 'jwt-then'
import { sha256 } from 'js-sha256'
import { StatusCodes } from 'http-status-codes'
import base32 from 'thirty-two'
import crypto from 'crypto'
import notp from 'notp'

import User from '../models/User.js'
import AppError from '../errors/AppError.js'

export const register = async (request, response) => {
  const { username, email, password, description, avatar } = request.body
  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com|outlook.fr/

  if (!username) throw new AppError('Username is required')
  if (!emailRegex.test(email))
    throw new AppError('Email is not supported from your domain')
  if (password.length < 6)
    throw new AppError('Password must be atleast 6 characters long')

  const userExists = await User.findOne({
    email,
  })

  if (userExists)
    throw new AppError(
      'User with same email already exists',
      StatusCodes.CONFLICT
    )

  await new User({
    username,
    email,
    password: sha256(password + process.env.SALT),
    description,
    avatar,
  }).save()

  response.status(StatusCodes.CREATED).json({
    message: `User ${username} registered successfully`,
  })
}

export const register2FA = async (request, response) => {
  const payload = await jwt.verify(request.body.token, process.env.SECRET)
  const user = await User.findById(payload.id)
  if (!user) throw new AppError('Invalid token')
  if (user.hash2FA) throw new AppError('Already registered 2FA')

  let hash = crypto.randomBytes(16)
  hash = hash.toString('hex')
  user.hash2FA = hash
  await user.save()

  const secret = base32.encode(hash).toString()
  const otpuri = `otpauth://totp/${user.username}?secret=${secret}&issuer=${process.env.NODE_SERVERNAME}`

  response.json({
    otpuri,
    message: `Successfully added hash for 2FA`,
  })
}

export const activate2FA = async (request, response) => {
  const { token, accessKey } = request.body
  const payload = await jwt.verify(token, process.env.SECRET)
  const user = await User.findById(payload.id)
  if (!user) throw new AppError('Invalid token')
  if (user.active2FA) throw new AppError('2FA is already active')

  const validKey = notp.totp.verify(accessKey, user.hash2FA)
  if (!validKey) throw new AppError('Invalid access key')

  user.active2FA = true
  await user.save()

  response.json({
    message: `Successfully activated 2FA`,
  })
}

export const login = async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({
    username,
    password: sha256(password + process.env.SALT),
  })
  if (!user) throw new AppError('Username and Password did not match')

  const token = await jwt.sign({ id: user.id }, process.env.SECRET)

  response.json({
    message: 'User logged in successfully',
    token,
  })
}

export const getOneUser = async (params) => {
  const query = Object.fromEntries(
    Object.entries(params).filter(([key, value]) =>
      Object.keys(User.schema.tree).includes(key)
    )
  )
  return await User.findOne(query)
}
