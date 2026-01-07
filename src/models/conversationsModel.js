import {
    pgTable,
    serial,
    timestamp,
    boolean,
    uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./ordersModel.js";
import { users } from "./usersModel.js";
import { messages } from "./messagesModel.js";

export const conversations = pgTable("conversations", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    orderId: uuid("order_uuid").references(() => orders.uuid).notNull(),
    clientId: uuid("client_uuid").references(() => users.uuid).notNull(),
    freelancerId: uuid("freelancer_uuid").references(() => users.uuid).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversationRelations = relations(conversations, ({ many, one }) => ({
    order: one(orders, { fields: [conversations.orderId], references: [orders.uuid] }),
    client: one(users, { fields: [conversations.clientId], references: [users.uuid] }),
    freelancer: one(users, { fields: [conversations.freelancerId], references: [users.uuid] }),
    messages: many(messages),
}));
