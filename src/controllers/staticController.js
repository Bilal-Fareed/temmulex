import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { updateFreelancerDetailDynamicallyService } from "../services/freelancerProfileService";

const stripeOnboardingReturnController = async (req, res) => {
    const { shopper_id } = req.params;
    if (shopper_id)
        await updateFreelancerDetailDynamicallyService({ onboardingComplete: true }, { userId: shopper_id });
    
    res.sendFile(path.join(__dirname, "../../public/stripe-onboarding-return.html"));
}

const stripeOnboardingRefreshController = async (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/stripe-onboarding-refresh.html"));
}

export {
    stripeOnboardingReturnController,
    stripeOnboardingRefreshController,
}
