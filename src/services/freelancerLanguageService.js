import { db } from '../../infra/db.js';
import { freelancerLanguages } from "../models/freelancerLanguagesModel.js";
import { eq, and } from "drizzle-orm";

const buildWhere = (filters) => {
	return and(
		...Object.entries(filters).map(([key, value]) =>
			eq(users[key], value)
		)
	);
};

const getFreelancerLanguage = async (freelancerUuid, languageId, options = {}) => {
	return await db.query.freelancerLanguages.findFirst({
		where: and(
			eq(freelancerLanguages.freelancerId, freelancerUuid),
			eq(freelancerLanguages.languageId, languageId)
		)
	});
}

const deleteFreelancersLanguage = async (filters = {}, options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	return await executor.delete(freelancerLanguages).where(...buildWhere(filters)).returning();;
};

const insertManyFreelancerLanguagesService = async (languages = [], options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	await executor.insert(freelancerLanguages).values(languages);
};

export {
	getFreelancerLanguage,
	deleteFreelancersLanguage,
	insertManyFreelancerLanguagesService,
}
