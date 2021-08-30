import express from 'express'
import cors from 'cors'

import * as ErrorHandler from './errors/ErrorHandler.js'
import userRouter from './routes/user.js'
import chatroomRouter from './routes/chatroom.js'
import streamRouter from './routes/stream.js'

// Stripe Info Here
import Stripe from 'stripe';
const stripe = new Stripe(
    "sk_test_51JTNiMImTwtbqWJ6E3Qd6pg6d1tJhV4ItwwUXm0EaAHptIk3krwLvi0oLhpNkqyGKRlLTibTAMlf2ILDQRq3c1wZ00d00mcugj")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/user', userRouter)
app.use('/chatroom', chatroomRouter)
app.use('/stream', streamRouter)

app.post("/pay", async (req, res) => {
    try {
        const amount = 2000;
        const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "eur",
        payment_method_types: ["card"],
        metadata: {
            name: "value",
        },
        });
        const clientSecret = paymentIntent.client_secret;
        res.json({ clientSecret, message: "Payment Initiated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/stripe", (req, res) => {
    if (req.body.type === "payment_intent.created") {
        console.log(`${req.body.data.object.metadata.name} initated payment!`);
    }
    if (req.body.type === "payment_intent.succeeded") {
        console.log(`${req.body.data.object.metadata.name} succeeded payment!`);
    }
});

app.use(ErrorHandler.notFound)
app.use(ErrorHandler.mongooseErrors)

export default app
