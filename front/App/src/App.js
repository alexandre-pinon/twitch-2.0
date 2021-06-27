import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Example from './components/header'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Home from './components/homepage'
import Studio from './components/studio'
import { useSocket } from './utils/socket'
import axios from 'axios'

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
            <Studio />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
