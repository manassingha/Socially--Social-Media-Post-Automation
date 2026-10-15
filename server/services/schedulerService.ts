import cron from "node-cron";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { error } from "node:console";

export const initScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const postsToPublish = await Post.find({
        status: "scheduled",
        scheduledFor: { $lte: now },
      });
      for (const post of postsToPublish) {
        try {
          const accounts = await Account.find({
            user: post.user,
            platform: {
              $in: (Array.isArray(post.platforms)
                ? post.platforms
                : [post.platforms]) as any,
            },
            status: "connected",
            zernioAccountId: { $exists: true },
          });
          if (accounts.length === 0) {
            console.log(
              `No connected zernio accounts found for post ${post._id}`,
            );
            continue;
          }
          const zernioPlatforms = accounts.map((acc) => ({
            platform: acc.platform as any,
            accountId: acc.zernioAccountId!,
          }));
          const payload = {
            content: post.content,
            publishNow: true,
            platforms: zernioPlatforms,
            ...(post.mediaUrl
              ? {
                  mediaItems: [
                    { type: post.mediaType || "image", url: post.mediaUrl },
                  ],
                }
              : {}),
          };

          console.log(
            `Publishing post ${post._id} to zernio with media: ${post.mediaUrl} || "none"`,
          );

          const response = await zernio.posts.createPost({
            body: payload,
          });

          const publishedPost = (response.data as any)?.post || response.data;

          if (!publishedPost) {
            throw new Error("failed to get post object from zernio resposne!");
          }

          console.log(
            `zernio post created :${publishedPost._id || publishedPost.id}`,
          );

          post.status = "published";
          await post.save();

          await ActivityLog.create({
            user: post.user,
            actionType: "POST_PUBLISHED",
            description: `published post to ${accounts.map((a) => a.platform).join(", ")}`,
            relatedPost: post._id,
          });
        } catch (error: any) {
          console.log(
            `failed to publish post ${post._id}:`,
            error?.response?.data || error?.message,
          );
          post.status = "failed";
          await post.save();
        }
      }
      if (postsToPublish.length > 0) {
        console.log(
          `evaluated ${postsToPublish.length} posts as ${now.toISOString()}`,
        );
      }
    } catch (error) {
      console.log("error in scheduler:", error);
    }
  });
  console.log("scheduler service initialized!");
};
