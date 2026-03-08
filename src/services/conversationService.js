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

const getConversationListService = async (filters = {}, projection = undefined, options = {}) => {
	return await db.query.conversations.find({
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
            recieverFirstName: users.firstName,
            recieverLastName: users.lastName,
            freelancerAvatar: users.profilePicture,
            messageContent: messages.content,
            attachmentUrl: messages.attachmentUrl,
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

	await executor.insert(conversations).values(conversation);
};

export {
    insertConversationServices,
    getConversationListService,
    getUserSpecificConversationListService,
}