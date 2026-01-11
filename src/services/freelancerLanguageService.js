import { db } from '../../infra/db.js';
import { freelancerLanguages } from "../models/freelancerLanguagesModel.js";

const getFreelancerLanguage = async (freelancerUuid, languageId, options = {}) => {
	return await db.query.freelancerLanguages.findFirst({
		where: and(
			eq(freelancerLanguages.freelancerId, freelancerUuid),
			eq(freelancerLanguages.languageId, languageId)
		)
	});
}

const insertManyFreelancerLanguagesService = async (languages = [], options = {}) => {
	await db.insert(freelancerLanguages).values(languages);
};

export {
	getFreelancerLanguage,
	insertManyFreelancerLanguagesService,
}
