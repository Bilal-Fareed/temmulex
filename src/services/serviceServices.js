import { db } from '../../infra/db.js';
import { services } from "../models/servicesModel.js";
import { eq } from "drizzle-orm";

const getServices = async (options = {}) => {
    return await db
        .select({
            uuid: services.uuid,
            name: services.name,
            slug: services.slug,
            service_type: services.service_type,
        })
        .from(services)
        .where(eq(services.isDeleted, false))
}

export {
    getServices,
}
