import {
    pgTable,
    serial,
    timestamp,
    boolean,
    uuid,
    numeric,
    varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./usersModel.js";
import { reviews } from "./reviewsModel.js";
import { conversations } from "./conversationsModel.js";

export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    clientId: uuid("client_uuid").references(() => users.uuid).notNull(),
    freelancerId: uuid("freelancer_uuid").references(() => users.uuid),
    price: numeric().notNull(),
    status: varchar("status").default("pending"),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderRelations = relations(orders, ({ one }) => ({
    client: one(users, { fields: [orders.clientId], references: [users.uuid] }),
    freelancer: one(users, { fields: [orders.freelancerId], references: [users.uuid] }),
    reviews: one(reviews),
    conversations: one(conversations),
}));
