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
import { relations } from "drizzle-orm";
import { conversations } from "./conversationsModel.js";
import { orders } from "./ordersModel.js";
import { reviews } from "./reviewsModel.js";

const users = pgTable("users", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    title: varchar("title", { length: 255 }),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    country: varchar("country", { length: 255 }),
    dob: date("dob"),
    phone: varchar("phone", { length: 255 }),
    profilePicture: varchar("profile_picture", { length: 500 }),
    isVerified: boolean("is_verified").default(false),
    isBlocked: boolean("is_blocked").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    refreshTokenVersion: integer("refresh_token_version").default(0),
});

const usersRelations = relations(users, ({ many }) => ({
    conversations: many(conversations),
    orders: many(orders),
    reviews: many(reviews),
}));

export {
    users,
    usersRelations
}