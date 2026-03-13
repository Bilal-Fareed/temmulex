import {
    pgTable,
    serial,
    varchar,
    timestamp,
    boolean,
    integer,
    uuid,
    date,
} from "drizzle-orm/pg-core";

const admin = pgTable("admin", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    role: varchar("role", { length: 255 }),
    isBlocked: boolean("is_blocked").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    refreshTokenVersion: integer("refresh_token_version").default(0),
});

export {
    admin,
}