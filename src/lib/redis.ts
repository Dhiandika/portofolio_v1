import { Redis } from "@upstash/redis";

// Allow building even if env vars are missing during local build
const url = import.meta.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Create a silent fallback when credentials are not available 
// (e.g. during local dev without .env setup)
export const redis = url && token
    ? new Redis({ url, token })
    : null;
