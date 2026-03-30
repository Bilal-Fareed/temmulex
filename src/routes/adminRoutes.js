import { Router } from 'express';
import { authenticateAdminToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
    adminLoginSchema,
    adminBlockUserSchema,
    adminSupportListSchema,
    adminUpdateOrderSchema,
    adminPaymentListSchema,
    adminClientListSchema,
    adminShopperListSchema,
    adminGetShopperDetailsSchema,
    adminOrderListSchema,
    adminGetUserDetailsSchema,
    adminGetOrderDetailsSchema,
    adminResolveSupportTicketSchema,
    adminRefundOrDisbursePaymentSchema,
} from '../schemas/adminSchema.js';
import {
    adminLoginController,
    adminLogoutController,
    refundPaymentController,
    adminBlockUserController,
    adminDashboardController,
    disbursePaymentController,
    adminOrdersListController,
    adminClientListController,
    adminPaymentListController,
    adminUpdateOrderController,
    adminSupportListController,
    adminShoppersListController,
    adminGetOrderDetailController,
    adminGetClientDetailController,
    adminGetShopperDetailController,
    adminResolveSupportTicketController,
} from '../controllers/adminControllers.js';

const router = Router();

router.post('/login', validate({ body: adminLoginSchema }), adminLoginController);

router.put('/logout', authenticateAdminToken, adminLogoutController);

router.get('/dashboard', authenticateAdminToken, adminDashboardController);

router.get('/clients', authenticateAdminToken, validate({ query: adminClientListSchema }), adminClientListController);

router.get('/client/details/:user_id', authenticateAdminToken, validate({ params: adminGetUserDetailsSchema }), adminGetClientDetailController);

router.put('/block-user/:user_id', authenticateAdminToken, validate({ params: adminBlockUserSchema }), adminBlockUserController);

router.get('/shoppers', authenticateAdminToken, validate({ query: adminShopperListSchema }), adminShoppersListController);

router.get('/shopper/details/:shopper_id', authenticateAdminToken, validate({ params: adminGetShopperDetailsSchema }), adminGetShopperDetailController);

router.get('/orders', authenticateAdminToken, validate({ query: adminOrderListSchema }), adminOrdersListController);

router.get('/order/details/:order_id', authenticateAdminToken, validate({ params: adminGetOrderDetailsSchema }), adminGetOrderDetailController);

router.get('/payments', authenticateAdminToken, validate({ query: adminPaymentListSchema }), adminPaymentListController);

router.post('/refund/payment/:order_id', authenticateAdminToken, validate({ params: adminRefundOrDisbursePaymentSchema }), refundPaymentController);

router.post('/disburse/payment/:order_id', authenticateAdminToken, validate({ params: adminRefundOrDisbursePaymentSchema }), disbursePaymentController);

router.put('/update/order', authenticateAdminToken, validate({ body: adminUpdateOrderSchema }), adminUpdateOrderController);

router.get('/support', authenticateAdminToken, validate({ query: adminSupportListSchema }), adminSupportListController);

router.put('/resolve/ticket/:ticket_no', authenticateAdminToken, validate({ params: adminResolveSupportTicketSchema }), adminResolveSupportTicketController);

export default router;
