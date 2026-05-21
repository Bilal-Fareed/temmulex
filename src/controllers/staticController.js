import { updateFreelancerDetailDynamicallyService } from "../services/freelancerProfileService.js";

const stripeOnboardingReturnController = async (req, res) => {
    const { shopper_id } = req.params;
    if (shopper_id)
        await updateFreelancerDetailDynamicallyService({ onboardingComplete: true }, { userId: shopper_id });
    
    res.redirect(302, process.env.RETURN_DEEPLINK || 'temmulex://stripe-connect/return');
}

const stripeOnboardingRefreshController = async (req, res) => {
    res.redirect(302, process.env.REFRESH_DEEPLINK || 'temmulex://stripe-connect/refresh');
}

export {
    stripeOnboardingReturnController,
    stripeOnboardingRefreshController,
}
