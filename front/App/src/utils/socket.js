import { useState, useEffect } from 'react'
import io from 'socket.io-client'

export const useSocket = (token) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (token) {
      const newSocket = io(
        `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}`,
        { auth: { token } }
      )

      newSocket.on('disconnect', () => {
        console.log('Socket Disconnected!')
        setSocket(null)
      })

      newSocket.on('connect', () => {
        console.log('Socket Connected!')
        setSocket(newSocket)
      })
    }
  }, [token])

  return socket
}
