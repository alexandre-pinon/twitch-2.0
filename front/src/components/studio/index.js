import React, { useEffect, Component, useState } from 'react'
import { ReactFlvPlayer } from 'react-flv-player'
import Chat from '../chat'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Form } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  large: {
    width: theme.spacing(26),
    height: theme.spacing(26),
  },
  avatar: {
    width: theme.spacing(30),
    height: theme.spacing(30),
    textDecoration: 'none',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}))

var loc = window.location
var locToString = loc.toString()
var id = locToString.substring(locToString.length - 1, locToString.length)
var url = '' + id // affichage des profil par id

class CardUser extends Component {
  async followOrUnfollow(action) {
    try {
      const url = `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/${action}`
      const data = { streamerName: this.props.streamer.username }
      const token = sessionStorage.getItem('TOKEN')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(url, data, config)
      alert(response.data.message)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  async subscribeOrSubscribed(action) {
    try {
      const url = `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/${action}`
      const data = { streamerName: this.props.streamer.username }
      const token = sessionStorage.getItem('TOKEN')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(url, data, config)
      alert(response.data.message)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { loggedUser, streamer } = this.props
    return (
      <div className="row test">
        <Link
          to="/profile"
          style={{
            width: '250px',
            height: '250px',
            textDecoration: 'none',
          }}
        >
          <Avatar
            alt={streamer ? streamer.username : 'loading...'}
            src="/static/images/avatar/1.jpg"
            style={{
              width: '200px',
              height: '200px',
            }}
          />
        </Link>
        <div className="NameStreamer">
          <h2>{streamer ? streamer.username : 'loading...'}</h2>
          <p>{streamer ? streamer.description : 'loading...'}</p>
          <table id="table">
            <thead>
              <th>Followers</th>
              <th>Subscribers</th>
              <th>Followings</th>
            </thead>
            <tbody>
              <tr>
                <td>
                  {streamer ? (
                    <Link className="noLinkStyle" to={`/followers/${streamer.username}`}>
                      {streamer.followers.length}
                    </Link>
                  ) : (
                    'loading...'
                  )}
                </td>
                <td>
                {streamer ? (
                    <Link className="noLinkStyle" to={`/subscribers/${streamer.username}`}>
                      {streamer.subscribers.length}
                    </Link>
                  ) : (
                    'loading...'
                  )}
                </td>
                <td>
                {streamer ? (
                    <Link className="noLinkStyle" to={`/followings/${streamer.username}`}>
                      {streamer.followings.length}
                    </Link>
                  ) : (
                    'loading...'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="buttonDiv">
          {loggedUser && streamer ? (
            !loggedUser.followings.map((user) => user._id).includes(streamer._id) ? (
              <Button
                variant="contained"
                className="input-item marginTop"
                color="primary"
                onClick={() => this.followOrUnfollow('follow')}
              >
                Follow
              </Button>
            ) : (
              <Button
                variant="contained"
                className="input-item marginTop"
                color="primary"
                onClick={() => this.followOrUnfollow('unfollow')}
              >
                Unfollow
              </Button>
            )
          ) : (
            <div>Loading...</div>
          )}
          <br></br>
          {loggedUser && streamer ? (
            !loggedUser.subscribers.map((user) => user._id).includes(streamer._id) ? (
              <Button
                variant="contained"
                className="input-item marginTop"
                color="primary"
                onClick={() => this.subscribeOrSubscribed('subscribe')}
              >
                Subscribe
              </Button>
            ) : (
              <Button variant="contained" className="input-item marginTop" color="primary">
                Subscribed
              </Button>
            )
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    )
  }
}

class FormsChat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const { message } = this.state
    const { socket, streamChat } = this.props

    if (socket && streamChat) {
      socket.emit('chat message', streamChat._id, message)
      this.setState({ message: '' })
    } else {
      console.log('Error : NO SOCKET!')
    }
  }

  render() {
    const { message } = this.state
    return (
      <div className="input-group">
        <form onSubmit={this.handleSubmit} style={{ width: '100%' }}>
          <Form.Group>
            <Form.Control
              as="textarea"
              placeholder="type your message..."
              rows={2}
              id="message"
              name="message"
              value={message}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Button type="submit" variant="contained" className="input-item marginTop" color="primary">
            Send
          </Button>
        </form>
      </div>
    )
  }
}

const Studio = ({ match, socket, loggedUser }) => {
  const [streamer, setStreamer] = useState(null)
  const [streamChat, setStreamChat] = useState(null)

  useEffect(() => {
    retrieveStreamData(match.params.streamerName)
  }, [socket, match.params.streamerName])

  useEffect(() => {
    if (socket && streamChat) {
      socket.emit('join room', streamChat._id)
      return () => {
        socket.emit('leave room', streamChat._id)
      }
    }
  }, [streamChat])

  const retrieveStreamData = async (username) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/get/${username}`,
        { headers: { Authorization: `Bearer ${sessionStorage.getItem('TOKEN')}` } }
      )
      setStreamer(response.data.user)
      setStreamChat(response.data.user.streamChat)
    } catch (error) {
      console.log(error)
    }
  }

  const classes = useStyles()

  function Display(event) {
    console.log(event.target.parentNode.parentNode.childNodes[1].attributes[0].value)
    if (event.target.parentNode.parentNode.childNodes[1].attributes[0].value == 'false') {
      event.target.parentNode.parentNode.childNodes[1].attributes[0].value = 'true'
    } else {
      event.target.parentNode.parentNode.childNodes[1].attributes[0].value = 'false'
    }
  }

  function DisplayMode(event) {
    var elmt = document.getElementsByClassName('containVideo')
    if (event.target.innerText == 'Mode Full Window') {
      elmt[0].attributes[0].value = 'false'
      elmt[1].attributes[0].value = 'true'
    } else {
      elmt[0].attributes[0].value = 'true'
      elmt[1].attributes[0].value = 'false'
    }
  }

  const playertoobar = (
    <div className="playertoolbar">
      <Button onClick={Display} variant="contained" className="input-item marginTop" color="default">
        <FontAwesomeIcon icon={faEllipsisV} />
      </Button>
      <div aria-haspopup="false" className="window">
        <List component="nav" className={classes.root} aria-label="contacts">
          <ListItem button onClick={DisplayMode}>
            <ListItemText inset primary="Mode Full Window" />
          </ListItem>
          <ListItem button onClick={DisplayMode}>
            <ListItemText inset primary="Mode Studio" />
          </ListItem>
          <ListItem button>
            <ListItemText inset primary="paramètres du stream" />
          </ListItem>
        </List>
      </div>
    </div>
  )

  return (
    <section>
      <div aria-haspopup="true" className="container xl containVideo">
        <div className="row row--With--Shadow">
          <div className="col-sm-9">
            {playertoobar}
            {streamer && streamer.streamKey ? (
              <ReactFlvPlayer
                url={`${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_STREAM_PORT}/live/${streamer.streamKey}.flv`}
                height="auto"
                width="100%"
                isMuted={false}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
          <div id="testCt" className="col-sm-3">
            <header className="titleChat">Stream chat</header>
            <div className="containChat">
              <Chat socket={socket} streamChat={streamChat} />
            </div>
            <FormsChat socket={socket} streamChat={streamChat} />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-12">
            <h2>Stream name</h2>
          </div>
        </div>
        <br />
        <CardUser streamer={streamer} loggedUser={loggedUser} />
      </div>
      <div aria-haspopup="false" className="containFullMode containVideo">
        {playertoobar}
        {/* <ReactFlvPlayer url="https://www.youtube.com/watch?v=GF04QkRU4es" height="auto" width="100%" isMuted={false} /> */}
        <div className="containFullChat">
          <Chat />
        </div>
      </div>
    </section>
  )
}

export default withRouter(Studio)
