import { BRAND, LINKS } from '@lib/constants';
import { getBases, getInstitutions, getNews, getProvinces, getRegions, getServices, getSite } from '@lib/database';

import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
    const [bases, institutions, news, provinces, regions, services, site] = await Promise.all([
        getBases(),
        getInstitutions(),
        getNews(),
        getProvinces(),
        getRegions(),
        getServices(),
        getSite(),
    ]);

    return Response.json({
        brand: {
            en: BRAND.en,
            zh: BRAND.zh,
        },
        contact: {
            address: LINKS.address,
            company: LINKS.company,
            hotline: LINKS.hotline,
            shanghai: LINKS.shanghai,
            website: LINKS.website,
        },
        counts: {
            bases: bases.length,
            institutions: institutions.length,
            news: news.length,
            provinces: provinces.length,
            regions: regions.length,
            services: services.length,
        },
        network: {
            baseThemes: site.baseThemes,
            publicHospitals: site.publicHospitals,
            totalCities: site.totalCities,
            totalInstitutions: site.totalInstitutions,
        },
    });
};
