import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const services = pgTable("services", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 150 }).notNull().unique(),
	slug: varchar("slug", { length: 150 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow(),
});
