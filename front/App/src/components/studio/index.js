import React, { useEffect } from 'react'
import { ReactFlvPlayer } from 'react-flv-player'
import Chat from "../chat";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

 const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
}));

function Studio() {

    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };

    useEffect(() => {
      if (props.socket) {
        const testChatroomId = '60d99924da81285294d066eb'
        props.socket.emit('join room', testChatroomId)
        return () => {
          props.socket.emit('leave room', testChatroomId)
        }
      }
    }, [props.socket])

  return (
    <div className="container xl">
        <div className="row">
            <div className="col-sm-9">
                <ReactFlvPlayer
                    url="https://www.youtube.com/watch?v=GF04QkRU4es"
                    height="auto"
                    width="1025px"
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
                        label="Multiline"
                        multiline
                        rowsMax={4}
                        value={value}
                        onChange={handleChange}
                    />
                    <Button variant="contained" className="input-item marginTop" color="primary">
                      Primary
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Studio
