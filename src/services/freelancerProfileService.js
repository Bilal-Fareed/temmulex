import { db } from '../../infra/db.js';
import { freelancerProfiles } from "../models/freelancerProfilesModel.js";
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

export {
	insertFreelancerDetailService,
	getFreelancerProfileDetailByUserUuid
}