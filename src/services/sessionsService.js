import { db } from "../../infra/db.js";
import sessions from "../models/sessionsModel.js";

const deleteSessionByTokenId = async (tokenId) => {
  await db.delete(sessions).where(eq(sessions.tokenId, tokenId))
}

const deleteUserSessionByUserId = async (userUuid) => {
  await db.delete(sessions).where(eq(sessions.userId, userUuid))
}

const getUserSessionForAuth = async (data) => {
  const { tokenId, deviceId, userUuid, userType, revoked } = data
  await db
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

const insertUserSession = async (data) => {
  const {tokenId, userUuid, deviceId, userAgent, userType} = data
  await db.insert(sessions).values({
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