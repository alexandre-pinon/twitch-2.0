import { sha256 } from 'js-sha256'

import Chatroom from '../models/Chatroom'
import User from '../models/User'

export const seedUser = async () => {
  const testUser1 = await new User({
    username: 'testUser1',
    email: 'testUser1@gmail.com',
    password: sha256('password1' + process.env.SALT),
    description: `I'm the test user number 1!`,
    avatar: null,
  }).save()
  return testUser1
}

export const seedChatroom = async (user, priv = false) => {
  const testChatroom1 = await new Chatroom({
    users: user instanceof User ? user : [],
    messages: [],
    private: priv,
  }).save()
  return testChatroom1
}
