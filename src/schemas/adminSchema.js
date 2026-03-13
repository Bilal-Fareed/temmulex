import vine from '@vinejs/vine';

// Signin schema
const adminLoginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string().maxLength(200),
});

export {
    adminLoginSchema,
}