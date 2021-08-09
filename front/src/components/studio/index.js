import React, { useEffect, Component } from 'react'
import { ReactFlvPlayer } from 'react-flv-player'
import Chat from "../chat";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Form } from 'react-bootstrap';
import {
  Link
} from "react-router-dom";


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
    textDecoration: "none",
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
}));

var loc = window.location
var locToString = loc.toString()
var id = locToString.substring(locToString.length-1, locToString.length)
var url = '' + id; // affichage des profil par id

class CardUser extends Component {

  state = {
     user : {}
 }

 componentDidMount() {
     /* console.log(url) */
     fetch('https://jsonplaceholder.typicode.com/users/1')
     .then(response => {
         return response.json()
     }).then(result => {
         this.setState({user : result})
         console.log(result)
     })
 }

 render() {
    return(
      <div className="row test">
        <Link to="/profile" style={{    
          width: '250px',
          height: '250px',
          textDecoration: "none" }}
        >
          <Avatar alt={this.state.user.name} src="/static/images/avatar/1.jpg" style={{    
            width: '200px',
            height: '200px' }} 
          />
        </Link>
        <div className="NameStreamer">
          <h2>
            {this.state.user.name}
          </h2>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <table id="table">
            <thead>
              <th>
                Followers
              </th>
              <th>
                Followings
              </th>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link className="noLinkStyle" to="/followers">
                    1212891
                  </Link>
                </td>
                <td>
                  <Link className="noLinkStyle" to="/followings">
                    1212891
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="buttonDiv">
          <Button variant="contained" className="input-item marginTop" color="primary">
            Suivre
          </Button>
        </div>
      </div>
    )
  }
}

class FormsChat extends React.Component{

  constructor (props) {
    super(props)
      this.state = {
          message:''
      }
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
      this.setState({
          [e.target.name] : e.target.value,
      })
  }

  handleSubmit(e) {
      e.preventDefault();   
      const {message} = this.state

      const data = {message : message }
          axios.post('http://localhost:1337/signin', data)
          .then(response => {
              this.setState({
                  message: ''
              })
              console.log(response)
          })
          .catch(error => {
              console.log(error)
          })    
  }

  render() {
    const { message } = this.state;
    return(
      <div className="input-group">
        <form style={{ width: '100%' }}>
          <Form.Group>
            <Form.Control as="textarea" placeholder="tape your message" rows={2} id='message' name='message' value={message} onChange={this.handleChange} />
          </Form.Group>
          <Button type="submit" variant="contained" className="input-item marginTop" color="primary">
            Envoyer 
          </Button>
        </form>
      </div>
    )
  }
}

function Studio(props) {


  useEffect(() => {
    if (props.socket) {
      const testChatroomId = '60d99924da81285294d066eb'
      props.socket.emit('join room', testChatroomId)
      return () => {
        props.socket.emit('leave room', testChatroomId)
      }
    }
  }, [props.socket])

  const classes = useStyles();

    function Display(event) {
      console.log(event.target.parentNode.parentNode.childNodes[1].attributes[0].value)
      if (event.target.parentNode.parentNode.childNodes[1].attributes[0].value == "false") {
        event.target.parentNode.parentNode.childNodes[1].attributes[0].value = 'true'
      } else {
        event.target.parentNode.parentNode.childNodes[1].attributes[0].value = 'false'
      }
    }

    function DisplayMode(event) {
      var elmt = document.getElementsByClassName('containVideo')
      if (event.target.innerText == "Mode Full Window") {
        elmt[0].attributes[0].value = 'false'
        elmt[1].attributes[0].value = 'true'
      } else {
        elmt[0].attributes[0].value = 'true'
        elmt[1].attributes[0].value = 'false'
      }
    }

    const playertoobar =  <div className="playertoolbar">
                            <Button onClick={Display} variant="contained" className="input-item marginTop" color="default">
                              <FontAwesomeIcon icon={faEllipsisV}/>
                            </Button>
                            <div aria-haspopup="false" className="window">
                            <List component="nav" className={classes.root} aria-label="contacts">
                              <ListItem button onClick={DisplayMode}>
                                <ListItemText inset primary="Mode Full Window" />
                              </ListItem>
                              <ListItem button onClick={DisplayMode}>
                                <ListItemText inset primary="Mode Studio" />
                              </ListItem>
                              <ListItem button >
                                <ListItemText inset primary="paramètres du stream" />
                              </ListItem>
                            </List>
                            </div>
                          </div>

  return (
      <section>
        <div aria-haspopup="true" className="container xl containVideo">
          <div className="row row--With--Shadow">
              <div className="col-sm-9">
                      {playertoobar}
                  <ReactFlvPlayer
                      url="https://www.youtube.com/watch?v=GF04QkRU4es"
                      height="auto"
                      width="100%"
                      isMuted={false}
                  /> 
              </div>
              <div id="testCt" className="col-sm-3">
                  <header className="titleChat">
                      Chat du stream
                  </header>
                  <div className="containChat">
                      <Chat/>
                  </div>
                  <FormsChat/>
              </div>
          </div>
          <br/>
          <div className="row">
              <div className="col-12">
                <h2>
                  Nom du stream
                </h2>      
              </div>
          </div>
          <br/>
          <CardUser/> 
        </div>
        <div aria-haspopup="false" className="containFullMode containVideo">
        {playertoobar}
          <ReactFlvPlayer
            url="https://www.youtube.com/watch?v=GF04QkRU4es"
            height="auto"
            width="100%"
            isMuted={false}
          />
          <div className="containFullChat">
             <Chat/> 
          </div>
        </div>
      </section>
  )
}

export default Studio
