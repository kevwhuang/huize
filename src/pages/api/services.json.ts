import { getServices } from '@lib/database';

import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
    const services = await getServices();

    const items = services.map(({ data }) => ({
        bullets: data.bullets,
        english: data.english,
        headline: data.headline,
        id: data.id,
        image: data.image,
        label: data.label,
        number: data.number,
        path: data.path,
        subtitle: data.subtitle,
        summary: data.summary,
    }));

    return Response.json(items);
};
