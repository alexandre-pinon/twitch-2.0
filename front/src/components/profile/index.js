import React, { useEffect, useState } from 'react'
import ClipCarousel from '../carouselCard/clip'
import { makeStyles } from '@material-ui/core/styles'
import { ReactFlvPlayer } from 'react-flv-player'
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

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
    textDecoration: 'none',
    position: 'relative',
  },
}))

function Profile() {
  const classes = useStyles()

  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('https://jsonplaceholder.typicode.com/user/1')
      setData(result.data)
      console.log(result.data)
    }
    fetchData()
  }, [])

  return (
    <section style={{ position: 'relative' }}>
      <div className="videoProfile">
        <ReactFlvPlayer url="https://www.youtube.com/watch?v=GF04QkRU4es" height="400px" width="100%" isMuted={false} />
        <div className="containProfile">
          <div className="row test">
            <div className={classes.avatar}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.large} />
            </div>
            <div className="NameStreamer">
              <h2 aria-haspopup="true">
                Remy Sharp
                <Link to="/settings">
                  <FontAwesomeIcon id="buttonUsername" icon={faEdit} />
                </Link>
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </p>
              <table id="table">
                <thead>
                  <th>Followers</th>
                  <th>Followings</th>
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
              <Button hidden variant="contained" className="input-item marginTop" color="secondary">
                Plus suivre
              </Button>
            </div>
          </div>
          <ClipCarousel />
          <div className="container" id="containDon">
            <div className="row">
              <h2>Soutenez votre diffuseur Febreze préférée</h2>
              <div className="col-md-6">
                Subscribe
                <div>
                  <center>
                    <br />
                    <btn id="btnSubs" className="btn btn-primary Paypal">
                      Payer avec Paypal{' '}
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="paypal"
                        class="svg-inline--fa fa-paypal fa-w-12"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                      >
                        <path
                          fill="currentColor"
                          d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"
                        ></path>
                      </svg>
                    </btn>
                    <br />
                    <btn id="btnSubs" className="btn btn-primary CB">
                      Payer avec Carte de Crédit{' '}
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="credit-card"
                        class="svg-inline--fa fa-credit-card fa-w-18"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path
                          fill="currentColor"
                          d="M0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V256H0v176zm192-68c0-6.6 5.4-12 12-12h136c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H204c-6.6 0-12-5.4-12-12v-40zm-128 0c0-6.6 5.4-12 12-12h72c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM576 80v48H0V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48z"
                        ></path>
                      </svg>
                    </btn>
                    <br />
                    <btn id="btnSubs" className="btn btn-secondary ApplePay">
                      Payer avec ApplePay{' '}
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="apple-pay"
                        class="svg-inline--fa fa-apple-pay fa-w-20"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path
                          fill="currentColor"
                          d="M116.9 158.5c-7.5 8.9-19.5 15.9-31.5 14.9-1.5-12 4.4-24.8 11.3-32.6 7.5-9.1 20.6-15.6 31.3-16.1 1.2 12.4-3.7 24.7-11.1 33.8m10.9 17.2c-17.4-1-32.3 9.9-40.5 9.9-8.4 0-21-9.4-34.8-9.1-17.9.3-34.5 10.4-43.6 26.5-18.8 32.3-4.9 80 13.3 106.3 8.9 13 19.5 27.3 33.5 26.8 13.3-.5 18.5-8.6 34.5-8.6 16.1 0 20.8 8.6 34.8 8.4 14.5-.3 23.6-13 32.5-26 10.1-14.8 14.3-29.1 14.5-29.9-.3-.3-28-10.9-28.3-42.9-.3-26.8 21.9-39.5 22.9-40.3-12.5-18.6-32-20.6-38.8-21.1m100.4-36.2v194.9h30.3v-66.6h41.9c38.3 0 65.1-26.3 65.1-64.3s-26.4-64-64.1-64h-73.2zm30.3 25.5h34.9c26.3 0 41.3 14 41.3 38.6s-15 38.8-41.4 38.8h-34.8V165zm162.2 170.9c19 0 36.6-9.6 44.6-24.9h.6v23.4h28v-97c0-28.1-22.5-46.3-57.1-46.3-32.1 0-55.9 18.4-56.8 43.6h27.3c2.3-12 13.4-19.9 28.6-19.9 18.5 0 28.9 8.6 28.9 24.5v10.8l-37.8 2.3c-35.1 2.1-54.1 16.5-54.1 41.5.1 25.2 19.7 42 47.8 42zm8.2-23.1c-16.1 0-26.4-7.8-26.4-19.6 0-12.3 9.9-19.4 28.8-20.5l33.6-2.1v11c0 18.2-15.5 31.2-36 31.2zm102.5 74.6c29.5 0 43.4-11.3 55.5-45.4L640 193h-30.8l-35.6 115.1h-.6L537.4 193h-31.6L557 334.9l-2.8 8.6c-4.6 14.6-12.1 20.3-25.5 20.3-2.4 0-7-.3-8.9-.5v23.4c1.8.4 9.3.7 11.6.7z"
                        ></path>
                      </svg>
                    </btn>
                    <br />
                  </center>
                </div>
              </div>
              <div className="col-md-6">
                Bits
                <div className="flexDiv">
                  <div style={{ color: '#f86e2' }} className="squareBits">
                    <svg
                      id="diamond"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="gem"
                      class="svg-inline--fa fa-gem fa-w-18"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        fill="currentColor"
                        d="M464 0H112c-4 0-7.8 2-10 5.4L2 152.6c-2.9 4.4-2.6 10.2.7 14.2l276 340.8c4.8 5.9 13.8 5.9 18.6 0l276-340.8c3.3-4.1 3.6-9.8.7-14.2L474.1 5.4C471.8 2 468.1 0 464 0zm-19.3 48l63.3 96h-68.4l-51.7-96h56.8zm-202.1 0h90.7l51.7 96H191l51.6-96zm-111.3 0h56.8l-51.7 96H68l63.3-96zm-43 144h51.4L208 352 88.3 192zm102.9 0h193.6L288 435.3 191.2 192zM368 352l68.2-160h51.4L368 352z"
                      ></path>
                    </svg>
                    <br />
                    <p>100 bits</p>
                  </div>
                  <div style={{ color: '#40ff80' }} className="squareBits">
                    <svg
                      id="diamond"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="gem"
                      class="svg-inline--fa fa-gem fa-w-18"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        fill="currentColor"
                        d="M464 0H112c-4 0-7.8 2-10 5.4L2 152.6c-2.9 4.4-2.6 10.2.7 14.2l276 340.8c4.8 5.9 13.8 5.9 18.6 0l276-340.8c3.3-4.1 3.6-9.8.7-14.2L474.1 5.4C471.8 2 468.1 0 464 0zm-19.3 48l63.3 96h-68.4l-51.7-96h56.8zm-202.1 0h90.7l51.7 96H191l51.6-96zm-111.3 0h56.8l-51.7 96H68l63.3-96zm-43 144h51.4L208 352 88.3 192zm102.9 0h193.6L288 435.3 191.2 192zM368 352l68.2-160h51.4L368 352z"
                      ></path>
                    </svg>
                    <br />
                    <p>200 bits</p>
                  </div>
                  <div style={{ color: '#614E1A' }} className="squareBits">
                    <svg
                      id="diamond"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="gem"
                      class="svg-inline--fa fa-gem fa-w-18"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        fill="currentColor"
                        d="M464 0H112c-4 0-7.8 2-10 5.4L2 152.6c-2.9 4.4-2.6 10.2.7 14.2l276 340.8c4.8 5.9 13.8 5.9 18.6 0l276-340.8c3.3-4.1 3.6-9.8.7-14.2L474.1 5.4C471.8 2 468.1 0 464 0zm-19.3 48l63.3 96h-68.4l-51.7-96h56.8zm-202.1 0h90.7l51.7 96H191l51.6-96zm-111.3 0h56.8l-51.7 96H68l63.3-96zm-43 144h51.4L208 352 88.3 192zm102.9 0h193.6L288 435.3 191.2 192zM368 352l68.2-160h51.4L368 352z"
                      ></path>
                    </svg>
                    <br />
                    <p>500 bits</p>
                  </div>
                  <div style={{ color: '#C0C0C0' }} className="squareBits">
                    <svg
                      id="diamond"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="gem"
                      class="svg-inline--fa fa-gem fa-w-18"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        fill="currentColor"
                        d="M464 0H112c-4 0-7.8 2-10 5.4L2 152.6c-2.9 4.4-2.6 10.2.7 14.2l276 340.8c4.8 5.9 13.8 5.9 18.6 0l276-340.8c3.3-4.1 3.6-9.8.7-14.2L474.1 5.4C471.8 2 468.1 0 464 0zm-19.3 48l63.3 96h-68.4l-51.7-96h56.8zm-202.1 0h90.7l51.7 96H191l51.6-96zm-111.3 0h56.8l-51.7 96H68l63.3-96zm-43 144h51.4L208 352 88.3 192zm102.9 0h193.6L288 435.3 191.2 192zM368 352l68.2-160h51.4L368 352z"
                      ></path>
                    </svg>
                    <br />
                    <p>1 000 bits</p>
                  </div>
                  <div style={{ color: '#ffc340' }} className="squareBits">
                    <svg
                      id="diamond"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="gem"
                      class="svg-inline--fa fa-gem fa-w-18"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        fill="currentColor"
                        d="M464 0H112c-4 0-7.8 2-10 5.4L2 152.6c-2.9 4.4-2.6 10.2.7 14.2l276 340.8c4.8 5.9 13.8 5.9 18.6 0l276-340.8c3.3-4.1 3.6-9.8.7-14.2L474.1 5.4C471.8 2 468.1 0 464 0zm-19.3 48l63.3 96h-68.4l-51.7-96h56.8zm-202.1 0h90.7l51.7 96H191l51.6-96zm-111.3 0h56.8l-51.7 96H68l63.3-96zm-43 144h51.4L208 352 88.3 192zm102.9 0h193.6L288 435.3 191.2 192zM368 352l68.2-160h51.4L368 352z"
                      ></path>
                    </svg>
                    <br />
                    <p>5 000 bits</p>
                  </div>
                  <div style={{ color: '#40b3ff' }} className="squareBits">
                    <svg
                      id="diamond"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="gem"
                      class="svg-inline--fa fa-gem fa-w-18"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path
                        fill="currentColor"
                        d="M464 0H112c-4 0-7.8 2-10 5.4L2 152.6c-2.9 4.4-2.6 10.2.7 14.2l276 340.8c4.8 5.9 13.8 5.9 18.6 0l276-340.8c3.3-4.1 3.6-9.8.7-14.2L474.1 5.4C471.8 2 468.1 0 464 0zm-19.3 48l63.3 96h-68.4l-51.7-96h56.8zm-202.1 0h90.7l51.7 96H191l51.6-96zm-111.3 0h56.8l-51.7 96H68l63.3-96zm-43 144h51.4L208 352 88.3 192zm102.9 0h193.6L288 435.3 191.2 192zM368 352l68.2-160h51.4L368 352z"
                      ></path>
                    </svg>
                    <br />
                    <p>10 000 bits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile
