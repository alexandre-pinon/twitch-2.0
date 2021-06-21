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


function App() {
  return (
    <div className="App">
      <header>
        <Example/>
      </header>
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
