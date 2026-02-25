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
    user_type: vine.enum(['client', 'freelancer']),
});

// Signup schema
const signupSchema = vine.object({
    user_type: vine.enum(['client', 'freelancer']),
    email: vine.string().email(),
    password: passwordSchema,
    title: vine.string().minLength(2).maxLength(20),
    first_name: vine.string().minLength(2).maxLength(100),
    last_name: vine.string().minLength(2).maxLength(100),
    country: vine.string().minLength(2).maxLength(100),
    dob: vine.date({ formats: ['DD/MM/YYYY', 'x'] }),
    phone: vine.string().minLength(2).maxLength(50),
    languages: vine.array(vine.string().uuid({ version: [4] })).optional().requiredWhen('user_type', '=', 'freelancer'),
    location: vine.object({ lat: vine.number().min(-90).max(90), lng: vine.number().min(-180).max(180) }).optional().requiredWhen('user_type', '=', 'freelancer'),
    services: vine.array(vine.object({
        serviceId: vine.string().uuid({ version: [4] }),
        fixedPriceCents: vine.number(),
        currency: vine.string().minLength(3).maxLength(5).regex(/[A-Z]/, "Currency must contain capital alphabets"),
    })).optional().requiredWhen('user_type', '=', 'freelancer'),
});

// Update User Profile Schema
const updateUserProfileSchema = vine.object({
    title: vine.string().minLength(2).maxLength(20),
    first_name: vine.string().minLength(2).maxLength(100),
    last_name: vine.string().minLength(2).maxLength(100),
    email: vine.string().email(),
    phone: vine.string().minLength(2).maxLength(50),
    country: vine.string().minLength(2).maxLength(100),
    dob: vine.date({ formats: ['DD/MM/YYYY', 'x'] }),
    profile_picture: vine.string().url(),
    otp: vine.string().regex(/^\d{4}$/, "OTP must contain only digits").optional(),
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
const forgotPasswordSchema = vine.object({
    password: passwordSchema,
});

// Update password schema
const updatePasswordSchema = vine.object({
    old_password: vine.string().minLength(8, "Password must be at least 8 characters long").maxLength(200, "Password length is too long"),
    new_password: passwordSchema,
});

// Common headers schema
const commonHeadersSchema = vine.object({
    'x-device-id': vine.string(),
    'x-user-agent': vine.enum(['android', 'ios'])
});

// nearby top rated shoppers schema
const nearbyTopRatedShopperSchema = vine.object({
    lat: vine.number().min(-90).max(90),
    lng: vine.number().min(-180).max(180),
    radius: vine.number().min(10).max(1000000).optional(), // distance in meter
    services: vine.unionOfTypes([
        vine.string().uuid({ version: [4] }),
        vine.array(vine.string().uuid({ version: [4] })),
    ]).optional(),
    languages: vine.unionOfTypes([
        vine.string().uuid({ version: [4] }),
        vine.array(vine.string().uuid({ version: [4] })),
    ]).optional(),
    price_range: vine.unionOfTypes([
        vine.object({
            starting_price: vine.number().min(0).max(10000),
            ending_price: vine.number().min(0).max(10000),
        }),
        vine.string().minLength(0).maxLength(1000),
    ]).optional(),
    search_text: vine.string().minLength(0).maxLength(1000).optional(),
    page: vine.number().min(1).max(1000).optional(),
    limit: vine.number().min(1).max(100).optional(),
}); 

// get my orders list schema
const getMyOrdersSchema = vine.object({
    order_status: vine.enum(['ongoing', 'completed']),
    page: vine.number().min(1).max(1000).optional(),
    limit: vine.number().min(1).max(100).optional(),
}); 

// place order schema
const placeOrderSchema = vine.object({
    freelancer_id: vine.string().uuid({ version: [4] }),
    service_id: vine.string().uuid({ version: [4] }),
}); 

export {
    passwordSchema,
    signinSchema,
    signupSchema,
    verifyOtpSchema,
    sendOtpSchema,
    forgotPasswordSchema,
    nearbyTopRatedShopperSchema,
    updatePasswordSchema,
    commonHeadersSchema,
    getMyOrdersSchema,
    placeOrderSchema,
    updateUserProfileSchema,
};
