import React, {useState, useEffect } from 'react';
import { ReactFlvPlayer } from 'react-flv-player';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: '36ch',
      backgroundColor: "rgba(255, 255, 255, 0)",
    },
    inline: {
      display: 'inline',
    },
  }));

function Chat() {

    const classes = useStyles();


    const [data, setData]= useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('https://jsonplaceholder.typicode.com/comments')
            setData(result.data)
            console.log(result.data)
        }
        fetchData()
    }, [])

  return (
    <div className="overflow-Y">
        {data.map(item => (
            <List className={classes.root}>
            <ListItem className="messageChat" alignItems="flex-start">
                <ListItemAvatar>
                <Avatar alt={item.email} src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                primary={item.email}
                secondary={
                    <React.Fragment>
                    <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                    >
                        LOREM IPSUM DOLOR DIT APSEM 
                    </Typography>
                    </React.Fragment>
                }
                />
            </ListItem>
        </List>
        ))}
    </div>
  );
}

export default Chat;
