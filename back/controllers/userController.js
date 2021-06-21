const mongoose = require('mongoose')
const User = mongoose.model('User')
const sha256 = require('js-sha256')
const jwt = require('jwt-then')

exports.register = async (request, response) => {
  const { username, email, password, description, avatar } = request.body
  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com|outlook.fr/

  if (!username) {
    throw 'Username is required.'
  }
  if (!emailRegex.test(email)) {
    throw 'Email is not supported from your domain.'
  }
  if (password.length < 6) {
    throw 'Password must be atleast 6 characters long.'
  }

  const userExists = await User.findOne({
    email,
  })

  if (userExists) {
    throw 'User with same email already exists.'
  }

  const user = new User({
    username,
    email,
    password: sha256(password + process.env.SALT),
    description,
    avatar,
  })

  await user.save()

  response.json({
    message: `User ${username} registered successfully!`,
  })
}

exports.login = async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({
    username,
    password: sha256(password + process.env.SALT),
  })

  if (!user) {
    throw 'Username and Password did not match'
  }

  const token = await jwt.sign({ id: user.id }, process.env.SECRET)

  response.json({
    message: 'User logged in successfully!',
    token,
  })
}
