// Lightweight DB-backed limiter. For high traffic, replace this with Redis/Upstash.
import { createAdminClient } from "@/lib/supabase/admin";

export async function rateLimit(key: string, limit = 30, windowSeconds = 60) {
  const admin = createAdminClient();
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / (windowSeconds * 1000)) * windowSeconds * 1000);
  const { data } = await admin.rpc("consume_rate_limit", {
    p_key: key, p_window_start: windowStart.toISOString(), p_limit: limit
  });
  return Boolean(data);
}
