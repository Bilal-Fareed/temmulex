import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const languages = pgTable("languages", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
});
