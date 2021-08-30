import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}))

const ListSubscribers = ({ match }) => {
  const classes = useStyles()

  const [subscribers, setSubscribers] = useState([])

  useEffect(() => {
    getStreamerSubscribers(match.params.streamerName)
  }, [match.params.streamerName])

  const getStreamerSubscribers = async (username) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/get/followsAndSubs/${username}`,
        { headers: { Authorization: `Bearer ${sessionStorage.getItem('TOKEN')}` } }
      )
      setSubscribers(response.data.user.subscribers)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container">
      <h2 className="titleHP">Subscribers</h2>
      <div className="row">
        {subscribers.map((subscriber) => (
          <List className={classes.root}>
            <ListItem className="messageChat" alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={subscriber.username} src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText primary={subscriber.username} />
            </ListItem>
          </List>
        ))}
      </div>
    </div>
  )
}

export default withRouter(ListSubscribers)
