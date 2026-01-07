import multer from 'multer';
import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
    signupSchema,
    signinSchema,
    verifyOtpSchema,
    updatePasswordSchema,
    commonHeadersSchema,
    sendOtpSchema
} from '../schemas/userSchemas.js';
import {
    userSignupController,
    loginController,
    logoutController,
    updatePasswordController,
    verifyOtpController,
    sendOtpController,
    getUserDetailsController,
} from '../controllers/userControllers.js';

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // max file size 5MB
        files: 2, // total files
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'))
        }

        if (!['cv', 'dbs'].includes(file.fieldname)) {
            return cb(new Error('Invalid file field'))
        }

        cb(null, true)
    },
})

router.post('/signup', validate({ body: signupSchema, headers: commonHeadersSchema }), upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'dbs', maxCount: 1 }]), userSignupController);

router.post('/login', validate({ body: signinSchema, headers: commonHeadersSchema }), loginController);

router.post('/logout', authenticate, logoutController);

router.post('/verify-otp', validate({ body: verifyOtpSchema }), verifyOtpController);

router.post('/send-otp', validate({ body: sendOtpSchema }), sendOtpController);

router.put('/update-password', authenticate, validate({ body: updatePasswordSchema }), updatePasswordController);

router.get('/details', authenticate, getUserDetailsController);

export default router;
