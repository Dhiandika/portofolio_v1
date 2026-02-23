import type { APIRoute } from 'astro';
import { redis } from '../../../lib/redis';

export const GET: APIRoute = async () => {
    try {
        if (!redis) {
            return new Response(JSON.stringify({ totalViews: 1337 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // Fetch all keys starting with 'pageviews:blog:'
        let cursor = 0;
        let allKeys: string[] = [];
        let totalViews = 0;

        do {
            const [nextCursor, keys] = await redis.scan(cursor, {
                match: 'pageviews:blog:*',
                count: 100
            });
            cursor = typeof nextCursor === 'string' ? parseInt(nextCursor, 10) : nextCursor;
            allKeys = allKeys.concat(keys);
        } while (cursor !== 0);

        if (allKeys.length > 0) {
            // MGET to get all values at once
            const values = await redis.mget(...allKeys);
            totalViews = values.reduce((acc: number, val: unknown) => {
                const count = typeof val === 'string' ? parseInt(val, 10) : (typeof val === 'number' ? val : 0);
                return acc + (isNaN(count) ? 0 : count);
            }, 0);
        }

        return new Response(JSON.stringify({ totalViews }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' }
        });
    } catch (error) {
        console.error('Redis Total Views Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', totalViews: 0 }), { status: 500 });
    }
};
