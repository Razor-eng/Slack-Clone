import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const remove = mutation({
    args: {
        id: v.id("Channels"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const channel = await ctx.db.get(args.id);

        if (!channel) {
            throw new Error("Channel not found");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
            )
            .unique();

        if (!member || member.role !== 'admin') {
            throw new Error("Unauthorized");
        }

        const [messages] = await Promise.all([
            ctx.db
                .query("messages")
                .withIndex("by_channel_id", (q) => q.eq("channelId", args.id))
                .collect(),
        ]);

        for (const message of messages) {
            await ctx.db.delete(message._id);
        }

        await ctx.db.delete(args.id);

        return args.id;
    }
});

export const update = mutation({
    args: {
        id: v.id("Channels"),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const channel = await ctx.db.get(args.id);

        if (!channel) {
            throw new Error("Channel not found");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
            )
            .unique();

        if (!member || member.role !== 'admin') {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.id, {
            name: args.name
        });

        return args.id;
    }
});

export const create = mutation({
    args: {
        name: v.string(),
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", args.workspaceId).eq("userId", userId)
            )
            .unique();

        if (!member || member.role !== 'admin') {
            throw new Error("Unauthorized");
        }

        const parsedName = args.name
            .replace(/\s+/g, "-")
            .toLowerCase();

        const channelId = await ctx.db.insert("Channels", {
            name: parsedName,
            workspaceId: args.workspaceId,
        });

        return channelId;
    }
});

export const getById = query({
    args: {
        id: v.id("Channels"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            return null;
        }

        const channel = await ctx.db.get(args.id);

        if (!channel) {
            return null;
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
            )
            .unique();

        if (!member) {
            return null;
        }

        return channel;
    }
})

export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            return [];
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", args.workspaceId).eq("userId", userId)
            )
            .unique();

        if (!member) {
            return [];
        }

        const channels = await ctx.db
            .query("Channels")
            .withIndex("by_workspace_id", (q) =>
                q.eq("workspaceId", args.workspaceId)
            )
            .collect();

        return channels;
    }
})