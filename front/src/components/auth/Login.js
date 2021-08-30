import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

function Login(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Axios Call for Login
  const login = async (e) => {
    e.preventDefault()
    const retrieveData = {
      username,
      password,
    }

    try {
      const response = await axios.post('http://localhost:8001/user/login', retrieveData)
      let { message, token, active2FA } = response.data
      if (active2FA) {
        const res = await check2FA()
        if (!res) return
        message = res.data.message
        token = res.data.token
      }
      sessionStorage.setItem('TOKEN', token)
      alert(message)
      props.history.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  const check2FA = async () => {
    try {
      const prompt = window.prompt('Veuillez entrez les 6 chiffres')
      if (!prompt) return false
      const url = `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/check2FA`
      const data = { username, accessKey: prompt }
      return await axios.post(url, data)
    } catch (error) {
      if (error.response && error.response.data) alert(error.response.data.message)
    }
  }

  return (
    <div className="auth-form">
      <h2>Log in</h2>
      <form className="form" onSubmit={login}>
        <label htmlFor="form-username">username</label>
        <input id="form-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor="form-password">Password</label>
        <input id="form-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn-submit" type="submit">
          Log in
        </button>
      </form>
      <p>
        Don't have an account yet? <Link to="/register">Register here.</Link>
      </p>
    </div>
  )
}

export default Login
