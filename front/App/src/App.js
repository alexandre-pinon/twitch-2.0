import React from 'react';
import logo from './logo.svg';
import './App.css';
import Example from './components/header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/homepage';
import Studio from './components/studio';

function App() {
  return (
    <div className="App">
      <header>
        <Example/>
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
  );
}

export default App;
