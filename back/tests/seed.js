import { sha256 } from 'js-sha256'

import User from '../models/User'

export const seedUser = async () => {
  const testUser1 = await new User({
    username: 'testUser1',
    email: 'testUser1@gmail.com',
    password: sha256('password1' + process.env.SALT),
    description: `I'm the test user number 1!`,
    avatar: null,
  }).save()
  return testUser1._id
}
