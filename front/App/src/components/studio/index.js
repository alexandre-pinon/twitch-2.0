import React from 'react';
import { ReactFlvPlayer } from 'react-flv-player'
import Chat from "../chat";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

/* const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
}));
 */
function Studio() {

/*     const classes = useStyles();
 */    const [value, setValue] = React.useState('Controlled');
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };

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
                        id="standard-multiline-flexible"
                        label="Multiline"
                        multiline
                        rowsMax={4}
                        value={value}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
        <br/>
        <div className="row test">

        </div>
    </div>
  );
}

export default Studio;
