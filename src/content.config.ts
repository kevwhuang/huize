import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const bases = defineCollection({
    loader: glob({ base: 'src/content/bases', pattern: '**/*.json' }),
    schema: z.object({
        name: z.string(),
        region: z.string(),
    }).strict(),
});

const collection = defineCollection({
    loader: file('src/content/collection.json'),
    schema: z.object({}),
});

const institutions = defineCollection({
    loader: glob({ base: 'src/content/institutions', pattern: '**/*.json' }),
    schema: z.object({
        address: z.string(),
        brand: z.string(),
        name: z.string(),
    }).strict(),
});

const investors = defineCollection({
    loader: glob({ base: 'src/content/investors', pattern: '**/*.json' }),
    schema: z.object({
        facts: z.array(z.string()),
        name: z.string(),
    }).strict(),
});

const news = defineCollection({
    loader: glob({ base: 'src/content/news', pattern: '**/*.json' }),
    schema: z.object({
        category: z.enum(['company', 'industry']),
        date: z.string(),
        image: z.string().optional(),
        summary: z.string(),
        title: z.string(),
    }).strict(),
});

const pages = defineCollection({
    loader: glob({ base: 'src/content/pages', pattern: '**/*.json' }),
    schema: z.object({
        description: z.string(),
        eyebrow: z.string().optional(),
        heading: z.string().optional(),
        title: z.string(),
    }).strict(),
});

const provinces = defineCollection({
    loader: glob({ base: 'src/content/provinces', pattern: '**/*.json' }),
    schema: z.object({
        cities: z.number(),
        institutions: z.number(),
        name: z.string(),
        sample: z.array(z.string()),
    }).strict(),
});

const regions = defineCollection({
    loader: glob({ base: 'src/content/regions', pattern: '**/*.json' }),
    schema: z.object({
        name: z.string(),
        provinces: z.array(z.object({
            cities: z.array(z.string()),
            name: z.string(),
        }).strict()),
    }).strict(),
});

const sectionItem = z.object({
    bullets: z.array(z.string()).optional(),
    english: z.string().optional(),
    href: z.string().optional(),
    icon: z.string().optional(),
    image: z.string().optional(),
    label: z.string().optional(),
    note: z.string().optional(),
    number: z.string().optional(),
    suffix: z.string().optional(),
    tags: z.array(z.string()).optional(),
    text: z.string().optional(),
    title: z.string().optional(),
    value: z.string().optional(),
}).strict();

const sections = defineCollection({
    loader: glob({ base: 'src/content/sections', pattern: '**/*.json' }),
    schema: z.object({
        badge: z.string().optional(),
        caption: z.string().optional(),
        eyebrow: z.string().optional(),
        groups: z.record(z.string(), z.array(sectionItem)).optional(),
        heading: z.string().optional(),
        lead: z.string().optional(),
        note: z.string().optional(),
        paragraphs: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
    }).strict(),
});

const services = defineCollection({
    loader: glob({ base: 'src/content/services', pattern: '**/*.json' }),
    schema: z.object({
        bullets: z.array(z.string()),
        english: z.string(),
        headline: z.string(),
        id: z.string(),
        image: z.string(),
        label: z.string(),
        number: z.string(),
        path: z.string(),
        subtitle: z.string(),
        summary: z.string(),
    }).strict(),
});

const site = defineCollection({
    loader: glob({ base: 'src/content/site', pattern: '**/*.json' }),
    schema: z.object({
        baseThemes: z.array(z.string()),
        publicHospitals: z.number(),
        totalCities: z.number(),
        totalInstitutions: z.number(),
    }).strict(),
});

export const collections = { bases, collection, institutions, investors, news, pages, provinces, regions, sections, services, site };
