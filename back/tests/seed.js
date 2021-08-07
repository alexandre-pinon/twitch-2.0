import { sha256 } from 'js-sha256'

import Chatroom from '../models/Chatroom'
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
        avatar: null,
      }).save()
    )
    i++
  }
  return users.length === 1 ? users[0] : users
}

export const seedChatroom = async (
  users = [],
  banned_users = [],
  mods = [],
  priv = false
) => {
  const testChatroom1 = await new Chatroom({
    users,
    banned_users,
    mods,
    messages: [],
    private: priv,
  }).save()
  return testChatroom1
}

export const seedStream = async (user = null, viewers = []) => {
  const streamer = user ? user : await seedUser()
  const testStream1 = await new Stream({
    streamer,
    viewers,
    title: `Stream n°1`,
  }).save()
  return testStream1
}
