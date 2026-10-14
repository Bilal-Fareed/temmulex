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

export {
	insertOrderItemService,
    updateItemPaymentStatusService
}