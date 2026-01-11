import {
    pgTable,
    serial,
    timestamp,
    boolean,
    uuid,
    varchar,
    text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { conversations } from "./conversationsModel.js";

const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    senderId: uuid("sender_uuid").notNull(),
    conversationId: uuid("conversation_uuid").references(() => conversations.uuid).notNull(),
    content: text("content"),
    attachmentUrl: varchar("attachment_url", { length: 255 }),
    isRead: boolean("is_read").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

const messageRelations = relations(messages, ({ one }) => ({
    conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.uuid] }),
}));

export {
    messages,
    messageRelations
}