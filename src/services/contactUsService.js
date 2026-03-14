import { db } from '../../infra/db.js';
import { contactUs } from "../models/contactUsModel.js";

const insertContactUsQueryServices = async (queries = [], options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	await executor.insert(contactUs).values(queries);
};

const getSupportListService = async (filters) => {

	const {
		page = 1,
		limit = 10,
		ticket_status,
		search_text,
	} = filters;

	const offset = (page - 1) * limit;

	const conditions = [];

	if (search_text){
		conditions.push(
			sql`(${contactUs.uuid}) ILIKE ${'%' + search_text + '%'}`
		);
	}

	switch (ticket_status) {
		case 'pending':
			conditions.push(eq(contactUs.isResolved, false));
			break;
		case 'resolved':
			conditions.push(eq(contactUs.isResolved, true));
			break;
	}

	const result = await db
		.select({
			uuid: contactUs.uuid,
			email: contactUs.email,
			message: contactUs.message,
			fullName: contactUs.fullName,
			isDeleted: contactUs.isDeleted,
			createdAt: contactUs.createdAt,
			updatedAt: contactUs.updatedAt,
			isResolved: contactUs.isResolved,
		})
		.from(contactUs)
		.where(and(...conditions))
		.limit(limit)
		.offset(offset);

	return result;
}

export {
	getSupportListService,
    insertContactUsQueryServices,
}