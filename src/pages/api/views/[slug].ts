import type { APIRoute } from 'astro';
import { redis } from '../../../lib/redis';

export const POST: APIRoute = async ({ params }) => {
    const slug = params.slug;

    if (!slug) {
        return new Response(JSON.stringify({ error: 'Slug is required' }), { status: 400 });
    }

    try {
        if (!redis) {
            // Local dev without Redis credentials, return mocked count
            return new Response(JSON.stringify({ views: 42 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // Increment the view counter in Redis. 
        // We use a prefix like 'pageviews:blog:' to keep keys organized.
        const views = await redis.incr(`pageviews:blog:${slug}`);

        return new Response(JSON.stringify({ views }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Redis Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', views: 0 }), { status: 500 });
    }
};

export const GET: APIRoute = async ({ params }) => {
    const slug = params.slug;

    if (!slug) {
        return new Response(JSON.stringify({ error: 'Slug is required' }), { status: 400 });
    }

    try {
        if (!redis) {
            return new Response(JSON.stringify({ views: 42 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // Get the current view count without incrementing
        const views = await redis.get(`pageviews:blog:${slug}`) || 0;

        return new Response(JSON.stringify({ views }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Redis Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', views: 0 }), { status: 500 });
    }
};
