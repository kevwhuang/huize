import type { APIRoute } from 'astro';

const NOT_FOUND_STATUS = 404;

export const prerender = false;

export const ALL: APIRoute = () => Response.json({ error: 'Not found.' }, { status: NOT_FOUND_STATUS });
