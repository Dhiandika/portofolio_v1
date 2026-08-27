import type { APIRoute } from 'astro';
import { redis } from '../../lib/redis';

// POST /api/track-click — increment click count for a URL
export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json().catch(() => ({}));
        const linkUrl = body.url;

        if (!linkUrl) {
            return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
        }

        const safeKey = encodeURIComponent(linkUrl.replace(/^https?:\/\//, ''));

        let clicks = 1;
        if (redis) {
            clicks = await redis.incr(`link_clicks:${safeKey}`);
        }

        return new Response(JSON.stringify({ success: true, clicks }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Click Track Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};

// GET /api/track-click?url=xxx — get click count for a single URL
export const GET: APIRoute = async ({ url }) => {
    try {
        const linkUrl = url.searchParams.get('url');

        if (!linkUrl) {
            return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
        }

        const safeKey = encodeURIComponent(linkUrl.replace(/^https?:\/\//, ''));
        let clicks = 0;

        if (redis) {
            const raw = await redis.get(`link_clicks:${safeKey}`);
            clicks = raw ? Number(raw) : 0;
        }

        return new Response(JSON.stringify({ url: linkUrl, clicks }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
    } catch (error) {
        console.error('Click Fetch Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
