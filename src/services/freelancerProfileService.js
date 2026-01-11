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

export {
  insertFreelancerDetailService
}