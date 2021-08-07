import { StatusCodes } from 'http-status-codes'
import Stream from '../models/Stream'

export const getAllStreams = async (request, response) => {
  const streams = await getStreams({})
  streams.length
    ? response.json({ streams })
    : response.status(StatusCodes.NOT_FOUND).json({ streams })
}

export const getStreams = async (params, populateUsers = null) => {
  const query = Object.fromEntries(
    Object.entries(params).filter(([key, value]) =>
      Object.keys(Stream.schema.tree).includes(key)
    )
  )
  if (populateUsers) {
    if (!Object.keys(Stream.schema.tree).includes(populateUsers)) {
      throw new AppError(`Unknown field ${populateUsers}`)
    }
    return await Stream.find(query).populate({
      path: populateUsers,
      model: 'User',
    })
  }

  return await Stream.find(query)
}
