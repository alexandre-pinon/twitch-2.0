import React from 'react'
import { ReactFlvPlayer } from 'react-flv-player'

const HomePage = () => {
  return (
    <div>
      <ReactFlvPlayer
        url="http://10.41.174.148:8000/live/TESTO.flv"
        heigh="800px"
        width="800px"
        isMuted={false}
      />
    </div>
  )
}

export default HomePage
