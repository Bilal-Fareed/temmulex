import { Router } from 'express';
import {
  stripeOnboardingReturnController,
  stripeOnboardingRefreshController
} from "../controllers/staticController.js";

const router = Router();

router.get("/return/:shopper_id", stripeOnboardingReturnController);
router.get("/refresh", stripeOnboardingRefreshController);

export default router;