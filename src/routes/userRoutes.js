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
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 3, // cv, dbs, profile_picture
    },
    fileFilter: (req, file, cb) => {
        const { fieldname, mimetype } = file;

        // PDF fields
        if (fieldname === "cv" || fieldname === "dbs") {
            if (mimetype !== "application/pdf") {
                return cb(new Error(`${fieldname} must be a PDF file`));
            }
            return cb(null, true);
        }

        // Profile picture (images only)
        if (fieldname === "profile_picture") {
            const allowedImageTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ];

            if (!allowedImageTypes.includes(mimetype)) {
                return cb(new Error("Profile picture must be an image (jpg, png, webp)"));
            }

            return cb(null, true);
        }

        // Any other field is invalid
        return cb(new Error("Invalid file field"));
    },
});

router.post('/signup', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'dbs', maxCount: 1 }, { name: 'profile_picture', maxCount: 1 }]), validate({ body: signupSchema, headers: commonHeadersSchema }), userSignupController);

router.post('/login', validate({ body: signinSchema, headers: commonHeadersSchema }), loginController);

router.post('/logout', authenticate, logoutController);

router.post('/verify-otp', validate({ body: verifyOtpSchema }), verifyOtpController);

router.post('/send-otp', validate({ body: sendOtpSchema }), sendOtpController);

router.put('/update-password', authenticate, validate({ body: updatePasswordSchema }), updatePasswordController);

router.get('/details', authenticate, getUserDetailsController);

export default router;
