import express, { Router } from "express";
import { stripe } from "../helpers/payment.js";
import { insertPaymentLogServices } from "../services/logService.js";
import { updateOrderPaymentStatusService } from "../services/orderService.js";
import { updateFreelancerDetailDynamicallyService } from "../services/freelancerProfileService.js";

const router = Router();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {

    let event = req.body;

    const signature = req.headers['stripe-signature'];

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error('Webhook signature verification failed > ', error.message);
        return res.status(400).send(`Webhook Error > ${error.message}`);
    }

    const _event = event.data.object;

    await insertPaymentLogServices([{
        eventId: _event?.id,
        eventType: event?.type,
        payload: event
    }])

    switch (event.type) {

        case 'payment_intent.succeeded': {
            await updateOrderPaymentStatusService({
                paymentStatus: 'received',
                status: 'ongoing',
            }, { paymentReference: _event.id });
            break;
        }

        case 'payment_intent.payment_failed': {
            await updateOrderPaymentStatusService({
                paymentStatus: 'failed',
            }, { paymentReference: _event.id });
            break;
        }

        case 'refund.created':
        case 'refund.updated': {
            await updateOrderPaymentStatusService({
                paymentStatus: 'refunded',
            }, { paymentReference: _event.payment_intent });
            break;
        }

        case 'transfer.created': {
            const orderId = _event?.metadata?.orderId || _event?.transfer_group?.replace("order_", "");
            if (orderId) {
                await updateOrderPaymentStatusService({
                    paymentStatus: 'disbursed',
                    payoutTransferId: _event.id,
                }, { uuid: orderId });
            } else {
                console.log(`Order mapping not found for transfer event id: ${_event.id}`);
            }
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

export default router;
