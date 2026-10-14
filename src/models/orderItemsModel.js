import {
    pgTable,
    serial,
    timestamp,
    boolean,
    uuid,
    numeric,
    varchar,
    text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./ordersModel.js";

const orderItems = pgTable("order_items", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    orderId: uuid("order_uuid").references(() => orders.uuid).notNull(),
    price: numeric().notNull(),
    itemName: varchar("item_name", { length: 255 }),
    description: text("description"),
    paymentStatus: varchar("payment_status").default("pending"),
    paymentReference: text("payment_reference_id").default(null),
    payoutTransferId: varchar("payout_transfer_id").default(null),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

const orderItemRelations = relations(orderItems, ({ many }) => ({
    orders: many(orders),
}));

export {
    orderItems,
    orderItemRelations
}