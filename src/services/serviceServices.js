import { db } from '../../infra/db.js';
import { services } from "../models/servicesModel.js";
import { eq } from "drizzle-orm";

const getServices = async (options = {}) => {
    return await db
        .select({
            uuid: services.uuid,
            name: services.name,
            slug: services.slug
        })
        .from(services)
        .where(eq(services.isDeleted, false))
}

export {
    getServices,
}
