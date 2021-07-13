import React from 'react'
import { ReactFlvPlayer } from 'react-flv-player'

const HomePage = () => {
  return (
	<div>
	//   <h3>{Axios get USERNAME}</h3>
	//   <ReactFlvPlayer
        // url="http://192.168.1.196:8000/live/{Axios get STREAMKEY}.flv"
        // heigh="800px"
        // width="800px"
        // isMuted={false}
	//   />
	  <h3>Gopnik</h3>
	  <ReactFlvPlayer
        url="http://192.168.1.196:8000/live/Gopnik.flv"
        heigh="800px"
        width="800px"
        isMuted={false}
	  />
	  <h3>Horse</h3>
	  <ReactFlvPlayer
        url="http://192.168.1.196:8000/live/Horse.flv"
        heigh="800px"
        width="800px"
        isMuted={false}
      />
    </div>
  )
}

export default HomePage
