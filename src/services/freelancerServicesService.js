import { db } from '../../infra/db.js';
import freelancerServices from "../models/freelancerServicesModel.js";

const getFreelancerLanguage = async (freelancerUuid, languageId, options = {}) => {
	return await db.query.freelancerServices.findFirst({
		where: and(
			eq(freelancerServices.freelancerId, freelancerUuid),
			eq(freelancerServices.languageId, languageId)
		)
	});
}

const insertManyFreelancerServicesService = async (services = [], options = {}) => {
	await db.insert(freelancerServices).values(services);
};

export {
	getFreelancerLanguage,
	insertManyFreelancerServicesService,
}