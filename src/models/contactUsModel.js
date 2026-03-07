import {
    pgTable,
    serial,
    timestamp,
    boolean,
    uuid,
    varchar,
    text
} from "drizzle-orm/pg-core";

const contactUs = pgTable("contact_us", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    fullName: varchar("full_name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    message: text("message"),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export {
    contactUs
}