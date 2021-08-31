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

export const getUserFollowsAndSubs = async (request, response) => {
  const { username } = request.params

  const user = await User.findOne({ username }).populate([
    {
      path: 'followers',
      model: 'User',
    },
    {
      path: 'subscribers',
      model: 'User',
    },
    {
      path: 'followings',
      model: 'User',
    },
    {
      path: 'subscribings',
      model: 'User',
    },
  ])
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

  const hash = crypto.randomBytes(16).toString('hex')
  const secret = base32.encode(hash).toString()
  user.hash2FA = secret
  await user.save()

  response.json({
    hash2FA: secret,
    message: `Successfully added hash for 2FA`,
  })
}

export const activate2FA = async (request, response) => {
  const { userId, accessKey } = request.body
  const user = await User.findById(userId)
  if (!user) throw new AppError('Invalid token')
  if (user.active2FA) throw new AppError('2FA is already active')

  const validKey = notp.totp.verify(accessKey, base32.decode(user.hash2FA).toString())
  if (!validKey) throw new AppError('Invalid access key')

  user.active2FA = true
  await user.save()

  response.json({
    message: `Successfully activated 2FA`,
  })
}

export const check2FA = async (request, response) => {
  const { username, accessKey } = request.body
  const user = await User.findOne({ username })
  if (!user) throw new AppError('Invalid username')

  const validKey = notp.totp.verify(accessKey, base32.decode(user.hash2FA).toString())
  if (!validKey) throw new AppError('Invalid access key')

  const token = await jwt.sign({ id: user._id }, process.env.SECRET)

  response.json({
    message: 'User logged in successfully',
    token,
  })
}

export const login = async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({
    username,
    password: sha256(password + process.env.SALT),
  })
  if (!user) throw new AppError('Username and Password did not match')

  if (user.active2FA) {
    response.json({ active2FA: user.active2FA })
    return
  }

  const token = await jwt.sign({ id: user._id }, process.env.SECRET)

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
        user.is_subscribed = true
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

export const userHasSubscribed = async (request, response) => {
  const user = await User.findById(request.body.userId)
  if (!user) throw new AppError('Invalid token')
  if (user.is_subscribed) throw new AppError('User is already subscribed')

  user.is_subscribed = true
  await user.save()

  response.json({
    message: 'This user is now subscribed',
  })
}

export const update = async (request, response) => {
  const { userId, username, email, description } = request.body

  const user = await User.findById(userId)
  if (!user) throw new AppError('Invalid token')

  user.username = username || user.username
  user.email = email || user.email
  user.description = description || user.description

  await user.save()

  response.json({
    message: 'User updated successfully',
  })
}
