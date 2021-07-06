import React, { useEffect, useState } from 'react';
import ClipCarousel from "../carouselCard/clip";
import { makeStyles } from '@material-ui/core/styles';
import { ReactFlvPlayer } from 'react-flv-player'
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import {
    Link
  } from "react-router-dom";
  

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
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
  }));

function Profile() {

    const classes = useStyles();

    const [data, setData]= useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('https://jsonplaceholder.typicode.com/user/1')
            setData(result.data)
            console.log(result.data)
        }
        fetchData()
    }, [])


  return (
    <section style={{position: "relative",}}>
        <div className="videoProfile">
            <ReactFlvPlayer
                url="https://www.youtube.com/watch?v=GF04QkRU4es"
                height="400px"
                width="100%"
                isMuted={false}
            /> 
            <div className="containProfile">
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
                <ClipCarousel/>
            </div>
        </div>
    </section>
  )
}

export default Profile