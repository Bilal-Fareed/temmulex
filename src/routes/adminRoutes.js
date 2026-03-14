import { Router } from 'express';
import { authenticateAdminToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
    adminLoginSchema,
    adminSupportListSchema,
    adminClientListSchema,
    adminShopperListSchema,
    adminOrderListSchema,
} from '../schemas/adminSchema.js';
import {
    adminLoginController,
    adminLogoutController,
    adminDashboardController,
    adminOrdersListController,
    adminClientListController,
    adminShoppersListController,
} from '../controllers/adminControllers.js';

const router = Router();

router.post('/login', validate({ body: adminLoginSchema }), adminLoginController);

router.put('/logout', authenticateAdminToken, adminLogoutController);

router.get('/dashboard', authenticateAdminToken, adminDashboardController);

router.get('/clients', authenticateAdminToken, validate({ query: adminClientListSchema }), adminClientListController);

router.get('/shoppers', authenticateAdminToken, validate({ query: adminShopperListSchema }), adminShoppersListController);

router.get('/orders', authenticateAdminToken, validate({ query: adminOrderListSchema }), adminOrdersListController);

router.get('/support', authenticateAdminToken, validate({ query: adminSupportListSchema }), adminOrdersListController);

export default router;
