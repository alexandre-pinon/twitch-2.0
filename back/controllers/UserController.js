import jwt from 'jwt-then'
import { sha256 } from 'js-sha256'
import { StatusCodes } from 'http-status-codes'
import base32 from 'thirty-two'
import crypto from 'crypto'
import notp from 'notp'

import User from '../models/User.js'
import Chatroom from '../models/Chatroom.js'
import AppError from '../errors/AppError.js'

export const getById = async (request, response) => {
  const { userId } = request.body

  const user = await User.findById(userId).populate('followings', 'username')
  if (!user) throw new AppError(`No user found for username ${username}`, StatusCodes.NOT_FOUND)

  response.json({
    user,
  })
}

export const getByUsername = async (request, response) => {
  const { username } = request.params

  const user = await User.findOne({ username }).populate({
    path: 'streamChat',
    model: 'Chatroom',
    populate: {
      path: 'messages',
      model: 'Message',
      populate: {
        path: 'user',
        model: 'User',
      },
    },
  })
  if (!user) throw new AppError(`No user found for username ${username}`, StatusCodes.NOT_FOUND)

  response.json({
    user,
  })
}

export const getStreamers = async (request, response) => {
  const { nb } = request.params

  const streamers = await User.where('streamKey').ne(null).limit(parseInt(nb))
  if (!streamers.length) throw new AppError('No streamers found', StatusCodes.NOT_FOUND)

  response.json({ streamers })
}

export const register = async (request, response) => {
  const { username, email, password, streamKey } = request.body
  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com|outlook.fr/

  if (!username) throw new AppError('Username is required')
  if (!emailRegex.test(email)) throw new AppError('Email is not supported from your domain')
  if (password.length < 6) throw new AppError('Password must be atleast 6 characters long')

  const userExistsEmail = User.findOne({ email })
  const userExistsUsername = User.findOne({ username })
  const userExists = await Promise.all([userExistsEmail, userExistsUsername])

  if (userExists[0]) throw new AppError('User with same email already exists', StatusCodes.CONFLICT)
  if (userExists[1]) throw new AppError('User with same username already exists', StatusCodes.CONFLICT)

  console.log({ username, email, password, streamKey })
  await new User({
    username,
    email,
    password: sha256(password + process.env.SALT),
    streamKey,
  }).save()

  response.status(StatusCodes.CREATED).json({
    message: `User ${username} registered successfully`,
  })
}

export const registerStreamKey = async (request, response) => {
  const user = await User.findById(request.body.userId)
  if (!user) throw new AppError('Invalid token')

  const chatroom = await new Chatroom({ users: [user] }).save()
  const streamKey = crypto.randomBytes(16).toString('hex')

  user.streamKey = streamKey
  user.streamChat = chatroom

  await user.save()

  response.json({
    streamKey,
    message: `Successfully generated stream key, don't share it with anyone!`,
  })
}

export const register2FA = async (request, response) => {
  const user = await User.findById(request.body.userId)
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
  const { userId, accessKey } = request.body
  const user = await User.findById(userId)
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
    Object.entries(params).filter(([key, value]) => Object.keys(User.schema.tree).includes(key))
  )
  return await User.findOne(query)
}

export const addOrRemoveUser = async (streamerName, userId, action) => {
  const userPromise = User.findById(userId)
  const streamerPromise = User.findOne({ username: streamerName })
  const [user, streamer] = await Promise.all([userPromise, streamerPromise])

  if (!user) throw new AppError(`No user found for id ${userId}`, StatusCodes.NOT_FOUND)
  if (!streamer) throw new AppError(`No streamer found for username ${streamerName}`, StatusCodes.NOT_FOUND)

  let updateUsers = false
  switch (action) {
    case 'FOLLOW':
      if (!user.followings.includes(streamer._id) && !streamer.followers.includes(userId)) {
        user.followings.push(streamer._id)
        streamer.followers.push(userId)
        updateUsers = true
      }
      break
    case 'UNFOLLOW':
      if (user.followings.includes(streamer._id) && streamer.followers.includes(userId)) {
        user.followings.pull(streamer._id)
        streamer.followers.pull(userId)
        updateUsers = true
      }
      break
    case 'SUBSCRIBE':
      if (!user.subscribings.includes(streamer._id) && !streamer.subscribers.includes(userId)) {
        user.subscribings.push(streamer._id)
        streamer.subscribers.push(userId)
        updateUsers = true
      }
      break
    default:
      throw new AppError(`Unknown action ${action}`)
  }

  if (updateUsers) {
    await Promise.all([user.save(), streamer.save()])
  }
  return updateUsers
}

export const follow = async (request, response) => {
  const { streamerName, userId } = request.body
  const userWasUpdated = await addOrRemoveUser(streamerName, userId, 'FOLLOW')

  response.json({
    message: userWasUpdated ? `You are now following ${streamerName}` : `You were already following ${streamerName}`,
  })
}

export const unfollow = async (request, response) => {
  const { streamerName, userId } = request.body
  const userWasUpdated = await addOrRemoveUser(streamerName, userId, 'UNFOLLOW')

  response.json({
    message: userWasUpdated ? `You unfollowed ${streamerName}` : `You were not following ${streamerName}`,
  })
}

export const subscribe = async (request, response) => {
  const { streamerName, userId } = request.body
  const userWasUpdated = await addOrRemoveUser(streamerName, userId, 'SUBSCRIBE')

  response.json({
    message: userWasUpdated
      ? `You are now subscribed to ${streamerName}`
      : `You were already subscribed to ${streamerName}`,
  })
}
