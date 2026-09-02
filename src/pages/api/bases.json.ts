import { getBases } from '@lib/database';

import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
    const bases = await getBases();

    const items = bases.map(({ data, id }) => ({
        id,
        name: data.name,
        region: data.region,
    }));

    return Response.json(items);
};
