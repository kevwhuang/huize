import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, test } from 'vitest';

import ErrorNotFound from '../../src/sections/ErrorNotFound.astro';

describe('ErrorNotFound', () => {
    test('renders the 404 code and a heading', async () => {
        const container = await AstroContainer.create();

        const html = await container.renderToString(ErrorNotFound);

        expect(html).toContain('404');
        expect(html).toMatch(/<h1[^>]*>[\s\S]*?<\/h1>/);
    });
});
