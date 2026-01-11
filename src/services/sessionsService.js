import { db } from "../../infra/db.js";
import sessions from "../models/sessionsModel.js";

const deleteUserSession = async (userUuid) => {
    await db.delete(sessions).where(eq(sessions.userId, userUuid))
}

export {
    deleteUserSession
}