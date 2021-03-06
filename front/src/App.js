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
import ListSubscribers from './components/listSubscribers'
import Profile from './components/profile'
import Settings from './components/settings'
import SettingsProfil from './components/settings/profile'
import Background from './components/settings/background'
import FaAuth from './components/settings/fa'
import ChatPrivate from './components/chatPrivate'

import axios from 'axios'

import Games from './components/twitchAPI/Games'
import GameStreams from './components/twitchAPI/GameStreams'
import Stream from './components/twitchAPI/Streams'
import TwitchHeader from './components/twitchAPI/TwitchHeader'
import './styles.css'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Checkout from './Checkout'

const stripePromise = loadStripe(
  'pk_test_51JTNiMImTwtbqWJ6M7C6BxnpYdpZBvlgJBBsrwaEeOE0cErTbb53jX0YW8P4c76Nkx5kmd1rbX6HvDuSC9EX8bb700K8MDACch'
)
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
      {loggedUser ? (
        <header>
          <Example loggedUser={loggedUser} />
        </header>
      ) : (
        <div></div>
      )}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/studio/:streamerName" render={() => <Studio socket={socket} loggedUser={loggedUser} />} />
        {/* START: Authentification Routes */}
        <Route path={authRoutes.login} component={Login} />
        <Route path={authRoutes.register} component={Register} />
        {/* END: Authentification Routes */}
        <Route exact path="/followers/:streamerName" component={ListFollowers} />
        <Route exact path="/subscribers/:streamerName" component={ListSubscribers} />
        <Route exact path="/followings/:streamerName" component={ListFollowings} />
        <Route exact path="/profile/:streamerName" render={() => <Profile loggedUser={loggedUser} />} />
        <Route exact path="/settings">
          <Settings />
        </Route>
        <Route exact path="/settings/profile">
          <SettingsProfil loggedUser={loggedUser} />
        </Route>
        <Route exact path="/settings/background">
          <Background />
        </Route>
        <Route exact path="/settings/faauth">
          <FaAuth loggedUser={loggedUser} />
        </Route>

        <Route
          exact
          path="/payment/:streamerName"
          render={() => (
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          )}
        />

        <Route exact path="/twitch-api" component={Games} />
        <Route exact path="/top-streams" component={Stream} />
        <Route exact path="/game/:id" component={GameStreams} />

        {/*
        <div className="App container-fluid">
          <TwitchHeader />
          <Route exact path="/twitch-api" component={Games} />
          <Route exact path="/top-streams" component={Stream} />
          <Route exact path="/game/:id" component={GameStreams} />
        </div>
        */}
      </Switch>
      {/* <ChatPrivate /> */}
    </div>
  )
}

export default App
