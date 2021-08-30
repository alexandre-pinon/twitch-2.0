import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

function Register(props) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Axios Call for Register
  const register = async (e) => {
    e.preventDefault()
    const retrieveData = {
      username,
      email,
      password,
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/register`,
        retrieveData
      )
      props.history.push('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="backLogin">
      <div className="auth-form">
        <h2>Register a new account</h2>
        <form className="form" onSubmit={register}>
          <label hidden htmlFor="form-username">
            Username
          </label>
          <input
            placeholder="Username"
            id="form-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <br />
          <label hidden htmlFor="form-email">
            Email
          </label>
          <input
            placeholder="Email"
            id="form-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <br />
          <label hidden htmlFor="form-password">
            Password
          </label>
          <input
            placeholder="Password"
            id="form-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <button className="btn btn-primary" type="submit">
            Créer un compte
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here.</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
