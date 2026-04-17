import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createStripeConnectAccount = async ({ email }) => {
    const account = await stripe.accounts.create({
        type: "express",
        email,
    });
    return account;
}

const createStripeOnboardingLink = async (accountId) => {
    const link = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: process.env.STRIPE_ONBOARDING_REFRESH_LINK,
        return_url: process.env.STRIPE_ONBOARDING_RETURN_LINK,
        type: "account_onboarding",
    });

    return link.url;
};

const refundPayment = async ({ paymentIntent, orderId }) => {
    await stripe.refunds.create({
        payment_intent: paymentIntent,
        metadata: {
            orderId,
        },
    });
}

const disbursePayment = async ({ amount, currency, destinationAccount, orderId }) => {
    const transfer = await stripe.transfers.create({
        amount: amount,
        currency: currency,
        destination: destinationAccount,
        transfer_group: `order_${orderId}`,
        metadata: {
            orderId,
        },
    });
    return transfer;
}

const createPaymentIntent = async ({ amount, orderId }) => {
    return await stripe.paymentIntents.create({
        amount: amount,
        currency: process.env.CURRENCY || "GBP",
        transfer_group: `order_${orderId}`,
        metadata: {
            orderId,
        },
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });
}

const getPaymentIntentStatus = async (paymentIntentId) => {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
}

const cancelOldPaymentIntent = async (oldPaymentIntentId) => {
    await stripe.paymentIntents.cancel(oldPaymentIntentId);
}

export {
    stripe,
    refundPayment,
    disbursePayment,
    createPaymentIntent,
    cancelOldPaymentIntent,
    getPaymentIntentStatus,
    createStripeConnectAccount,
    createStripeOnboardingLink,
}