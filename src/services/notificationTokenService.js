import { db } from "../../infra/db.js";
import { notificationTokens } from "../models/notificationTokensModel.js";
import { eq, and } from "drizzle-orm";

const buildWhere = (filters) => {
	return and(
		...Object.entries(filters).map(([key, value]) =>
			eq(users[key], value)
		)
	);
};

const getNotificationTokenService = async (filters = {}, options = {}) => {
    const { transaction } = options;
    const executor = transaction || db;

    return await executor
        .select()
        .from(notificationTokens)
        .where(buildWhere(filters));
}

const addNotificationTokenService = async (data, options = {}) => {
    const { transaction } = options;
    const executor = transaction || db;

    const { token, userId, deviceId, userAgent } = data;

    await executor.insert(notificationTokens).values({
        token: token,
        userId: userId,
        deviceId: deviceId,
        userAgent: userAgent,
    });
}

export {
    getNotificationTokenService,
    addNotificationTokenService,
}