import { test, expect } from '@playwright/test';

/**
 * Loupe (magnifier) E2E tests
 *
 * Covers:
 * - Alt+L shows the loupe overlay
 * - Alt+L again hides the loupe
 * - Loupe renders the magnifying-glass icon
 * - Loupe is available across different routes
 * - Toggle button in navigation shows/hides the loupe
 * - Config page (/loupe) exists and zoom/size changes apply
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

  test.describe('Toggle button', () => {
    test('navigation contains a loupe toggle button', async ({ page }) => {
      const btn = page.locator('[data-loupe-toggle]').first();
      await expect(btn).toBeVisible();
    });

    test('button shows "Off" state initially', async ({ page }) => {
      const btn = page.locator('nav [data-loupe-toggle]');
      await expect(btn).toHaveText(/Off/i);
      await expect(btn).toHaveAttribute('aria-pressed', 'false');
    });

    test('clicking the button opens the loupe', async ({ page }) => {
      await expect(page.locator('[data-loupe]')).toHaveCount(0);

      const btn = page.locator('nav [data-loupe-toggle]');
      await btn.click();

      await expect(page.locator('[data-loupe]')).toBeVisible();
      await expect(btn).toHaveText(/On/i);
      await expect(btn).toHaveAttribute('aria-pressed', 'true');
    });

    test('clicking the button twice closes the loupe', async ({ page }) => {
      const btn = page.locator('nav [data-loupe-toggle]');
      await btn.click();
      await expect(page.locator('[data-loupe]')).toBeVisible();

      await btn.click();
      await expect(page.locator('[data-loupe]')).toHaveCount(0);
      await expect(btn).toHaveText(/Off/i);
    });

    test('button is present across routes', async ({ page }) => {
      await page.goto('/products');
      const btn = page.locator('nav [data-loupe-toggle]');
      await expect(btn).toBeVisible();

      await page.goto('/about');
      await expect(page.locator('nav [data-loupe-toggle]')).toBeVisible();
    });
  });

  test.describe('Config page (/loupe)', () => {
    test('config page is accessible', async ({ page }) => {
      await page.goto('/loupe');
      await expect(page.locator('h1')).toContainText('Loupe Settings');
    });

    test('config page has zoom and size sliders', async ({ page }) => {
      await page.goto('/loupe');
      await expect(page.locator('#loupe-zoom')).toBeVisible();
      await expect(page.locator('#loupe-size')).toBeVisible();
    });

    test('config page has a loupe toggle switch', async ({ page }) => {
      await page.goto('/loupe');
      const toggleSwitch = page.locator('[data-loupe-toggle]');
      await expect(toggleSwitch).toBeVisible();
    });

    test('settings link in nav navigates to config page', async ({ page }) => {
      await page.locator('nav a[aria-label="Loupe settings"]').click();
      await expect(page).toHaveURL(/\/loupe/);
      await expect(page.locator('h1')).toContainText('Loupe Settings');
    });

    test('changing zoom on config page takes effect', async ({ page }) => {
      await page.goto('/loupe');

      // Enable the loupe via the toggle switch on the settings page
      const toggleSwitch = page.locator('[data-loupe-toggle]');
      await toggleSwitch.click();
      await expect(page.locator('[data-loupe]')).toBeVisible();

      // Adjust zoom slider
      const zoomSlider = page.locator('#loupe-zoom');
      await zoomSlider.fill('4');

      // The zoom value label should update
      await expect(page.locator('span[aria-live="polite"]').first()).toContainText('4.0×');
    });

    test('changing size on config page takes effect', async ({ page }) => {
      await page.goto('/loupe');

      const sizeSlider = page.locator('#loupe-size');
      await sizeSlider.fill('300');

      // The size value label should update
      await expect(page.locator('span[aria-live="polite"]').last()).toContainText('300 px');
    });

    test('reset button restores defaults', async ({ page }) => {
      await page.goto('/loupe');

      // Change both values
      await page.locator('#loupe-zoom').fill('4');
      await page.locator('#loupe-size').fill('300');

      // Reset
      await page.getByRole('button', { name: /reset to defaults/i }).click();

      // Values should return to defaults (2.5 and 220 from env)
      await expect(page.locator('#loupe-zoom')).toHaveValue('2.5');
      await expect(page.locator('#loupe-size')).toHaveValue('220');
    });
  });
});

