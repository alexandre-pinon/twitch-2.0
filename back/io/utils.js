export const authenticateUser = async (socket, next) => {
  const token = socket.handshake.auth.token
  const payload = await jwt.verify(token, process.env.SECRET)
  socket.userId = payload.id
  console.log({ payload })
  next()
}
