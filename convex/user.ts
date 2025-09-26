import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: {
    email: v.string(),
  },
  handler: async ({ db }, { email }) => {
    const user = await db
      .query("users")
      .withIndex("by_email", q => q.eq("email", email))
      .unique();

    if (!user) return null;

    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      isOnboarded: user.isOnboarded || false, // explicitly include onboarding status
      createdAt: user.createdAt,
      _creationTime: user._creationTime,
    };
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (existing) return existing;

    const userId = await ctx.db.insert("users", {
      email: String(args.email),
      username: String(args.username),
      isOnboarded: false,
      createdAt: Date.now(),
    });

    const newUser = await ctx.db.get(userId);
    return newUser;
  },
});

export const setOnboarded = mutation({
  args: {
    email: v.string(),
  },
  handler: async ({ db }, { email }) => {
    const user = await db
      .query("users")
      .withIndex("by_email", q => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await db.patch(user._id, { isOnboarded: true });

    return {
      success: true,
      email: user.email,
      isOnboarded: true, // return updated onboarding status
    };
  },
});
