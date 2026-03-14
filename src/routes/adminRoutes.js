import { Router } from 'express';
import { authenticateAdminToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
    adminLoginSchema,
    adminClientListSchema,
} from '../schemas/adminSchema.js';
import {
    adminLoginController,
    adminLogoutController,
    adminDashboardController,
    adminClientListController,
} from '../controllers/adminControllers.js';

const router = Router();

router.post('/login', validate({ body: adminLoginSchema }), adminLoginController);

router.put('/logout', authenticateAdminToken, adminLogoutController);

router.get('/dashboard', authenticateAdminToken, adminDashboardController);

router.get('/clients', authenticateAdminToken, validate({ query: adminClientListSchema }), adminClientListController);

export default router;
