import { Router } from 'express';
import { multerHandler } from '../middlewares/multerMiddleware.js';
import { authenticate, authenticateTemporaryToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { parseMultipartJSON } from '../middlewares/multipartJsonParserMiddleware.js'; 
import {
    signupSchema,
    signinSchema,
    verifyOtpSchema,
    forgotPasswordSchema,
    updatePasswordSchema,
    commonHeadersSchema,
    getMyOrdersSchema,
    placeOrderSchema,
    updateUserProfileSchema,
    orderFeedbackSchema,
    nearbyTopRatedShopperSchema,
    sendOtpSchema
} from '../schemas/userSchemas.js';
import {
    userSignupController,
    loginController,
    logoutController,
    forgotPasswordController,
    updatePasswordController,
    verifyOtpController,
    updateUserProfileController,
    uploadFileController,
    getMyOrdersController,
    orderFeedbackController,
    deleteAccountController,
    sendOtpController,
    getNearbyTopRatedShoppersController,
    getMyProfileController,
    placeOrderController,
} from '../controllers/userControllers.js';

const router = Router();

router.post('/signup', multerHandler, parseMultipartJSON(['languages', 'location', 'services']), authenticateTemporaryToken, validate({ body: signupSchema, headers: commonHeadersSchema }), userSignupController);

router.post('/upload', multerHandler, authenticate, uploadFileController);

router.post('/login', validate({ body: signinSchema, headers: commonHeadersSchema }), loginController);

router.post('/logout', authenticate, logoutController);

router.put('/delete-account', authenticate, deleteAccountController);

router.post('/verify-otp', validate({ body: verifyOtpSchema }), verifyOtpController);

router.post('/send-otp', validate({ body: sendOtpSchema }), sendOtpController);

router.put('/forgot-password', authenticateTemporaryToken, validate({ body: forgotPasswordSchema }), forgotPasswordController);

router.put('/update-password', authenticate, validate({ body: updatePasswordSchema }), updatePasswordController);

router.put('/update-profile', authenticate, validate({ body: updateUserProfileSchema }), updateUserProfileController);

router.get('/my-profile', authenticate, getMyProfileController);

router.get('/top-rated/nearby', authenticate, validate({ query: nearbyTopRatedShopperSchema }), getNearbyTopRatedShoppersController);

router.get('/my-orders', authenticate, validate({ query: getMyOrdersSchema }), getMyOrdersController);

router.post('/place-order', authenticate, validate({ body: placeOrderSchema }), placeOrderController);

router.post('/booking/feedback', authenticate, validate({ body: orderFeedbackSchema }), orderFeedbackController);

export default router;
