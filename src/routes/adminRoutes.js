import { Router } from 'express';
import { authenticateAdminToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
    adminLoginSchema,
} from '../schemas/adminSchema.js';
import {
    adminLoginController,
    adminLogoutController,
    adminDashboardController,
} from '../controllers/adminControllers.js';

const router = Router();

router.post('/login', validate({ body: adminLoginSchema }), adminLoginController);

router.post('/logout', authenticateAdminToken, adminLogoutController);

router.get('/dashboard', authenticateAdminToken, adminDashboardController);

export default router;
