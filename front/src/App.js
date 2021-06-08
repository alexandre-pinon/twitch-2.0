import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";
import { ReactFlvPlayer } from "react-flv-player";

const App = () => {
  return (
    <div>
      <ReactFlvPlayer
        url="http://10.41.174.148:8000/live/TESTO.flv"
        heigh="800px"
        width="800px"
        isMuted={false}
      />
      <ReactFlvPlayer
        url="http://10.41.174.148:8000/live/POULE.flv"
        heigh="800px"
        width="800px"
        isMuted={false}
      />
    </div>
  );
};

export default App;
