import { expect, test } from '@playwright/test';

test.describe('404 page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/this-page-does-not-exist');
    });

    test('displays the 404 code', async ({ page }) => {
        await expect(page.locator('.error-page__code')).toContainText('404');
    });

    test('returns 404 status', async ({ page }) => {
        const response = await page.request.get('/this-page-does-not-exist');

        expect(response.status()).toBe(404);
    });
});
