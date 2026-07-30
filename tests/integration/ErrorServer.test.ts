import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, test } from 'vitest';

import ErrorServer from '../../src/sections/ErrorServer.astro';

describe('ErrorServer', () => {
    test('renders the 500 code and a heading', async () => {
        const container = await AstroContainer.create();

        const html = await container.renderToString(ErrorServer);

        expect(html).toContain('500');
        expect(html).toMatch(/<h1[^>]*>[\s\S]*?<\/h1>/);
    });
});
