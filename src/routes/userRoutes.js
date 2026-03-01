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

router.post('/signup', multerHandler, parseMultipartJSON(['languages', 'location', 'services']), validate({ body: signupSchema }), authenticateTemporaryToken, userSignupController);

router.post('/upload', multerHandler, authenticate, uploadFileController);

router.post('/login', validate({ body: signinSchema, headers: commonHeadersSchema }), loginController);

router.post('/logout', authenticate, logoutController);

router.put('/delete-account', authenticate, deleteAccountController);

router.post('/verify-otp', validate({ body: verifyOtpSchema }), verifyOtpController);

router.post('/send-otp', validate({ body: sendOtpSchema }), sendOtpController);

router.put('/forgot-password', validate({ body: forgotPasswordSchema }), authenticateTemporaryToken, forgotPasswordController);

router.put('/update-password', validate({ body: updatePasswordSchema }), authenticate, updatePasswordController);

router.put('/update-profile', validate({ body: updateUserProfileSchema }), authenticate, updateUserProfileController);

router.get('/my-profile', authenticate, getMyProfileController);

router.get('/top-rated/nearby', validate({ query: nearbyTopRatedShopperSchema }), authenticate, getNearbyTopRatedShoppersController);

router.get('/my-order', validate({ query: getMyOrdersSchema }), authenticate, getMyOrdersController);

router.post('/place-order', validate({ body: placeOrderSchema }), authenticate, placeOrderController);

router.post('/booking/feedback', validate({ body: orderFeedbackSchema }), authenticate, orderFeedbackController);

export default router;
