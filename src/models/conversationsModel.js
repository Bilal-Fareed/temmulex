import {
    pgTable,
    serial,
    timestamp,
    boolean,
    uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./ordersModel.js";
import { clients } from "./clientsModel.js";
import { freelancers } from "./freelancersModel.js";
import { messages } from "./messagesModel.js";

export const conversations = pgTable("conversations", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    orderId: uuid("order_uuid").references(() => orders.uuid).notNull(),
    clientId: uuid("client_uuid").references(() => clients.uuid).notNull(),
    freelancerId: uuid("freelancer_uuid").references(() => freelancers.uuid).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversationRelations = relations(conversations, ({ many, one }) => ({
    order: one(orders, { fields: [conversations.orderId], references: [orders.uuid] }),
    client: one(clients, { fields: [conversations.clientId], references: [clients.uuid] }),
    freelancer: one(freelancers, { fields: [conversations.freelancerId], references: [freelancers.uuid] }),
    messages: many(messages),
}));
