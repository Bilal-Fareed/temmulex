import vine from '@vinejs/vine';

// Signin schema
const contactUsSchema = vine.object({
    full_name: vine.string().maxLength(255),
    email: vine.string().email(),
    message: vine.string().maxLength(1000),
});

export {
    contactUsSchema
}