import { db } from '../../infra/db.js';
import { conversations } from "../models/conversationsModel.js";
import { users } from "../models/usersModel.js";
import { messages } from '../models/messagesModel.js';
import { eq, and, sql, desc } from "drizzle-orm";

const buildWhere = (filters) => {
	return and(
		...Object.entries(filters).map(([key, value]) =>
			eq(conversations[key], value)
		)
	);
};

const getConversationService = async (filters = {}, projection = undefined, options = {}) => {
	return await db.query.conversations.findFirst({
		where: buildWhere(filters),
		...(projection && Object.keys(projection).length > 0 && { columns: projection }),
	});
}

const getUserSpecificConversationListService = async (filters = {}, projection = undefined, options = {}) => {

    const { page, limit } = filters; 

    const offset = (page - 1) * limit;

    const conditions = [
        sql`${conversations.isDeleted} = false`,
    ];

    if (filters?.clientId) conditions.push(eq(conversations.clientId, filters.clientId))
    else if (filters?.freelancerId) conditions.push(eq(conversations.freelancerId, filters.freelancerId))

    const result = await db
        .select({
            conversationUuid: conversations.uuid,
            freelancerId: conversations.freelancerId,
            clientId: conversations.clientId,
            recieverFirstName: users.firstName,
            recieverLastName: users.lastName,
            profilePicture: users.profilePicture,
            messageContent: messages.content,
            attachmentUrl: messages.attachmentUrl,
            isRead: messages.isRead,
            messageCreatedAt: messages.createdAt
        })
        .from(conversations)
        .leftJoin(users, eq(conversations.freelancerId, users.uuid))
        .leftJoin(messages, eq(messages.uuid, sql`(SELECT m.uuid FROM messages m WHERE m.conversation_uuid = ${conversations.uuid} ORDER BY created_at DESC LIMIT 1)`))
        .where(and(...conditions))
        .orderBy(desc(conversations.uuid))
		.limit(limit)
		.offset(offset);

        return result || [];
}

const insertConversationServices = async (conversation = [], options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	return await executor.insert(conversations).values(conversation).returning();
};

const getConversationMessagesService = async (filters = {}, projection = undefined, options = {}) => {

    const { page, limit } = options;
    const { conversationId } = filters;

    const offset = (page - 1) * limit;
    
    return await db
        .select({
            uuid: messages.uuid,
            senderId: messages.senderId,
            conversationId: messages.conversationId,
            isRead: messages.isRead,
            contentType: messages.contenType,
            messageContent: messages.content,
            attachmentUrl: messages.attachmentUrl,
            messageCreatedAt: messages.createdAt
        })
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(desc(messages.createdAt))
        .limit(limit)
        .offset(offset);
}

const addMessageServices = async (messageData = [], options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	await executor.insert(messages).values(messageData);
};

const markMessageAsReadService = async (filters = {}, options = {}) => {
	const { transaction } = options;
	const { recieverId, conversationId } = filters;
	const executor = transaction || db;

	await executor
		.update(messages)
        .set({ isRead: true })
		.where(
			and(
				eq(messages.senderId, recieverId),
				eq(messages.conversationId, conversationId),
			)
		);
};

export {
    addMessageServices,
    getConversationService,
    markMessageAsReadService,
    insertConversationServices,
    getConversationMessagesService,
    getUserSpecificConversationListService,
}