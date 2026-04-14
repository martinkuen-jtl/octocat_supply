import { test, expect } from '@playwright/test';

/**
 * Loupe (magnifier) E2E tests
 *
 * Covers:
 * - Alt+L shows the loupe overlay
 * - Alt+L again hides the loupe
 * - Loupe renders the magnifying-glass icon
 * - Loupe is available across different routes
 */

test.describe('Loupe magnifier', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Alt+L shows the loupe overlay', async ({ page }) => {
    // The loupe should not be present initially
    await expect(page.locator('[data-loupe]')).toHaveCount(0);

    // Press Alt+L (focus must not be in an input)
    await page.keyboard.press('Alt+l');

    // The loupe overlay should now be visible
    const loupe = page.locator('[data-loupe]');
    await expect(loupe).toBeVisible();
  });

  test('Alt+L toggles the loupe off', async ({ page }) => {
    // Open
    await page.keyboard.press('Alt+l');
    await expect(page.locator('[data-loupe]')).toBeVisible();

    // Close
    await page.keyboard.press('Alt+l');
    await expect(page.locator('[data-loupe]')).toHaveCount(0);
  });

  test('Loupe shows a magnifying-glass icon', async ({ page }) => {
    await page.keyboard.press('Alt+l');

    const loupe = page.locator('[data-loupe]');
    await expect(loupe).toBeVisible();

    // The loupe contains an SVG circle (the lens of the magnifying-glass icon)
    await expect(loupe.locator('svg circle')).toBeVisible();
  });

  test('Loupe is available on the Products route', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('h1:has-text("Products")')).toBeVisible();

    await page.keyboard.press('Alt+l');
    await expect(page.locator('[data-loupe]')).toBeVisible();
  });

  test('Alt+L inside an input does not open the loupe', async ({ page }) => {
    await page.goto('/products');

    // Focus a search input and press Alt+L
    const searchInput = page.locator('input[aria-label="Search products"]');
    await searchInput.focus();
    await page.keyboard.press('Alt+l');

    // Loupe should NOT appear while typing
    await expect(page.locator('[data-loupe]')).toHaveCount(0);
  });
});
