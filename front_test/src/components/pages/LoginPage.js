import React from 'react'
import axios from 'axios'

const LoginPage = (props) => {
  const usernameRef = React.createRef()
  const passwordRef = React.createRef()

  const loginUser = () => {
    const username = usernameRef.current.value
    const password = passwordRef.current.value

    console.log({ username, password })

    axios
      .post('http://localhost:8001/user/login', {
        username,
        password,
      })
      .then((response) => {
        localStorage.setItem('CC_Token', response.data.token)
        props.history.push('/home')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="card">
      <div className="cardHeader">Login</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="text">Username</label>
          <input
            type="username"
            name="username"
            id="username"
            placeholder="Your Username"
            ref={usernameRef}
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            ref={passwordRef}
            required
          />
        </div>
        <button onClick={loginUser}>Login</button>
      </div>
    </div>
  )
}

export default LoginPage
