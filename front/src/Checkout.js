import axios from 'axios'
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React from "react";
import { useHistory } from 'react-router';
import "./Checkout.css";
import Button from '@material-ui/core/Button'

function Checkout() {
    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();
    const bahamutDragon = {}

    const handleRoute = () => {
        history.push("/profile");
    }

    function payment() {
        axios
            .post('http://localhost:8001/user/subscription', bahamutDragon,
            { headers: { Authorization: `Bearer ${sessionStorage.getItem('TOKEN')}` } })
            .then((response) => {
                if (response.status == 200) {
                    alert(`Payment successful!`);
                    console.log(response)
                }
            })
            .catch((e) => {
                console.error(e)
                alert("You are already subscribed!")
            })
    }

    const pay = async () => {
    try {
        const response = await fetch("http://localhost:8001/pay", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        });
        const data = await response.json();
        const cardElement = elements.getElement(CardElement);
        const confirmPayment = await stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: cardElement } }
        );
        //console.log(confirmPayment);
        const { paymentIntent } = confirmPayment;
        if (paymentIntent.status === "succeeded") {
            payment();
        }
        else alert(`Payment failed!`);
    } catch (err) {
        console.error(err);
        alert("There was an error in payment");
    }
    };

    return (
    <div className="checkout" style={{ width: "25%" }}>
        <CardElement />
        <button onClick={pay}>Pay</button>

        
        <div className="skip" style={{ width: "25%" }}>
            <Button 
                onClick={handleRoute}
                variant="contained">
                    Return
            </Button>
        </div>
    </div>
    );
}

export default Checkout;