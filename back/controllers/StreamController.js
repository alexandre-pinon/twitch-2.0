import { StatusCodes } from 'http-status-codes'
import Stream from '../models/Stream'

export const getAllLiveStreams = async (request, response) => {
  const streams = await getStreams({ live: true })
  streams.length
    ? response.json({ streams })
    : response.status(StatusCodes.NOT_FOUND).json({ streams })
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
