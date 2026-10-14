import { db } from "../../infra/db.js";
import { orderItems } from "../models/orderItemsModel.js";
import { eq, and } from "drizzle-orm";

const buildWhere = (filters) => {
    return and(
        ...Object.entries(filters).map(([key, value]) =>
            eq(orderItems[key], value)
        )
    );
};

const insertOrderItemService = async (data, options = {}) => {
    const { transaction } = options;
    const executor = transaction || db;

    const { uuid, orderId, price, itemName, description, paymentReference } = data;

    const [itemDetails] = await executor.insert(orderItems).values({
        uuid: uuid, orderId: orderId, price: price, itemName: itemName, description: description, paymentReference: paymentReference,
    }).returning({
        uuid: orderItems.uuid, orderId: orderItems.orderId, itemName: orderItems.itemName, description: orderItems.description, price: orderItems.price,
    });

    return itemDetails;
}

const updateItemPaymentStatusService = async (data = {}, filters = {}, options = {}) => {
    const { transaction } = options;
    const executor = transaction || db;

    return await executor.update(orderItems).set(data).where(buildWhere(filters));

};

const getAdminOrderItemsListService = async (filters = {}, options = {}) => {

    const { search_text, order_id } = filters;
    const conditions = [];
    const { page, limit } = options;
    const offset = (page - 1) * limit;

    conditions.push(eq(orderItems.orderId, order_id));

    if (search_text)
        conditions.push(sql`(${orderItems.itemName}) ILIKE ${'%' + search_text + '%'}`);

    return await db
        .select({
            orderItemId: orderItems.uuid,
            price: sql`ROUND(${orderItems.price} / 100.0, 2)`,
            createdAt: orderItems.createdAt,
            paymentStatus: orderItems.paymentStatus,
        })
        .from(orderItems)

        .where(...conditions)
        .offset(offset)
        .limit(limit);
}

const getOrderItemDetailsForAdminService = async ({ uuid }) => {

    const [orderItem] = await db
        .select({
            itemId: orderItems.uuid,
            orderId: orderItems.orderId,
            itemName: orderItems.itemName,
            description: orderItems.description,
            price: sql`ROUND(${orderItems.price} / 100.0, 2)`,
            createdAt: orderItems.createdAt,
            paymentStatus: orderItems.paymentStatus,
            paymentReference: orderItems.paymentReference,
        })
        .from(orderItems)
        .where(eq(orderItems.uuid, uuid))
        .limit(1);

        return orderItem;
}

export {
	insertOrderItemService,
    getAdminOrderItemsListService,
    updateItemPaymentStatusService,
    getOrderItemDetailsForAdminService,
}