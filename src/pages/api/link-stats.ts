import type { APIRoute } from 'astro';
import { redis } from '../../lib/redis';

/**
 * GET /api/link-stats
 * Returns click counts for tracked links from Redis.
 * 
 * Query params:
 *   - urls (optional): comma-separated list of URLs to fetch stats for
 * 
 * Response: { stats: { url: string, clicks: number }[], total: number }
 */
export const GET: APIRoute = async ({ url }) => {
    try {
        const urlsParam = url.searchParams.get('urls');

        // Mode 1: Fetch specific requested URLs
        if (urlsParam) {
            const requestedUrls = urlsParam.split(',').map(u => u.trim()).filter(Boolean);
            const stats: { url: string; clicks: number }[] = [];

            for (const linkUrl of requestedUrls) {
                const safeKey = encodeURIComponent(linkUrl.replace(/^https?:\/\//, ''));
                let clicks = 0;
                if (redis) {
                    try {
                        const raw = await redis.get(`link_clicks:${safeKey}`);
                        clicks = raw ? Number(raw) : 0;
                    } catch (err) {
                        console.warn(`Failed to fetch Redis key link_clicks:${safeKey}`, err);
                    }
                }
                stats.push({ url: linkUrl, clicks });
            }

            return new Response(JSON.stringify({ stats, total: stats.reduce((s, r) => s + r.clicks, 0) }), {
                status: 200,
                headers: { 
                    'Content-Type': 'application/json', 
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Mode 2: Scan/fetch all tracked links from Redis
        let stats: { url: string; clicks: number }[] = [];

        if (redis) {
            try {
                // Use redis.keys for clean & non-blocking key lookup
                const keys = await redis.keys('link_clicks:*');
                if (keys && keys.length > 0) {
                    const values = await redis.mget(...keys);
                    stats = keys.map((key: string, idx: number) => {
                        const urlEncoded = key.replace(/^link_clicks:/, '');
                        let linkUrl = urlEncoded;
                        try {
                            linkUrl = decodeURIComponent(urlEncoded);
                        } catch {
                            linkUrl = urlEncoded;
                        }
                        const rawVal = values[idx];
                        const clicks = rawVal !== null && rawVal !== undefined ? Number(rawVal) : 0;
                        return { url: linkUrl, clicks };
                    }).sort((a, b) => b.clicks - a.clicks);
                }
            } catch (redisErr) {
                console.error('Upstash Redis keys error:', redisErr);
            }
        }

        return new Response(JSON.stringify({ stats, total: stats.reduce((s, r) => s + r.clicks, 0) }), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json', 
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        console.error('Link Stats API Exception:', error);
        return new Response(JSON.stringify({ stats: [], total: 0, error: 'Internal Server Error' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
