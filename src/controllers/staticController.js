import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { updateFreelancerDetailDynamicallyService } from "../services/freelancerProfileService.js";

const stripeOnboardingReturnController = async (req, res) => {
    const { shopper_id } = req.params;
    if (shopper_id)
        await updateFreelancerDetailDynamicallyService({ onboardingComplete: true }, { userId: shopper_id });
    
    res.sendFile(path.join(__dirname, "../../public/stripe-onboarding-return.html"));
}

const appOnboardingReturnController = async (req, res) => {
    const { shopper_id } = req.query;
    if (shopper_id)
        await updateFreelancerDetailDynamicallyService({ onboardingComplete: true }, { userId: shopper_id });
    
    res.status(201);
}

const stripeOnboardingRefreshController = async (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/stripe-onboarding-refresh.html"));
}

export {
    appOnboardingReturnController,
    stripeOnboardingReturnController,
    stripeOnboardingRefreshController,
}
