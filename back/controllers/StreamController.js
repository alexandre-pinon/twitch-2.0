import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'

import AppError from '../errors/AppError.js'
import Chatroom from '../models/Chatroom.js'
import Message from '../models/Message.js'
import Stream from '../models/Stream.js'
import User from '../models/User.js'

export const getAllLiveStreams = async (request, response) => {
  const streams = await getStreams({ live: true })
  if (!streams.length) throw new AppError(`No stream found`, StatusCodes.NOT_FOUND)

  response.json({ streams })
}

export const getOneStream = async (request, response) => {
  const { streamId, streamKey } = request.params
  const stream = await getStreamByIdOrKey(streamId, streamKey)

  response.json({ stream })
}

export const insertStream = async (request, response) => {
  const { live, streamKey, type, tags, gameTitle, title, description } = request.body
  const streamer = await User.findOne({ streamKey })
  if (!streamer) throw new AppError(`No user found for streamKey ${streamKey}`, StatusCodes.NOT_FOUND)
  const chatroom = streamer.streamChat
  if (!chatroom) throw new AppError(`No chat found for this user`, StatusCodes.NOT_FOUND)

  const stream = await new Stream({
    streamer,
    chatroom,
    live,
    type,
    tags,
    gameTitle,
    title,
    description,
  }).save()

  response.status(StatusCodes.CREATED).json({ message: `Stream ${stream._id} created` })
}

export const removeStream = async (request, response) => {
  const { streamId, streamKey } = request.params
  const stream = await getStreamByIdOrKey(streamId, streamKey)
  await stream.deleteOne()
  // const chatroom = await Chatroom.findById(stream.chatroom)

  // for (const messageId of chatroom.messages) {
  //   await Message.findByIdAndDelete(messageId)
  // }
  // await Promise.all([chatroom.deleteOne(), stream.deleteOne()])

  response.json({
    message: `Stream ${stream._id} deleted!`,
  })
}

export const getStreams = async (params, populateAll = null) => {
  const query = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => Object.keys(Stream.schema.tree).includes(key))
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

export const getStreamByIdOrKey = async (streamId, streamKey) => {
  let stream

  if (streamId instanceof mongoose.Types.ObjectId) {
    stream = await Stream.findById(streamId)
  } else if (streamKey) {
    const streamer = await User.findOne({ streamKey })
    if (!streamer) throw new AppError(`No user found for streamKey ${streamKey}`, StatusCodes.NOT_FOUND)
    stream = await Stream.findOne({ live: true, streamer })
  }

  if (!stream) throw new AppError(`No stream found for id ${streamId}`, StatusCodes.NOT_FOUND)

  return stream
}
