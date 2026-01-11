import { db } from '../../infra/db.js';
import freelancerProfiles from "../models/freelancerProfilesModel.js";

const insertFreelancerDetailService = async (data, options = {}) => {

	const { userId, lat, lng, cvUrl, dbsUrl } = data

	await db.insert(freelancerProfiles).values({
		userId: userId,
		location: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`,
		resumeLink: cvUrl,
		certificateLink: dbsUrl,
	});
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