import { Router } from 'express';
import {
  appOnboardingReturnController,
  stripeOnboardingReturnController,
  stripeOnboardingRefreshController
} from "../controllers/staticController.js";

const router = Router();

router.get("/return/:shopper_id", stripeOnboardingReturnController);

router.put("/return", appOnboardingReturnController);

router.get("/return", stripeOnboardingReturnController);

router.get("/refresh", stripeOnboardingRefreshController);

export default router;