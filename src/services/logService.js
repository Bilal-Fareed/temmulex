import { db } from '../../infra/db.js';
import { paymentEventLogs } from "../models/paymentEventLogsModel.js";

const insertConversationServices = async (paymentLogs = [], options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	return await executor.insert(paymentEventLogs).values(paymentLogs).returning();
};

export {
    insertConversationServices,
}