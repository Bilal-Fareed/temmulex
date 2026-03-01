import { db } from "../../infra/db.js";
import { users } from "../models/usersModel.js";
import { eq } from "drizzle-orm";

const buildWhere = (filters) => {
	return and(
		...Object.entries(filters).map(([key, value]) =>
			eq(users[key], value)
		)
	);
};

const getUserService = async (filters = {}, projection = undefined, options = {}) => {
	return await db.query.users.find({
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


export {
	getUserService,
	createUserService,
	getUserByEmail,
	updateUserByUuidService,
	getUserByUuid,
}

