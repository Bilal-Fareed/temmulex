import { db } from "../../infra/db.js";
import { sessions } from "../models/sessionsModel.js";
import { eq, and } from "drizzle-orm";

const deleteSessionByTokenId = async (tokenId, options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	await executor.delete(sessions).where(eq(sessions.tokenId, tokenId))
}

const deleteUserSessionByUserId = async (userUuid, options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	await executor.delete(sessions).where(eq(sessions.userId, userUuid))
}

const getUserSessionForAuth = async (data, options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;
	
	const { tokenId, deviceId, userUuid, userType, revoked } = data
	await executor
		.select()
		.from(sessions)
		.where(
			and(
				eq(sessions.tokenId, tokenId),
				eq(sessions.deviceId, deviceId),
				eq(sessions.userId, userUuid),
				eq(sessions.userType, userType),
				eq(sessions.revoked, revoked)
			)
		);
}

const insertUserSession = async (data, options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	const { tokenId, userUuid, deviceId, userAgent, userType } = data
	await executor.insert(sessions).values({
		tokenId: tokenId,
		userId: userUuid,
		deviceId: deviceId,
		userAgent: userAgent,
		userType: userType,
	});
}

export {
	deleteUserSessionByUserId,
	getUserSessionForAuth,
	insertUserSession,
	deleteSessionByTokenId,
}