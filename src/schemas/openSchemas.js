import vine from '@vinejs/vine';

// Signin schema
const contactUsSchema = vine.object({
    full_name: vine.string().maxLength(255),
    email: vine.string().email(),
    message: vine.string().maxLength(1000),
});

const sendMessageSchema = vine.object({
    conversationUuid: vine.string(),
    senderId: vine.string(),
    receiverId: vine.string(),
    content: vine.string().optional(),
    attachmentUrl: vine.string().optional()
})


export {
    contactUsSchema,
    sendMessageSchema,
}