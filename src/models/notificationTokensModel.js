import {
    pgTable,
    serial,
    varchar,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

const notificationTokens = pgTable("notification_tokens", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    userId: uuid("user_id").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    deviceId: varchar("device_id", { length: 255 }).notNull(),
    userAgent: varchar("user_agent", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
});

export {
    notificationTokens,
}