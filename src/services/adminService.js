import { db } from "../../infra/db.js";
import { admin } from "../models/adminModel.js";
import { eq, and } from "drizzle-orm";

const getAdminByEmail = async (email, projection = undefined, options = {}) => {
	return await db.query.admin.findFirst({
		where: eq(admin.email, email),
		...(projection && Object.keys(projection).length > 0 && { columns: projection }),
	});
}

const getAdminByUuid = async (uuid, projection = undefined, options = {}) => {
	return await db.query.admin.findFirst({
		where: eq(admin.uuid, uuid),
		...(projection && Object.keys(projection).length > 0 && { columns: projection }),
	});
}

const updateAdminByUuidService = async (uuid, updatedObject, options = {}) => {
	const { transaction } = options;
	const executor = transaction || db;

	await executor
		.update(admin)
		.set(updatedObject)
		.where(eq(admin.uuid, uuid));
};

export {
    getAdminByEmail,
	getAdminByUuid,
	updateAdminByUuidService,
}
