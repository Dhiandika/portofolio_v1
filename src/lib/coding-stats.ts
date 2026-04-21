
import fs from 'node:fs/promises';
import path from 'node:path';

const CACHE_FILE = path.resolve('./stats-cache.json');
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in ms

interface StatsData {
    wakatime: any;
    monkeytype: any;
    lastUpdated: number;
}

const WAKATIME_KEY = import.meta.env.WAKATIME_API_KEY;
const MONKEYTYPE_USER = 'npemburu6';

export async function getCodingStats() {
    // 1. Try to load from cache
    try {
        const cacheRaw = await fs.readFile(CACHE_FILE, 'utf-8');
        const cache: StatsData = JSON.parse(cacheRaw);
        const now = Date.now();

        if (now - cache.lastUpdated < CACHE_DURATION) {
            console.log('Using cached stats data');
            return cache;
        }
    } catch (e) {
        // Cache missing or invalid, ignore
    }

    console.log('Fetching new stats data...');
    const now = Date.now();
    const data: StatsData = {
        wakatime: null,
        monkeytype: null,
        lastUpdated: now
    };

    // 2. Fetch WakaTime
    try {
        if (WAKATIME_KEY) {
            // Stats for last 7 days
            const response = await fetch(`https://wakatime.com/api/v1/users/current/stats/last_7_days?api_key=${WAKATIME_KEY}`);
            if (response.ok) {
                const json = await response.json();
                data.wakatime = json.data;
            } else {
                console.error('WakaTime fetch failed:', response.statusText);
            }
        }
    } catch (e) {
        console.error('WakaTime fetch error:', e);
    }

    // 3. Fetch Monkeytype
    try {
        const response = await fetch(`https://api.monkeytype.com/users/${MONKEYTYPE_USER}/profile`);
        if (response.ok) {
            const json = await response.json();
            data.monkeytype = json.data;
        } else {
            console.error('Monkeytype fetch failed:', response.statusText);
        }
    } catch (e) {
        console.error('Monkeytype fetch error:', e);
    }

    // 4. Save to cache
    try {
        await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Failed to save cache:', e);
    }

    return data;
}
