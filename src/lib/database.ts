import { createHash } from 'node:crypto';
import { getCollection, getEntry } from 'astro:content';

import type { CollectionEntry } from 'astro:content';

const EDIT_NAMESPACE = '3f6c1e84-9b2d-4a57-8e10-c5d7a2b904f1';
const HYPHEN_PATTERN = /-/g;
const SITE_ID = 'main';
const VARIANT_MASK = 0x3;
const VARIANT_TAG = 0x8;

function compareIds(first: { id: string }, second: { id: string }) {
    return Number.parseInt(first.id, 10) - Number.parseInt(second.id, 10);
}

function compareKeys(first: { id: string }, second: { id: string }) {
    return first.id.localeCompare(second.id);
}

export async function getBases(): Promise<CollectionEntry<'bases'>[]> {
    const entries = await getCollection('bases');

    return entries.sort(compareKeys);
}

export function getEditId(key: string): string {
    const namespace = Buffer.from(EDIT_NAMESPACE.replace(HYPHEN_PATTERN, ''), 'hex');

    const digest = createHash('sha1').update(namespace).update(key, 'utf8').digest('hex');

    const variant = ((Number.parseInt(digest.slice(16, 17), 16) & VARIANT_MASK) | VARIANT_TAG).toString(16);

    return `${digest.slice(0, 8)}-${digest.slice(8, 12)}-5${digest.slice(13, 16)}-${variant}${digest.slice(17, 20)}-${digest.slice(20, 32)}`;
}

export async function getInstitutions(): Promise<CollectionEntry<'institutions'>[]> {
    const entries = await getCollection('institutions');

    return entries.sort(compareKeys);
}

export async function getInvestors(): Promise<CollectionEntry<'investors'>[]> {
    const entries = await getCollection('investors');

    return entries.sort(compareKeys);
}

export async function getNews(): Promise<CollectionEntry<'news'>[]> {
    const entries = await getCollection('news');

    return entries.sort((first, second) => second.data.date.localeCompare(first.data.date) || compareKeys(first, second));
}

export async function getPage(slug: string): Promise<CollectionEntry<'pages'>['data']> {
    const entry = await getEntry('pages', slug);

    if (!entry) throw new Error(`The pages collection has no entry named "${slug}".`);

    return entry.data;
}

export async function getProvinces(): Promise<CollectionEntry<'provinces'>[]> {
    const entries = await getCollection('provinces');

    return entries.sort((first, second) => second.data.institutions - first.data.institutions || compareKeys(first, second));
}

export async function getRegions(): Promise<CollectionEntry<'regions'>[]> {
    const entries = await getCollection('regions');

    return entries.sort(compareIds);
}

export async function getSection(slug: string): Promise<CollectionEntry<'sections'>['data']> {
    const entry = await getEntry('sections', slug);

    if (!entry) throw new Error(`The sections collection has no entry named "${slug}".`);

    return entry.data;
}

export async function getServices(): Promise<CollectionEntry<'services'>[]> {
    const entries = await getCollection('services');

    return entries.sort(compareIds);
}

export async function getSite(): Promise<CollectionEntry<'site'>['data']> {
    const entry = await getEntry('site', SITE_ID);

    if (!entry) throw new Error(`The site collection has no entry named "${SITE_ID}".`);

    return entry.data;
}
