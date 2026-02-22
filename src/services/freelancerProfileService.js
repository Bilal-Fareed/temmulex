import { db } from '../../infra/db.js';
import { freelancerProfiles } from "../models/freelancerProfilesModel.js";
import { users } from "../models/usersModel.js";
import { eq, sql } from "drizzle-orm";

const insertFreelancerDetailService = async (data, options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	const { userId, lat, lng, cvUrl, dbsUrl } = data

	const [freelancer] = await executor.insert(freelancerProfiles).values({
		userId: userId,
		location: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`,
		resumeLink: cvUrl,
		certificateLink: dbsUrl,
	}).returning({
		uuid: freelancerProfiles.uuid,
		userId: freelancerProfiles.userId,
		location: freelancerProfiles.location,
		resumeLink: freelancerProfiles.resumeLink,
		certificateLink: freelancerProfiles.certificateLink,
		profileStatus: freelancerProfiles.profileStatus,
		isBlocked: freelancerProfiles.isBlocked
	});

	return freelancer;

};

const getFreelancerProfileDetailByUserUuid = async (userUuid) => {
	return await db.query.freelancerProfiles.findFirst({
		where: eq(freelancerProfiles.userId, userUuid),
	});
}


/**
 * Get nearby freelancers within a radius
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @param {number} radius Radius in meters
 * @returns {Promise<Array>} Array of user objects with distance
 */
const getNearbyFreelancers = async (lat, lng, radius, page, limit) => {
	// Create PostGIS point
	const point = `ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;

	const result = await db
		.select({
			userId: users.uuid,
			firstName: users.firstName,
			lastName: users.lastName,
			email: users.email,
			title: users.title,
			isVerified: users.isVerified,
			country: users.country,
			profileStatus: freelancerProfiles.profileStatus,
			isBlocked: freelancerProfiles.isBlocked,
			distance: sql`ST_DistanceSphere(${freelancerProfiles.location}, ${sql.raw(point)})`,
		})
		.from(users)
		.innerJoin(freelancerProfiles, eq(users.uuid, freelancerProfiles.userId))
		.where(sql`${freelancerProfiles.isDeleted} = false`)
		.where(sql`${freelancerProfiles.isBlocked} = false`)
		.where(sql`${freelancerProfiles.profileStatus} = 'approved'`)
		.where(
			sql`ST_DistanceSphere(${freelancerProfiles.location}, ${sql.raw(
				point
			)}) <= ${radius}`
		)
		// .orderBy(sql`distance`);

	return result;
}

export {
	insertFreelancerDetailService,
	getFreelancerProfileDetailByUserUuid,
	getNearbyFreelancers,
}