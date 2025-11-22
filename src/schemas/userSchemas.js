import vine from '@vinejs/vine';

// Password schema
const passwordSchema = vine.string()
    .minLength(8, "Password must be at least 8 characters long")
    .maxLength(200, "Password length is too long")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

// Signin schema
const signinSchema = vine.object({
    email: vine.string().email(),
    password: vine.string().maxLength(200),
});

// Signup schema
const signupSchema = vine.object({
    name: vine.string(),
    email: vine.string().email(),
    password: passwordSchema,
});

// Verify OTP schema
const verifyOtpSchema = vine.object({
    email: vine.string().email(),
    intent: vine.enum(['PASSWORD_UPDATE', 'EMAIL_VERIFICATION']).optional(),
    otp: vine.string().regex(/^\d{4}$/, "OTP must contain only digits"),
});

// Send OTP schema
const sendOtpSchema = vine.object({
    email: vine.string().email(),
});

// Update password schema
const updatePasswordSchema = vine.object({
    password: passwordSchema,
});

// Google Auth schema
const googleAuthSchema = vine.object({
    email: vine.string().email(),
    googleId: vine.string(),
});

// Common headers schema
const commonHeadersSchema = vine.object({
    'x-device-id': vine.string(),
    'x-user-agent': vine.enum(['android', 'ios'])
});

export {
    passwordSchema,
    signinSchema,
    signupSchema,
    verifyOtpSchema,
    sendOtpSchema,
    updatePasswordSchema,
    googleAuthSchema,
    commonHeadersSchema,
};
