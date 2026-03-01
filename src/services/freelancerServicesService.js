import { db } from '../../infra/db.js';
import { freelancerServices } from "../models/freelancerServicesModel.js";
import { eq, and, sql } from "drizzle-orm";

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

const deleteFreelancerServices = async (filter = {}, options = {}) => {
	const { transaction } = options;
	const { service_id, freelancer_id } = filter;
	const executor = transaction || db;

	return await executor.delete(freelancerServices).where(
		and(
			eq(freelancerServices.freelancerId, freelancer_id),
			eq(freelancerServices.serviceId, service_id)
		)
	).returning();;
};

const updateFreelancerService = async (filters = {}, updatedObject = {}, options = {}) => {
	const { transaction } = options;
	const { freelancerId, serviceId } = filters;
	const executor = transaction || db;

	await executor
		.update(freelancerServices)
		.set(updatedObject)
		.where(
			and(
				eq(freelancerServices.freelancerId, freelancerId),
				eq(freelancerServices.serviceId, serviceId),
			)
		);
};


export {
	getFreelancerServices,
	updateFreelancerService,
	deleteFreelancerServices,
	insertManyFreelancerServices,
}