import { getNews } from '@lib/database';

import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
    const news = await getNews();

    const items = news.map(({ data, id }) => ({
        category: data.category,
        date: data.date,
        id,
        image: data.image ?? '',
        summary: data.summary,
        title: data.title,
    }));

    return Response.json(items);
};
