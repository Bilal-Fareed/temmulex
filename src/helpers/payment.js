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

const refundPayment = async (paymentIntent) => {
    await stripe.refunds.create({ payment_intent: paymentIntent });
}

const disbursePayment = async (amount, currency, destinationAccount) => {
    const transfer = await stripe.transfers.create({
        amount: amount,
        currency: currency,
        destination: destinationAccount,
    });
    return transfer;
}

export {
    stripe,
    refundPayment,
    disbursePayment,
    createStripeConnectAccount,
    createStripeOnboardingLink,
}