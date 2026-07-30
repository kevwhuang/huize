import { expect, test } from '@playwright/test';

test.describe('500 page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/500');
    });

    test('displays the 500 code', async ({ page }) => {
        await expect(page.locator('.error-page__code')).toContainText('500');
    });
});
