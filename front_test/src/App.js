import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import IndexPage from './components/pages/IndexPage'
import HomePage from './components/pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={IndexPage} exact />
        <Route path="/home" component={HomePage} exact />
        <Route path="/login" component={LoginPage} exact />
        <Route path="/register" component={RegisterPage} exact />
      </Switch>
    </BrowserRouter>
  )
}

export default App
