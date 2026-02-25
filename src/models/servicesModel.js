import { orders } from "./ordersModel.js";
import { pgTable, serial, varchar, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const services = pgTable("services", {
	id: serial("id").primaryKey(),
	uuid: uuid("uuid").defaultRandom().notNull().unique(),
	name: varchar("name", { length: 150 }).notNull().unique(),
	slug: varchar("slug", { length: 150 }).notNull().unique(),
	service_type: varchar("service_type", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at"),
	isDeleted: boolean("is_deleted").default(false),
});

const servicesRelations = relations(services, ({ many }) => ({
	orders: many(orders),
}));

export {
	services,
	servicesRelations
}