import {
    pgTable,
    varchar,
    timestamp,
    boolean,
    uuid,
} from "drizzle-orm/pg-core";

const sessions = pgTable("sessions", {
    tokenId: uuid("token_id").defaultRandom().primaryKey(),
    userId: uuid("user_uuid").notNull(),
    userType: varchar("user_type", { length: 255 }),
    deviceId: varchar("device_id", { length: 255 }).notNull(),
    userAgent: varchar("user_agent", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    revoked: boolean("revoked").default(false),
});

export {
    sessions
}