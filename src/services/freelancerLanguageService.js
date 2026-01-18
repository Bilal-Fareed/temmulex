import { db } from '../../infra/db.js';
import { freelancerLanguages } from "../models/freelancerLanguagesModel.js";
import { eq, and } from "drizzle-orm";

const getFreelancerLanguage = async (freelancerUuid, languageId, options = {}) => {
	return await db.query.freelancerLanguages.findFirst({
		where: and(
			eq(freelancerLanguages.freelancerId, freelancerUuid),
			eq(freelancerLanguages.languageId, languageId)
		)
	});
}

const insertManyFreelancerLanguagesService = async (languages = [], options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	await executor.insert(freelancerLanguages).values(languages);
};

export {
	getFreelancerLanguage,
	insertManyFreelancerLanguagesService,
}
