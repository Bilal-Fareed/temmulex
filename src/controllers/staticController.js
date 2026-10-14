import { updateFreelancerDetailDynamicallyService } from "../services/freelancerProfileService.js";

const stripeOnboardingReturnController = async (req, res) => {
    const { shopper_id } = req.params;
    console.log(`Stripe Onboarding Return Url With Shopper Id > ${shopper_id}`);
    if (shopper_id)
        await updateFreelancerDetailDynamicallyService({ onboardingComplete: true }, { userId: shopper_id });
    
    res.redirect(302, process.env.RETURN_DEEPLINK || 'temmulex://stripe-connect/return');
}

const stripeOnboardingRefreshController = async (req, res) => {
    console.log(`Stripe Onboarding Return Url Without Shopper Id >`);
    res.redirect(302, process.env.REFRESH_DEEPLINK || 'temmulex://stripe-connect/refresh');
}

export {
    stripeOnboardingReturnController,
    stripeOnboardingRefreshController,
}
