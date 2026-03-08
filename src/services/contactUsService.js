import { db } from '../../infra/db.js';
import { contactUs } from "../models/contactUsModel.js";

const insertContactUsQueryServices = async (queries = [], options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	await executor.insert(contactUs).values(queries);
};

export {
    insertContactUsQueryServices,
}