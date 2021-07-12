import React, { useEffect, useState } from 'react'
import './App.css'
import Example from './components/header'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/homepage'
import Studio from './components/studio'
import { useSocket } from './utils/socket'
import axios from 'axios'
import ListFollowers from "./components/listFollowers";
import ListFollowings from "./components/listFollowing";
import Profile from "./components/profile";
import Settings from "./components/settings";
import SettingsProfil from "./components/settings/profil";


function App() {
  const [token, setToken] = useState(null)
  const socket = useSocket(token)

  const temporaryLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/login`,
        { username: 'admin', password: 'password' }
      )
      setToken(response.data.token)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    temporaryLogin()
  }, [])

  return (
    <div className="App">
      <header>
        <Example />
      </header>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/studio">
            <Studio socket={socket}/>
          </Route>
          <Route exact path="/followings">
            <ListFollowings />
          </Route>
          <Route exact path="/followers">
            <ListFollowers />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route exact path="/settings/profil">
            <SettingsProfil />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
