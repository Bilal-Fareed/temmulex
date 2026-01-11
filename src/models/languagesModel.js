import { pgTable, serial, varchar, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

const languages = pgTable("languages", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export {
    languages
}