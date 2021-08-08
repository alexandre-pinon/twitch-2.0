import { sha256 } from 'js-sha256'

import Chatroom from '../models/Chatroom'
import Message from '../models/Message'
import Stream from '../models/Stream'
import User from '../models/User'

export const seedUser = async (n = 1) => {
  let users = [],
    i = 1
  while (i <= n) {
    users.push(
      await new User({
        username: `testUser${i}`,
        email: `testUser${i}@gmail.com`,
        password: sha256(`password${i}` + process.env.SALT),
        description: `I'm the test user number ${i}!`,
        streamKey: `streamKey${i}`,
        avatar: null,
      }).save()
    )
    i++
  }
  return users.length === 1 ? users[0] : users
}

export const seedChatroom = async (users = [], banned_users = [], mods = [], priv = false) => {
  const testChatroom1 = await new Chatroom({
    users,
    banned_users,
    mods,
    messages: [],
    private: priv,
  }).save()
  return testChatroom1
}

export const seedMessage = async (n = 1, author = null, message = '') => {
  const user = author ? author : await seedUser()
  let messages = [],
    i = 1
  while (i <= n) {
    messages.push(
      await new Message({
        user,
        message: message ? message : `message n°${i}`,
      }).save()
    )
    i++
  }
  return messages.length === 1 ? messages[0] : messages
}

export const seedStream = async (user = null, chat = null) => {
  const streamer = user ? user : await seedUser()
  const chatroom = chat ? chat : await seedChatroom(streamer)
  const testStream1 = await new Stream({
    live: true,
    streamer,
    chatroom,
    title: `Stream n°1`,
  }).save()
  return testStream1
}
