import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

function Register(props) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Axios Call for Register
  function register(e) {
    e.preventDefault()
    const retrieveData = {
      username,
      email,
      password,
    }

    axios
      .post('http://localhost:8001/user/register', retrieveData)
      .then((response) => {
        console.log(response)
        if (response.status == 200) {
          props.history.push('/login')
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }

  return (
    <div className="auth-form">
      <h2>Register a new account</h2>
      <form className="form" onSubmit={register}>
        <label htmlFor="form-username">Username</label>
        <input id="form-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor="form-email">Email</label>
        <input id="form-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="form-password">Password</label>
        <input id="form-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn-submit" type="submit">
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here.</Link>
      </p>
    </div>
  )
}

export default Register
