import { db } from '../../infra/db.js';
import { freelancerProfiles } from "../models/freelancerProfilesModel.js";
import { users } from "../models/usersModel.js";
import { languages } from "../models/languagesModel.js";
import { services } from "../models/servicesModel.js";
import { freelancerLanguages } from '../models/freelancerLanguagesModel.js';
import { freelancerServices } from '../models/freelancerServicesModel.js';
import { eq, sql, and } from "drizzle-orm";

const buildWhere = (filters) => {
	return and(
		...Object.entries(filters).map(([key, value]) =>
			eq(users[key], value)
		)
	);
};

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

const updateFreelancerDetailService = async (data, filters = {}, options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	const { location = { lat: 0.0, lng: 0.0 }, cvUrl, dbsUrl } = data

	const [freelancer] = await executor.update(freelancerProfiles).set({
		location: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`,
		resumeLink: cvUrl,
		certificateLink: dbsUrl,
	}).where(...buildWhere(filters));

	return freelancer;

};

/**
 * Get nearby freelancers within a radius
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @param {number} radius Radius in meters
 * @returns {Promise<Array>} Array of user objects with distance
 */
const getNearbyFreelancers = async (filters) => {

	const {
		lat = 0.0,
		lng = 0.0,
		radius = 1000,
		languageIds = [],
		serviceIds = [],
		price_range,
		search_text,
		page = 1,
		limit = 10
	} = filters;

	const offset = (page - 1) * limit;

	const point = `ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;

	const conditions = [
		sql`${freelancerProfiles.isDeleted} = false`,
		sql`${freelancerProfiles.isBlocked} = false`,
		sql`${freelancerProfiles.profileStatus} = 'approved'`,
		sql`ST_DistanceSphere(${freelancerProfiles.location}, ${sql.raw(point)}) <= ${radius}`,
	];

	// Optional language filter
	if (languageIds && languageIds.length > 0) {
		const pgArray = `'{${languageIds.join(",")}}'::uuid[]`;

		conditions.push(
			sql`EXISTS ( SELECT 1 FROM freelancer_languages fl WHERE fl.freelancer_id = ${freelancerProfiles.uuid} AND fl.language_id = ANY(${sql.raw(pgArray)}) AND COALESCE(fl.is_deleted,false)=false )`
		);
	}

	// Optional service filter
	if (serviceIds && serviceIds.length > 0) {
		const pgArray = `'{${serviceIds.join(",")}}'::uuid[]`;

		conditions.push(
			sql`EXISTS ( SELECT 1 FROM freelancer_services fs LEFT JOIN services s ON fs.service_id = s.uuid WHERE fs.freelancer_id = ${freelancerProfiles.uuid} AND fs.service_id = ANY(${sql.raw(pgArray)}) AND COALESCE(fs.is_deleted,false)=false ${sql.raw(price_range ? `AND fixed_price_cents >= ${price_range.starting_price} AND fixed_price_cents <= ${price_range.ending_price}` : '')} )`
		);
	}

	if (search_text){
		conditions.push(
			sql`( ${users.firstName} || ' ' || ${users.lastName} ) ILIKE ${'%' + search_text + '%'}`
		);
	}

	const result = await db
		.select({
			userId: users.uuid,
			firstName: users.firstName,
			lastName: users.lastName,
			email: users.email,
			title: users.title,
			isVerified: users.isVerified,
			country: users.country,
			profilePicture: users.profilePicture,
			profileStatus: freelancerProfiles.profileStatus,
			createdAt: freelancerProfiles.createdAt,
			distance: sql`ST_DistanceSphere(${freelancerProfiles.location}, ${sql.raw(point)})`,
			languages: sql`COALESCE(( SELECT json_agg(DISTINCT l.name) FROM freelancer_languages fl JOIN languages l ON l.uuid = fl.language_id WHERE fl.freelancer_id = ${freelancerProfiles.uuid} AND COALESCE(fl.is_deleted,false)=false ), '[]')`,
			services: sql`COALESCE(( SELECT json_agg(DISTINCT jsonb_build_object('description', fs.description, 'title', fs.title, 'name', s.name, 'fixed_price_cents', fs.fixed_price_cents, 'currency', fs.currency, 'service_type', s.service_type, 'uuid', s.uuid)) FROM freelancer_services fs JOIN services s ON s.uuid = fs.service_id WHERE fs.freelancer_id = ${freelancerProfiles.uuid} AND COALESCE(fs.is_deleted,false)=false ), '[]')`,
		})
		.from(users)
		.innerJoin(freelancerProfiles, eq(users.uuid, freelancerProfiles.userId))
		.where(and(...conditions))
		.limit(limit)
		.offset(offset);

	return result;
}

const getFreelancerDetails = async (uuid) => {

	const result = await db
		.select({
			userId: users.uuid,
			firstName: users.firstName,
			lastName: users.lastName,
			email: users.email,
			phone: users.phone,
			title: users.title,
			isVerified: users.isVerified,
			country: users.country,
			profilePicture: users.profilePicture,
			resumeLink: freelancerProfiles.resumeLink,
			certificateLink: freelancerProfiles.certificateLink,
			profileStatus: freelancerProfiles.profileStatus,
			createdAt: freelancerProfiles.createdAt,
			languages: sql`COALESCE(( SELECT json_agg(DISTINCT jsonb_build_object('name', l.name, 'uuid', l.uuid)) FROM freelancer_languages fl JOIN languages l ON l.uuid = fl.language_id WHERE fl.freelancer_id = ${freelancerProfiles.uuid} AND COALESCE(fl.is_deleted,false)=false ), '[]')`,
			services: sql`COALESCE(( SELECT json_agg(DISTINCT jsonb_build_object('description', fs.description, 'title', fs.title, 'name', s.name, 'fixed_price_cents', fs.fixed_price_cents, 'currency', fs.currency, 'service_type', s.service_type, 'uuid', s.uuid)) FROM freelancer_services fs JOIN services s ON s.uuid = fs.service_id WHERE fs.freelancer_id = ${freelancerProfiles.uuid} AND COALESCE(fs.is_deleted,false)=false ), '[]')`,
		})
		.from(users)
		.innerJoin(freelancerProfiles, eq(users.uuid, freelancerProfiles.userId))
		.where(eq(freelancerProfiles.userId, uuid))

	return result;
}

export {
	insertFreelancerDetailService,
	getFreelancerProfileDetailByUserUuid,
	getNearbyFreelancers,
	getFreelancerDetails,
	updateFreelancerDetailService,
}