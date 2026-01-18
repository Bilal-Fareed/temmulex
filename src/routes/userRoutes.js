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
    sendOtpSchema
} from '../schemas/userSchemas.js';
import {
    userSignupController,
    loginController,
    logoutController,
    forgotPasswordController,
    updatePasswordController,
    verifyOtpController,
    sendOtpController,
    getUserDetailsController,
} from '../controllers/userControllers.js';

const router = Router();

router.post('/signup', multerHandler, parseMultipartJSON(['languages', 'location', 'services']), validate({ body: signupSchema, headers: commonHeadersSchema }), authenticateTemporaryToken, userSignupController);

router.post('/login', validate({ body: signinSchema, headers: commonHeadersSchema }), loginController);

router.post('/logout', authenticate, logoutController);

router.post('/verify-otp', validate({ body: verifyOtpSchema }), verifyOtpController);

router.post('/send-otp', validate({ body: sendOtpSchema }), sendOtpController);

router.put('/forgot-password', validate({ body: forgotPasswordSchema }), authenticateTemporaryToken, forgotPasswordController);

router.put('/update-password', validate({ body: updatePasswordSchema }), authenticate, updatePasswordController);

router.get('/details', authenticate, getUserDetailsController);

export default router;
