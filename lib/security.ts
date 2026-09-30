import { z } from "zod";

export const postSchema = z.object({
  title: z.string().trim().min(3).max(140),
  body: z.string().trim().min(3).max(10000),
  type: z.enum(["post", "reel", "story"]),
  mediaPath: z.string().trim().max(500).optional().nullable()
});

export const moderationSchema = z.object({
  contentId: z.string().uuid(),
  status: z.enum(["approved", "flagged", "rejected"]),
  reason: z.string().trim().max(500).optional()
});

export function sanitizeText(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}
