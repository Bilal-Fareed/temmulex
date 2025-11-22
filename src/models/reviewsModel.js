import {
    pgTable,
    serial,
    timestamp,
    boolean,
    uuid,
    integer,
    text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./ordersModel.js";
import { clients } from "./clientsModel.js";
import { freelancers } from "./freelancersModel.js";

export const reviews = pgTable("reviews", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    orderId: uuid("order_uuid").references(() => orders.uuid).notNull(),
    reviewerId: uuid("reviewer_uuid").references(() => clients.uuid).notNull(),
    freelancerId: uuid("freelancer_uuid").references(() => freelancers.uuid).notNull(),
    rating: integer("rating"),
    comments: text("comments"),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviewRelations = relations(reviews, ({ one }) => ({
    order: one(orders, { fields: [reviews.orderId], references: [orders.uuid] }),
    client: one(clients, { fields: [reviews.reviewerId], references: [clients.uuid] }),
    freelancer: one(freelancers, { fields: [reviews.freelancerId], references: [freelancers.uuid] }),
}));
