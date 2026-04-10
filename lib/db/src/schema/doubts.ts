import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const doubtsTable = pgTable("doubts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().notNull().default([]),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  authorUsername: text("author_username"),
  isResolved: boolean("is_resolved").notNull().default(false),
  answerCount: integer("answer_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const doubtAnswersTable = pgTable("doubt_answers", {
  id: serial("id").primaryKey(),
  doubtId: integer("doubt_id").notNull(),
  content: text("content").notNull(),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  authorUsername: text("author_username"),
  isAccepted: boolean("is_accepted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDoubtSchema = createInsertSchema(doubtsTable).omit({
  id: true,
  answerCount: true,
  createdAt: true,
  updatedAt: true,
});

export const createDoubtSchema = z.object({
  title: z.string().min(10).max(200),
  content: z.string().min(20),
  tags: z.array(z.string()).max(5).optional(),
});

export const insertDoubtAnswerSchema = createInsertSchema(doubtAnswersTable).omit({
  id: true,
  isAccepted: true,
  createdAt: true,
});

export const createDoubtAnswerSchema = z.object({
  content: z.string().min(10),
});

export type InsertDoubt = z.infer<typeof insertDoubtSchema>;
export type Doubt = typeof doubtsTable.$inferSelect;
export type InsertDoubtAnswer = z.infer<typeof insertDoubtAnswerSchema>;
export type DoubtAnswer = typeof doubtAnswersTable.$inferSelect;
