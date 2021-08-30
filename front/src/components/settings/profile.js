import React, { useState } from 'react'
import { Col, Form, Button, Row } from 'react-bootstrap'
import axios from 'axios'

const FormsProfil = ({ loggedUser }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [streamKey, setStreamKey] = useState('')

  const generateStreamKey = () => {}
  const updateUser = async (e) => {
    e.preventDefault()
    try {
      const url = `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/update`
      const data = { username, email, description }
      const token = sessionStorage.getItem('TOKEN')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.put(url, data, config)
      alert(response.data.message)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={updateUser}>
      <div className="row">
        <div className="col-md-6">
          <Form.Group style={{ marginTop: '5%' }}>
            <Form.Control
              type="text"
              placeholder={loggedUser ? loggedUser.username : 'loading...'}
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group style={{ marginTop: '5%' }}>
            <Form.Control
              type="email"
              placeholder={loggedUser ? loggedUser.email : 'loading...'}
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </div>
      </div>
      <div className="row">
        <div style={{ marginTop: '1%' }} className="col-md-12">
          <Form.Control
            as="textarea"
            placeholder={loggedUser && loggedUser.description ? loggedUser.description : 'Description'}
            style={{ height: '100px' }}
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <Button style={{ width: '100%', marginTop: '1%' }} variant="primary" type="submit">
            Update info
          </Button>
        </div>
        <div style={{ marginTop: '5%' }} className="col-md-12">
          <Form.Control
            value={loggedUser && loggedUser.streamKey ? 'Stream Key : ' + loggedUser.streamKey : 'Stream Key'}
            id="streamKey"
            name="streamKey"
            disabled
          />
        </div>
      </div>
      {loggedUser && !loggedUser.streamKey ? (
        <center style={{ marginTop: '1%' }}>
          <btn onClick={generateStreamKey} className="btn btn-secondary">
            Generate your stream key and become a streamer !
          </btn>
        </center>
      ) : (
        <div></div>
      )}
    </form>
  )
}

function SettingsProfil({ loggedUser }) {
  return (
    <div className="container containProfil">
      <h2 className="titleHP">Profile</h2>
      <FormsProfil loggedUser={loggedUser} />
    </div>
  )
}

export default SettingsProfil
