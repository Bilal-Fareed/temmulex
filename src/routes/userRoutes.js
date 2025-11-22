import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
    signupSchema,
    signinSchema,
    verifyOtpSchema,
    updatePasswordSchema,
    googleAuthSchema,
    commonHeadersSchema,
    sendOtpSchema
} from '../schemas/userSchemas.js';
import {
    userSignupController,
    googleAuthController,
    loginController,
    logoutController,
    updatePasswordController,
    verifyOtpController,
    sendOtpController,
    getUserDetailsController,
} from '../controllers/userControllers.js';

const router = Router();

router.post('/signup', validate({ body: signupSchema, headers: commonHeadersSchema }), userSignupController);

router.post('/login', validate({ body: signinSchema, headers: commonHeadersSchema }), loginController);

router.post('/logout', authenticate, logoutController);

router.post('/verify-otp', validate({ body: verifyOtpSchema }), verifyOtpController);

router.post('/send-otp', validate({ body: sendOtpSchema }), sendOtpController);

router.post('/auth/google', validate({ body: googleAuthSchema, headers: commonHeadersSchema }), googleAuthController);

router.put('/update-password', authenticate, validate({ body: updatePasswordSchema }), updatePasswordController);

router.get('/details', authenticate, getUserDetailsController);

export default router;
