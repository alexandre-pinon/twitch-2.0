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

const authRoutes = { login: '/login', register: '/register' }

const App = () => {
  const [token, setToken] = useState(null)
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

  useEffect(() => {
    checkUserToken()
  }, [location])

  return (
    <div className="App">
      <header>
        <Example />
      </header>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/studio/:streamerName" render={() => <Studio socket={socket} />} />
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
      </Switch>
    </div>
  )
}

export default App
