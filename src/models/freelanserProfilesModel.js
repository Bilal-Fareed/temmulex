import {
    pgTable,
    serial,
    varchar,
    timestamp,
    boolean,
    uuid,
} from "drizzle-orm/pg-core";
import { geographyPoint } from "./types/geography.js";
import { relations } from "drizzle-orm";
import { conversations } from "./conversationsModel.js";
import { orders } from "./ordersModel.js";
import { reviews } from "./reviewsModel.js";
import { users } from "./usersModel.js";
import { languages } from "./languagesModel.js";
import { services } from "./servicesModel.js";

export const freelancerProfiles = pgTable("freelancer_profiles", {
    id: serial("id"),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
    location: geographyPoint("location"),
    resumeLink: varchar("resume_link", { length: 500 }),
    certificateLink: varchar("certificate_link", { length: 500 }),
    profileStatus: varchar("profile_status", { length: 100 }).default('pending'),
    isBlocked: boolean("is_blocked").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    language: uuid("language").references(() => users.id),
    service: uuid("service").references(() => users.id),
    fixedPriceCents: integer("fixed_price_cents").notNull(),
    currency: char("currency", { length: 3 }).notNull().default("USD"),
    languageId: integer("language_id").references(() => languages.id),
    serviceId: integer("service_id").references(() => services.id),
});

export const freelancerProfilesRelations = relations(freelancerProfiles, ({ many, one }) => ({
    conversations: many(conversations),
    orders: many(orders),
    reviews: many(reviews),
    language: one(languages, { fields: [freelancerProfiles.languageId], references: [languages.id] }),
    service: one(services, { fields: [freelancerProfiles.serviceId], references: [services.id] }),
}));
