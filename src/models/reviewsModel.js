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
import { users } from "./usersModel.js";

const reviews = pgTable("reviews", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    orderId: uuid("order_uuid").references(() => orders.uuid).notNull(),
    reviewerId: uuid("reviewer_uuid").references(() => users.uuid).notNull(),
    freelancerId: uuid("freelancer_uuid").references(() => users.uuid).notNull(),
    rating: integer("rating"),
    comments: text("comments"),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

const reviewRelations = relations(reviews, ({ one }) => ({
    order: one(orders, { fields: [reviews.orderId], references: [orders.uuid] }),
    client: one(users, { fields: [reviews.reviewerId], references: [users.uuid] }),
    freelancer: one(users, { fields: [reviews.freelancerId], references: [users.uuid] }),
}));

export {
    reviews,
    reviewRelations
}