import { sha256 } from 'js-sha256'

import Chatroom from '../models/Chatroom'
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
  user,
  banned_user = null,
  mods = null,
  priv = false
) => {
  const testChatroom1 = await new Chatroom({
    users: user instanceof User ? user : [],
    banned_users: banned_user instanceof User ? banned_user : [],
    mods: mods instanceof User ? mods : [],
    messages: [],
    private: priv,
  }).save()
  return testChatroom1
}
