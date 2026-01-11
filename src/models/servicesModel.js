import { pgTable, serial, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

const services = pgTable("services", {
	id: serial("id").primaryKey(),
	uuid: uuid("uuid").defaultRandom().notNull().unique(),
	name: varchar("name", { length: 150 }).notNull().unique(),
	slug: varchar("slug", { length: 150 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at"),
});

export {
	services
}