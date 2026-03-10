import express, { Router } from "express";
import Stripe from "stripe";
import { insertConversationServices } from "../services/logService";
import { updateOrderPaymentStatusService } from "../services/orderService";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {

    let event = req.body;

    const signature = req.headers['stripe-signature'];

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error('⚠️ Webhook signature verification failed > ', error.message);
        return res.status(400).send(`Webhook Error > ${error.message}`);
    }

    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    await insertConversationServices([{
        eventId: paymentIntent?.id,
        eventType: event?.type ,
        payload: event
    }])

    switch (event.type) {

        case 'payment_intent.succeeded': {
            await updateOrderPaymentStatusService({
                paymentStatus: 'confirmed',
            }, { paymentIntentId: paymentIntent.id, });
            break;
        }

        case 'payment_intent.payment_failed': {
            await updateOrderPaymentStatusService({
                paymentStatus: 'failed',
            }, { paymentIntentId: paymentIntent.id, });
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

export default router;
