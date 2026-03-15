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

const adminShopperListSchema = vine.object({
    profile_status: vine.enum(['pending', 'approved', 'rejected']).optional(),
    search_text: vine.string().minLength(0).maxLength(1000).optional(),
    page: vine.number().min(1).max(1000).optional(),
    limit: vine.number().min(1).max(100).optional(),
}); 

const adminOrderListSchema = vine.object({
    order_status: vine.enum(['pending', 'ongoing', 'completed', 'disputed']).optional(),
    search_text: vine.string().minLength(0).maxLength(1000).optional(),
    page: vine.number().min(1).max(1000).optional(),
    limit: vine.number().min(1).max(100).optional(),
}); 

const adminSupportListSchema = vine.object({
    ticket_status: vine.enum(['pending', 'ongoing', 'completed', 'disputed']).optional(),
    search_text: vine.string().minLength(0).maxLength(1000).optional(),
    page: vine.number().min(1).max(1000).optional(),
    limit: vine.number().min(1).max(100).optional(),
}); 

const adminResolveSupportTicketSchema = vine.object({
    ticket_no: vine.string().uuid(),
}); 

const adminGetUserDetailsSchema = vine.object({
    user_id: vine.string().uuid(),
}); 

const adminGetShopperDetailsSchema = vine.object({
    shopper_id: vine.string().uuid(),
}); 

const adminGetOrderDetailsSchema = vine.object({
    order_id: vine.string().uuid(),
}); 

export {
    adminLoginSchema,
    adminOrderListSchema,
    adminClientListSchema,
    adminShopperListSchema,
    adminSupportListSchema,
    adminGetUserDetailsSchema,
    adminGetOrderDetailsSchema,
    adminGetShopperDetailsSchema,
    adminResolveSupportTicketSchema,
}