import vine from '@vinejs/vine';

// Signin schema
const adminLoginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string().maxLength(200),
});

const adminClientListSchema = vine.object({
    profile_status: vine.enum(['active', 'inactive', 'blocked']).optional(),
    search_text: vine.string().minLength(0).maxLength(1000).optional(),
    page: vine.number().min(1).max(1000).optional(),
    limit: vine.number().min(1).max(100).optional(),
}); 

export {
    adminLoginSchema,
    adminClientListSchema,
}