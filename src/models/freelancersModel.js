import {
	pgTable,
	serial,
	varchar,
	timestamp,
	boolean,
	integer,
    date,
	real,
	uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { conversations } from "./conversationsModel.js";
import { orders } from "./ordersModel.js";
import { reviews } from "./reviewsModel.js";

export const freelancers = pgTable("freelancers", {
	id: serial("id"),
	uuid: uuid("uuid").defaultRandom().notNull().unique(),
	name: varchar("name", { length: 255 }),
	profilePicture: varchar("profile_picture", { length: 500 }),
    phone: varchar("phone", { length: 255 }),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }),
	googleId: varchar("google_id", { length: 255 }),
    country: varchar("country", { length: 255 }),
    dob: date("dob"),
    resumeLink: varchar("resume_link", { length: 500 }),
    certificateLink: varchar("certificate_link", { length: 500 }),
    profileStatus: varchar("profile_status", { length: 100 }).default('pending'),
	isBlocked: boolean("is_blocked").default(false),
	isDeleted: boolean("is_deleted").default(false),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	refreshTokenVersion: integer("refresh_token_version").default(1).notNull(),
});

export const freelancerRelations = relations(freelancers, ({ many }) => ({
	conversations: many(conversations),
	orders: many(orders),
	reviews: many(reviews),
}));
