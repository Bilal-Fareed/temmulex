import { db } from "../../infra/db.js";
import { orders } from "../models/ordersModel.js";
import { users } from "../models/usersModel.js";
import { reviews } from "../models/reviewsModel.js";
import { eq, and, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { services } from "../models/servicesModel.js";

const buildWhere = (filters) => {
    return and(
        ...Object.entries(filters).map(([key, value]) =>
            eq(orders[key], value)
        )
    );
};

const updateOrderByUuidService = async (uuid, updatedObject, options = {}) => {
    const { transaction } = options;
    const executor = transaction || db;

    await executor
        .update(orders)
        .set(updatedObject)
        .where(eq(orders.uuid, uuid));
};

const createOrderService = async (data, options = {}) => {

	const { transaction } = options;
	const executor = transaction || db;

    const { clientId, freelancerId, serviceId, price } = data

    const [order] = await executor.insert(orders)
        .values({ clientId: clientId, freelancerId: freelancerId, serviceId: serviceId, price: price })
		.returning({ uuid: orders.uuid, clientId: orders.clientId, freelancerId: orders.freelancerId, serviceId: orders.serviceId, price: orders.price });

	return order;
};

const getOrderService = async (filters = {}, projection = {}, options = {}) => {

    const client = alias(users, "client");
    const freelancer = alias(users, "freelancer");

    const { page, limit } = options;

    const offset = (page - 1) * limit;

    return await db
        .select({
            orderId: orders.uuid,
            price: orders.price,
            status: orders.status,
            createdAt: orders.createdAt,

            serviceId: services.uuid,
            serviceName: services.name,
            serviceType: services.service_type,

            clientUuid: client.uuid,
            clientName: sql`${client.firstName} || ' ' || ${client.lastName}`,
            clientEmail: client.email,

            freelancerUuid: freelancer.uuid,
            freelancerName: sql`${freelancer.firstName} || ' ' || ${freelancer.lastName}`,
            freelancerEmail: freelancer.email,

            reviewId: reviews.uuid,
            rating: reviews.rating,
        })
        .from(orders)

        .leftJoin(client, eq(client.uuid, orders.clientId))
        .leftJoin(services, eq(services.uuid, orders.serviceId))
        .leftJoin(freelancer, eq(freelancer.uuid, orders.freelancerId))
        .leftJoin(reviews, eq(reviews.orderId, orders.uuid))

        .where(buildWhere(filters))
        .offset(offset)
        .limit(limit);
}


const rateOrder = async (data, options = {}) => {

    const { transaction } = options;
    const executor = transaction || db;

    const { orderId, freelancerId, reviewerId, rating = 0 } = data

    const [review] = await executor.insert(reviews)
        .values({ orderId: orderId, freelancerId: freelancerId, reviewerId: reviewerId, rating: rating })
        .returning({ uuid: reviews.uuid });

    return review;

}

const getOrderByFilterService = async (filters = {}, projection = {}, options = {}) => {
    return await db.query.orders.find({
        where: buildWhere(filters),
        columns: projection,
    });
}

const getOrderByUuid = async (uuid, projection = {}, options = {}) => {
	return await db.query.orders.findFirst({
		where: eq(orders.uuid, uuid),
		columns: projection,
	});
}

export {
    rateOrder,
    getOrderByUuid,
    getOrderService,
    createOrderService,
    getOrderByFilterService,
    updateOrderByUuidService,
}
