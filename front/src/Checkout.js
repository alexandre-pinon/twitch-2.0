import axios from 'axios'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React from 'react'
import { useHistory } from 'react-router'
import './Checkout.css'
import Button from '@material-ui/core/Button'
import { withRouter } from 'react-router-dom'

function Checkout({ match }) {
  const stripe = useStripe()
  const elements = useElements()
  const history = useHistory()
  const bahamutDragon = {
    streamerName: match.params.streamerName,
  }

  const handleRoute = () => {
    history.push(`/profile/${match.params.streamerName}`)
  }

  function payment() {
    axios
      .post(`${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/subscribe`, bahamutDragon, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('TOKEN')}` },
      })
      .then((response) => {
        alert(response.data.message)
        handleRoute()
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const pay = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      const cardElement = elements.getElement(CardElement)
      const confirmPayment = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      })
      //console.log(confirmPayment);
      const { paymentIntent } = confirmPayment
      if (paymentIntent.status === 'succeeded') {
        payment()
      } else alert(`Payment failed!`)
    } catch (err) {
      console.error(err)
      alert('There was an error in payment')
    }
  }

  return (
    <div className="checkout" style={{ width: '25%' }}>
      <CardElement />
      <button onClick={pay}>Pay</button>

      <div className="skip" style={{ width: '25%' }}>
        <Button onClick={handleRoute} variant="contained">
          Return
        </Button>
      </div>
    </div>
  )
}

export default withRouter(Checkout)
