// ⚠️ CRITICAL: DO NOT DELETE OR MODIFY THIS FILE ⚠️
// This file explicitly sets `prerender = false` to fix build errors with static output.
export const prerender = false;

import { makeHandler } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';

const keystaticHandler = makeHandler({
    config,
});

export const ALL = async (context: any) => {
    // BUG FIX: Astro + Vercel bug intercept: Vercel serverless functions sometimes incorrectly 
    // construct the internal Request URL as 'https://localhost/...'. 
    // This intercepts and forces the correct production domain so GitHub OAuth works perfectly.
    const req = context.request;
    const url = new URL(req.url);

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
        if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
            const protocol = req.headers.get('x-forwarded-proto') || 'https';
            const fixedUrl = new URL(`${protocol}://${host}${url.pathname}${url.search}`);
            Object.defineProperty(req, 'url', { get: () => fixedUrl.toString() });
        }
    }

    return keystaticHandler(context);
};
