import { db } from '../../infra/db.js';
import { freelancerServices } from "../models/freelancerServicesModel.js";
import { eq, and } from "drizzle-orm";

const getFreelancerServices = async (freelancerUuid, serviceUuid, options = {}) => {
	return await db.query.freelancerServices.findFirst({
		where: and(
			eq(freelancerServices.freelancerId, freelancerUuid),
			eq(freelancerServices.serviceId, serviceUuid)
		)
	});
}

const insertManyFreelancerServices = async (services = [], options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	await executor.insert(freelancerServices).values(services);
};

export {
	getFreelancerServices,
	insertManyFreelancerServices,
}