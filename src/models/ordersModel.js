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
import { users } from "./usersModel.js";
import { reviews } from "./reviewsModel.js";
import { services } from "./servicesModel.js";
import { conversations } from "./conversationsModel.js";

const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    clientId: uuid("client_uuid").references(() => users.uuid).notNull(),
    freelancerId: uuid("freelancer_uuid").references(() => users.uuid),
    serviceId:  uuid("service_uuid").references(() => services.uuid),
    price: numeric().notNull(),
    commissionPercentage: numeric().notNull().default(0),
    status: varchar("status").default("pending"),
    paymentStatus: varchar("payment_status").default("pending"),
    paymentReference: text("payment_reference_id").default(null),
    payoutTransferId: varchar("payout_transfer_id").default(null),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

const orderRelations = relations(orders, ({ one }) => ({
    client: one(users, { fields: [orders.clientId], references: [users.uuid] }),
    freelancer: one(users, { fields: [orders.freelancerId], references: [users.uuid] }),
    service: one(services, { fields: [orders.serviceId], references: [services.uuid] }),
    reviews: one(reviews),
}));

export {
    orders,
    orderRelations
}