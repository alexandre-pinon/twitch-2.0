import { StatusCodes } from 'http-status-codes'

import AppError from '../errors/AppError'
import Chatroom from '../models/Chatroom'
import Stream from '../models/Stream'
import User from '../models/User'

export const getAllLiveStreams = async (request, response) => {
  const streams = await getStreams({ live: true })
  streams.length
    ? response.json({ streams })
    : response.status(StatusCodes.NOT_FOUND).json({ streams })
}

export const insertStream = async (request, response) => {
  const { streamKey, type, tags, gameTitle, title, description } = request.body
  const streamer = await User.findOne({ streamKey })
  if (!streamer)
    throw new AppError(
      `No user found for streamKey ${streamKey}`,
      StatusCodes.NOT_FOUND
    )

  const chatroom = await new Chatroom({ users: [streamer] }).save()
  const stream = await new Stream({
    streamer,
    chatroom,
    type,
    tags,
    gameTitle,
    title,
    description,
  }).save()

  response
    .status(StatusCodes.CREATED)
    .json({ message: `Stream ${stream._id} created` })
}

export const getStreams = async (params, populateAll = null) => {
  const query = Object.fromEntries(
    Object.entries(params).filter(([key, value]) =>
      Object.keys(Stream.schema.tree).includes(key)
    )
  )
  if (populateAll)
    return await Stream.find(query)
      .populate({
        path: 'streamer',
        model: 'User',
      })
      .populate({
        path: 'chatroom',
        model: 'Chatroom',
        populate: {
          path: 'users',
          model: 'User',
        },
      })

  return await Stream.find(query)
}
