import { Router } from 'express';
import { authenticateAdminToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
    adminLoginSchema,
    adminClientListSchema,
    adminShopperListSchema,
} from '../schemas/adminSchema.js';
import {
    adminLoginController,
    adminLogoutController,
    adminDashboardController,
    adminClientListController,
    adminShoppersListController,
} from '../controllers/adminControllers.js';

const router = Router();

router.post('/login', validate({ body: adminLoginSchema }), adminLoginController);

router.put('/logout', authenticateAdminToken, adminLogoutController);

router.get('/dashboard', authenticateAdminToken, adminDashboardController);

router.get('/clients', authenticateAdminToken, validate({ query: adminClientListSchema }), adminClientListController);

router.get('/shoppers', authenticateAdminToken, validate({ query: adminShopperListSchema }), adminShoppersListController);

export default router;
