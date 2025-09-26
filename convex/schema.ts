// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    username: v.string(),
    isOnboarded: v.boolean(),
    createdAt: v.number(),
  })

  .index("by_email", ["email"])
  .index("by_username", ["username"]),
});