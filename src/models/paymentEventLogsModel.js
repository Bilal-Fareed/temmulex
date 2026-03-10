import {
    pgTable,
    serial,
    varchar,
    timestamp,
    jsonb,
} from "drizzle-orm/pg-core";

const paymentEventLogs = pgTable("payment_event_logs", {
    id: serial("id").primaryKey(),
    eventId: varchar("event_id", { length: 255 }), // Stripe eventId
    eventType: varchar("event_type", { length: 255 }),
    payload: jsonb("payload"), // store full event
    createdAt: timestamp("created_at").defaultNow(),
});

export {
    paymentEventLogs
}