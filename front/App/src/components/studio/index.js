import React, { useEffect } from 'react'
import { ReactFlvPlayer } from 'react-flv-player'
import Chat from "../chat";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Modal from '@material-ui/core/Modal';


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
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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

    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const body = (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Text in a modal</h2>
        <p id="simple-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </p>
      </div>
    );


  return (
    <div className="container xl">
        <div className="row">
            <div className="col-sm-9">
              <div className="playertoolbar">
              <Button variant="contained" className="input-item marginTop" color="default">
                <FontAwesomeIcon icon={faEllipsisV} onClick={handleOpen}/>
              </Button>
              </div>
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
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.large} />
          <div className="NameStreamer">
            <h2>
              Remy Sharp
            </h2>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
             magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
             consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </div>
        <div className="buttonDiv">
          <Button variant="contained" className="input-item marginTop" color="primary">
            Suivre
          </Button>
        </div>
    </div>
  )
}

export default Studio
