import { useState, useEffect } from 'react'
import io from 'socket.io-client'

export const useSocket = (token) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:8001', { auth: { token } })

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
