import React, { useEffect, useState } from 'react'
import './App.css'
import Example from './components/header'
import { Switch, Route, useLocation, useHistory } from 'react-router-dom'
import { useSocket } from './utils/socket'
import Home from './components/homepage'
import Studio from './components/studio'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ListFollowers from './components/listFollowers'
import ListFollowings from './components/listFollowing'
import Profile from './components/profile'
import Settings from './components/settings'
import SettingsProfil from './components/settings/profil'
import Background from './components/settings/background'
import FaAuth from "./components/settings/fa";
import axios from 'axios'

import Games from './components/twitchAPI/Games'
import GameStreams from './components/twitchAPI/GameStreams'
import Stream from './components/twitchAPI/Streams'
import TwitchHeader from './components/twitchAPI/TwitchHeader'
import "./styles.css";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from './Checkout'

const stripePromise = loadStripe("pk_test_51JTNiMImTwtbqWJ6M7C6BxnpYdpZBvlgJBBsrwaEeOE0cErTbb53jX0YW8P4c76Nkx5kmd1rbX6HvDuSC9EX8bb700K8MDACch");
const authRoutes = { login: '/login', register: '/register' }

const App = () => {
  const [token, setToken] = useState(null)
  const [loggedUser, setLoggedUser] = useState(null)
  const socket = useSocket(token)
  const history = useHistory()
  const location = useLocation()

  const checkUserToken = () => {
    const sessionToken = sessionStorage.getItem('TOKEN')
    if (sessionToken) {
      setToken(sessionToken)
    } else if (!Object.values(authRoutes).includes(location.pathname)) {
      history.push(authRoutes.login)
    }
  }

  const getLoggedInUser = async () => {
    try {
      const url = `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/get`
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get(url, config)
      console.log(response.data)
      setLoggedUser(response.data.user)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkUserToken()
  }, [location])

  useEffect(() => {
    if (token) getLoggedInUser()
  }, [token])

  return (
    <div className="App">
      <header>
        <Example loggedUser={loggedUser}/>
      </header>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/studio/:streamerName" render={() => <Studio socket={socket} loggedUser={loggedUser}/>} />
        {/* START: Authentification Routes */}
        <Route path={authRoutes.login} component={Login} />
        <Route path={authRoutes.register} component={Register} />
        {/* END: Authentification Routes */}
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
        <Route exact path="/settings/background">
          <Background />
        </Route>
        <Route exact path="/settings/faauth">
          <FaAuth loggedUser={loggedUser}/>
        </Route>

        <Route exact path="/payment">
          <Elements stripe={stripePromise}>
            <Checkout />
          </Elements>
        </Route>

        <div className="App container-fluid">
        <TwitchHeader />
        <Route exact path="/twitch-api" component={Games} />
        <Route exact path="/top-streams" component={Stream} />
        <Route exact path="/game/:id" component={GameStreams} />
        
        </div>
      </Switch>
    </div>
  )
}

export default App
