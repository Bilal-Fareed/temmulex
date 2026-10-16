import express, { Router } from "express";
import { stripe } from "../helpers/payment.js";
import { insertPaymentLogServices } from "../services/logService.js";
import { updateOrderPaymentStatusService } from "../services/orderService.js";
import { updateItemPaymentStatusService } from "../services/orderItemService.js";

const router = Router();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {

    console.log('Stripe Webhook Request Start');
    let event = req.body;

    const signature = req.headers['stripe-signature'];

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error('Webhook signature verification failed > ', error.message);
        return res.status(500).json({ received: false });
    }

    console.log('Stripe Webhook Request Event > ', event);
    const _event = event.data.object;

    try {

        await insertPaymentLogServices([{
            eventId: _event?.id,
            eventType: event?.type,
            payload: event
        }])

        switch (event.type) {

            case 'payment_intent.succeeded': {
                const { orderId, itemId } = _event?.metadata ?? {}; 

                if (orderId) {
                    await updateOrderPaymentStatusService({
                        paymentStatus: 'received',
                        status: 'ongoing',
                    }, { paymentReference: _event.id });
                } else if (itemId) {
                    await updateItemPaymentStatusService({
                        paymentStatus: 'received',
                    }, { paymentReference: _event.id })
                } else {
                    console.log(`payment_intent.succeeded: Order mapping not found for transfer event id: ${_event.id}`);
                }
                break;
            }

            case 'payment_intent.payment_failed': {
                const { orderId, itemId } = _event?.metadata ?? {}; 

                if (orderId) {
                    await updateOrderPaymentStatusService({
                        paymentStatus: 'failed',
                    }, { paymentReference: _event.id });
                } else if (itemId) {
                    await updateItemPaymentStatusService({
                        paymentStatus: 'failed',
                    }, { paymentReference: _event.id })
                } else {
                    console.log(`payment_intent.payment_failed: Order mapping not found for transfer event id: ${_event.id}`);
                }

                break;
            }

            case 'refund.created': {
                const { orderId, itemId } = _event?.metadata ?? {}; 

                if (orderId) {
                    await updateOrderPaymentStatusService({
                        paymentStatus: 'refunded',
                    }, { paymentReference: _event.payment_intent });

                } else if (itemId) {
                    await updateItemPaymentStatusService({
                        paymentStatus: 'refunded',
                    }, { paymentReference: _event.payment_intent })
                } else {
                    console.log(`refund.created.succeeded: Order mapping not found for transfer event id: ${_event.id}`);
                }

                break;
            }

            case 'transfer.created': {
                const orderId = _event?.metadata?.orderId || _event?.transfer_group?.replace("order_", "");
                const itemId = _event?.metadata?.itemId || _event?.transfer_group?.replace("item_", "");

                if (orderId) {
                    await updateOrderPaymentStatusService({
                        paymentStatus: 'disbursed',
                        payoutTransferId: _event.id,
                    }, { uuid: orderId });
                } else if (itemId) {
                    await updateItemPaymentStatusService({
                        paymentStatus: 'disbursed',
                        payoutTransferId: _event.id,
                    }, { uuid: itemId })
                } else {
                    console.log(`transfer.created: Order mapping not found for transfer event id: ${_event.id}`);
                }
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

    } catch (error) {
        console.error('Stripe Webhook Handling Failed > ', error.message);
        return res.status(500).json({ received: false });
    }

    res.json({ received: true });
});

export default router;
