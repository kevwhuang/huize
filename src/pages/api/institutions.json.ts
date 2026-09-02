import { getInstitutions } from '@lib/database';

import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
    const institutions = await getInstitutions();

    const items = institutions.map(({ data, id }) => ({
        address: data.address,
        brand: data.brand,
        id,
        name: data.name,
    }));

    return Response.json(items);
};
