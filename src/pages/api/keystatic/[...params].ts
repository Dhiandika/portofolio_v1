// ⚠️ CRITICAL: DO NOT DELETE OR MODIFY THIS FILE ⚠️
// This file explicitly sets `prerender = false` to fix build errors with static output.
export const prerender = false;

import { makeHandler } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';

export const ALL = makeHandler({
    config,
});
