import { db } from "../../infra/db.js";
import { users } from "../models/usersModel.js";
import { freelancerProfiles } from "../models/freelancerProfilesModel.js";
import { eq, and, sql } from "drizzle-orm";

const buildWhere = (filters) => {
	return and(
		...Object.entries(filters).map(([key, value]) =>
			eq(users[key], value)
		)
	);
};

const getUserService = async (filters = {}, projection = undefined, options = {}) => {
	return await db.query.users.findFirst({
		where: buildWhere(filters),
		...(projection && Object.keys(projection).length > 0 && { columns: projection }),
	});
}

const getUserByEmail = async (email, projection = undefined, options = {}) => {
	return await db.query.users.findFirst({
		where: eq(users.email, email),
		...(projection && Object.keys(projection).length > 0 && { columns: projection }),
	});
}

const getUserByUuid = async (uuid, projection = undefined, options = {}) => {
	return await db.query.users.findFirst({
		where: eq(users.uuid, uuid),
		...(projection && Object.keys(projection).length > 0 && { columns: projection }),
	});
}

const createUserService = async (data, options = {}) => {

	const { transaction } = options;
	const executor = transaction || db;

	const { email, title, first_name, last_name, country, dob, phone, password, profilePicture } = data

	const [user] = await executor.insert(users)
		.values({ email: email, password: password, title: title, firstName: first_name, lastName: last_name, country: country, dob: dob, phone: phone, profilePicture: profilePicture })
		.returning({ uuid: users.uuid, phone: users.phone, email: users.email, firstName: users.firstName, lastName: users.lastName, country: users.country, dob: users.dob, profilePicture: users.profilePicture });

	return user;
};

const updateUserByUuidService = async (uuid, updatedObject, options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	await executor
		.update(users)
		.set(updatedObject)
		.where(eq(users.uuid, uuid));
};

const adminDashboardUserStats = async () => {
	const [stats] = await db
		.select({
			totalUsers: sql`COUNT(*)`,
			activeShopperss: sql`COUNT(*) FILTER (WHERE ${freelancerProfiles.userId} IS NOT NULL AND ${freelancerProfiles.profileStatus} = 'approved')`,
			pendingApprovals: sql`COUNT(*) FILTER (WHERE ${freelancerProfiles.userId} IS NOT NULL AND ${freelancerProfiles.profileStatus} = 'pending')`
		})
		.from(users)
		.leftJoin(
			freelancerProfiles,
			eq(freelancerProfiles.userId, users.uuid)
		);

	return stats;
}

const getUsersList = async (filters) => {

	const {
		page = 1,
		limit = 10,
		profile_status,
		search_text,
	} = filters;

	const offset = (page - 1) * limit;

	const conditions = [
		sql`NOT EXISTS (SELECT 1 FROM freelancer_profiles fp WHERE fp.user_id = ${users.uuid})`,
	];

	if (search_text){
		conditions.push(
			sql`( ${users.firstName} || ' ' || ${users.lastName} ) ILIKE ${'%' + search_text + '%'}`
		);
	}

	switch (profile_status) {
		case 'active':
			conditions.push(eq(users.isBlocked, false));
			break;
		case 'blocked':
			conditions.push(eq(users.isBlocked, true));
			break;
		case 'deleted':
			conditions.push(eq(users.isDeleted, true));
			break;
	}

	const result = await db
		.select({
			userId: users.uuid,
			firstName: users.firstName,
			lastName: users.lastName,
			email: users.email,
			title: users.title,
			isVerified: users.isVerified,
			isDeleted: users.isDeleted,
			country: users.country,
			profilePicture: users.profilePicture,
			createdAt: users.createdAt,
		})
		.from(users)
		.where(and(...conditions))
		.limit(limit)
		.offset(offset);

	return result;
}


export {
	getUsersList,
	getUserService,
	createUserService,
	getUserByEmail,
	updateUserByUuidService,
	getUserByUuid,
	adminDashboardUserStats,
}

