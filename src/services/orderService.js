import { db } from "../../infra/db.js";
import { orders } from "../models/ordersModel.js";
import { users } from "../models/usersModel.js";
import { reviews } from "../models/reviewsModel.js";
import { eq, and, sql, count, sum, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { services } from "../models/servicesModel.js";

const buildWhere = (filters) => {
    return and(
        ...Object.entries(filters).map(([key, value]) =>
            eq(orders[key], value)
        )
    );
};

const updateOrderPaymentStatusService = async (data = {}, filters = {}, options = {}) => {
    const { transaction } = options;
    const executor = transaction || db;

    return await executor.update(orders).set(data).where(buildWhere(filters));

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

    const { clientId, freelancerId, serviceId, price, paymentReference } = data

    const [order] = await executor.insert(orders)
        .values({ clientId: clientId, freelancerId: freelancerId, serviceId: serviceId, price: price, paymentReference: paymentReference })
		.returning({ uuid: orders.uuid, clientId: orders.clientId, freelancerId: orders.freelancerId, serviceId: orders.serviceId, price: orders.price });

	return order;
};

const getFreelancerCompletedOrderStats = async (freelancerUuid) => {
    const result = await db
        .select({
            totalOrders: count(),
            totalEarnings: sum(orders.price),
        })
        .from(orders)
        .where(
            and(
                eq(orders.freelancerId, freelancerUuid),
                eq(orders.status, "completed"),
                eq(orders.isDeleted, false)
            )
        );

    return result[0];
};

const getOrderService = async (filters = {}, projection = undefined, options = {}) => {

    const client = alias(users, "client");
    const freelancer = alias(users, "freelancer");

    let whereClause = buildWhere(filters);

    const { clientId, status } = filters;

    if (clientId && status == 'ongoing') {
        whereClause = and(
            eq(orders.clientId, clientId),
            inArray(orders.status, ['pending', 'ongoing'])
        )
    }

    const { page, limit } = options;

    const offset = (page - 1) * limit;

    return await db
        .select({
            orderId: orders.uuid,
            price: sql`ROUND(${orders.price} / 100.0, 2)`,
            status: orders.status,
            createdAt: orders.createdAt,
            paymentStatus: orders.paymentStatus,

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

        .where(whereClause)
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

const getOrderByFilterService = async (filters = {}, projection = undefined, options = {}) => {
    return await db.query.orders.findFirst({
        where: buildWhere(filters),
		...(projection && Object.keys(projection).length > 0 && { columns: projection }),
    });
}

const getOrderByUuid = async (uuid, projection = undefined, options = {}) => {
	return await db.query.orders.findFirst({
		where: eq(orders.uuid, uuid),
		...(projection && Object.keys(projection).length > 0 && { columns: projection }),
	});
}

const adminDashboardOrderStats = async () => {
	const [stats] = await db
		.select({
			ongoingOrders: sql`COUNT(*) FILTER (WHERE ${orders.status} = 'ongoing')`,
			completedOrders: sql`COUNT(*) FILTER (WHERE ${orders.status} = 'completed')`,
			disputedOrders: sql`COUNT(*) FILTER (WHERE ${orders.paymentStatus} = 'pending')`,
			cancelledOrders: sql`COUNT(*) FILTER (WHERE ${orders.status} = 'cancelled')`
		})
		.from(orders);
	return stats;
}

const getUserOrderCountsAndValue = async (filter = {}) => {

    const { clientId, freelancerId } = filter;

    const orderCondition = freelancerId
        ? sql`${orders.freelancerId} = ${freelancerId}`
        : sql`${orders.clientId} = ${clientId}`;

    const [orderDetail] = await db
        .select({
            totalOrders: sql`COUNT(*) FILTER (WHERE ${orderCondition})`,
            totalValue: sql`SUM(price) FILTER (WHERE ${orderCondition})`,
        })
        .from(orders);
    return orderDetail;
}

const getAdminOrdersListService = async (filters = {}, options = {}) => {

    const client = alias(users, "client");
    const freelancer = alias(users, "freelancer");

    const conditions = [];
    const { search_text, order_status } = filters;
    const { page, limit } = options;
    const offset = (page - 1) * limit;

    if (search_text)
        conditions.push(sql`(${orders.uuid}) ILIKE ${'%' + search_text + '%'}`);

    switch (order_status) {
        case 'pending':
            conditions.push(eq(orders.status, 'pending'));
            break;
        case 'ongoing':
            conditions.push(eq(orders.status, 'ongoing'));
            break;
        case 'completed':
            conditions.push(eq(orders.status, 'completed'));
            break;
        case 'disputed':
            conditions.push(...[eq(orders.status, 'completed'), eq(orders.paymentStatus, 'pending')]);
            break;
    }

    return await db
        .select({
            orderId: orders.uuid,
            price: sql`ROUND(${orders.price} / 100.0, 2)`,
            status: orders.status,
            createdAt: orders.createdAt,
            paymentStatus: orders.paymentStatus,

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

        .where(...conditions)
        .offset(offset)
        .limit(limit);
}

export {
    rateOrder,
    getOrderByUuid,
    getOrderService,
    createOrderService,
    getUserOrderCountsAndValue,
    getOrderByFilterService,
    updateOrderByUuidService,
    adminDashboardOrderStats,
    getAdminOrdersListService,
    updateOrderPaymentStatusService,
    getFreelancerCompletedOrderStats,
}
