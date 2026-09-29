import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
export const demoRequests = sqliteTable(
  "demo_requests",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    school: text("school").notNull(),
    role: text("role").notNull(),
    createdAt: text("created_at").notNull(),
    consentAt: text("consent_at").notNull(),
    ipHash: text("ip_hash").notNull(),
  },
  (t) => [index("idx_demo_ip_created").on(t.ipHash, t.createdAt)],
);
