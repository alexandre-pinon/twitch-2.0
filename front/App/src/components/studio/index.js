import React, { useEffect } from 'react'
import { ReactFlvPlayer } from 'react-flv-player'
import Chat from "../chat";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
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
    const [value, setValue] = React.useState('Controlled');
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };

    function Display(event) {
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
                            </List>
                            </div>
                          </div>

  return (
      <section>
        <div aria-haspopup="true" className="container xl containVideo">
          <div className="row">
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
                  <div className="input-group">
                      <TextField
                          className="input-item"
                          id="standard-multiline-flexible"
                          label="Message"
                          multiline
                          rowsMax={2}
                          value={value}
                          onChange={handleChange}
                      />
                      <Button variant="contained" className="input-item marginTop" color="primary">
                        Envoyer 
                      </Button>
                  </div>
              </div>
          </div>
          <br/>
          <div className="row test">
            <Link to="/profile" className={classes.avatar}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.large} />
            </Link>
            <div className="NameStreamer">
              <h2>
                Remy Sharp
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
