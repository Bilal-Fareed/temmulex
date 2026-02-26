import {
    pgTable,
    serial,
    varchar,
    timestamp,
    boolean,
    geometry,
    uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { conversations } from "./conversationsModel.js";
import { orders } from "./ordersModel.js";
import { reviews } from "./reviewsModel.js";
import { users } from "./usersModel.js";
import { freelancerLanguages } from "./freelancerLanguagesModel.js";
import { freelancerServices } from "./freelancerServicesModel.js";

const freelancerProfiles = pgTable("freelancer_profiles", {
    id: serial("id"),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    userId: uuid("user_id").primaryKey().references(() => users.uuid, { onDelete: "cascade" }),
    location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    resumeLink: varchar("resume_link", { length: 500 }),
    certificateLink: varchar("certificate_link", { length: 500 }),
    profileStatus: varchar("profile_status", { length: 100 }).default('pending'),
    isBlocked: boolean("is_blocked").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

const freelancerProfilesRelations = relations(freelancerProfiles, ({ many, one }) => ({
    conversations: many(conversations),
    orders: many(orders),
    reviews: many(reviews),
    languages: many(freelancerLanguages),
    services: many(freelancerServices),
    users: one(users, { fields: [freelancerProfiles.userId], references: [users.uuid], onDelete: "cascade" }),
}));

export {
    freelancerProfilesRelations,
    freelancerProfiles
}