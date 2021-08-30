import React, { useState, useEffect } from 'react'
import { ReactFlvPlayer } from 'react-flv-player'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  inline: {
    display: 'inline',
  },
}))

const Chat = ({ socket, streamChat }) => {
  const classes = useStyles()
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (message) => {
        setMessages((messages) => [...messages, message])
      })
      socket.on('server error', (message) => {
        setMessages((messages) => [...messages, message])
      })
      return () => {
        socket.off('chat message')
        socket.off('server error')
      }
    }
  }, [socket])

  useEffect(() => {
    if (streamChat && streamChat.messages) {
      const streamMessages = streamChat.messages.map((message) => ({
        username: message.user.username,
        message: message.message,
      }))
      setMessages(streamMessages)
    }
  }, [streamChat])

  useEffect(() => {
    this.lastMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }, [messages])

  return (
    <div className="overflow-Y">
      {messages.map((message) => (
        <List className={classes.root}>
          <ListItem className="messageChat" alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={message.username} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={message.username}
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                    {message.message}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      ))}
      <div ref={(node) => (this.lastMessages = node)}></div>
    </div>
  )
}

export default Chat
