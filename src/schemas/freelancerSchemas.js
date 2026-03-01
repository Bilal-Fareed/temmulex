import vine from '@vinejs/vine';

const addServiceSchema = vine.object({
    serviceId: vine.string().uuid({ version: [4] }),
    title: vine.string().maxLength(255).minLength(3),
    fixedPriceCents: vine.number(),
    description: vine.string(),
    currency: vine.string().minLength(3).maxLength(5).regex(/[A-Z]/, "Currency must contain capital alphabets"),
});

const updateServiceSchema = vine.object({
    serviceId: vine.string().uuid({ version: [4] }),
    title: vine.string().maxLength(255).minLength(3).optional(),
    fixedPriceCents: vine.number().optional(),
    description: vine.string().optional(),
});

const deleteServiceSchema = vine.object({
    service_id: vine.string().uuid({ version: [4] }),
});

const updateFreelancerProfileSchema = vine.object({
    profile_picture_url: vine.string().url(),
    title: vine.string().minLength(2).maxLength(20),
    first_name: vine.string().minLength(2).maxLength(100),
    last_name: vine.string().minLength(2).maxLength(100),
    email: vine.string().email(),
    phone: vine.string().minLength(2).maxLength(50),
    dob: vine.date({ formats: ['DD/MM/YYYY', 'x'] }),
    country: vine.string().minLength(2).maxLength(100),
    cv_url: vine.string().url(),
    dbs_url: vine.string().url(),
    location: vine.object({ lat: vine.number().min(-90).max(90), lng: vine.number().min(-180).max(180) }),
    languages: vine.array(vine.string().uuid({ version: [4] })),
    otp: vine.string().regex(/^\d{4}$/, "OTP must contain only digits").optional(),
});

// get my orders list schema
const getMyOrdersSchema = vine.object({
    order_status: vine.enum(['ongoing', 'completed']),
    page: vine.number().min(1).max(1000).optional(),
    limit: vine.number().min(1).max(100).optional(),
});

const completeOrderSchema = vine.object({
    order_id: vine.string().uuid({ version: [4] }),
});

export {
    addServiceSchema,
    getMyOrdersSchema,
    completeOrderSchema,
    updateServiceSchema,
    deleteServiceSchema,
    updateFreelancerProfileSchema,
}