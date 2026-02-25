import { db } from "../../infra/db.js";
import { orders } from "../models/ordersModel.js";
import { eq, and } from "drizzle-orm";

const buildWhere = (filters) => {
    return and(
        ...Object.entries(filters).map(([key, value]) =>
            eq(orders[key], value)
        )
    );
};

const getOrderService = async (filters = {}, projection = {}, options = {}) => {

    const { page, limit } = options;

    const offset = (page - 1) * limit;

    return await db
        .select()
        .from(orders)
        .where(buildWhere(filters))
        .offset(offset)
        .limit(limit);
}


export {
    getOrderService
}
