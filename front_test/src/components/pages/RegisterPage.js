import React from 'react'
import axios from 'axios'

const RegisterPage = (props) => {
  const usernameRef = React.createRef()
  const emailRef = React.createRef()
  const passwordRef = React.createRef()
  const descriptionRef = React.createRef()
  const avatarRef = React.createRef()

  const registerUser = () => {
    const username = usernameRef.current.value
    const email = emailRef.current.value
    const password = passwordRef.current.value
    const description = descriptionRef.current.value
    const avatar = null

    console.log({ username, email, password, description, avatar })

    axios
      .post('http://localhost:8001/user/register', {
        username,
        email,
        password,
        description,
        avatar,
      })
      .then((response) => {
        props.history.push('/login')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="card">
      <div className="cardHeader">Registration</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="text">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="John Doe"
            ref={usernameRef}
            required
          />
        </div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="abc@example.com"
          ref={emailRef}
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
      <div className="inputGroup">
        <label htmlFor="text">Description</label>
        <input
          type="description"
          name="description"
          id="description"
          placeholder="Your description"
          ref={descriptionRef}
        />
      </div>
      <button onClick={registerUser}>Register</button>
    </div>
  )
}

export default RegisterPage
