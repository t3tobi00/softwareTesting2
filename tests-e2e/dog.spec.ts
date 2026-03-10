import { test, expect } from '@playwright/test';

test('should display a dog image when page is loaded', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  const dogImage = page.locator('img.dog-image');
  await expect(dogImage).toBeVisible({ timeout: 10000 });

  const src = await dogImage.getAttribute('src');
  expect(src).toBeTruthy();

  expect(src).toMatch(/^https:\/\//);
});

test('should display a new dog image when button is clicked', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  const dogImage = page.locator('img.dog-image');
  await expect(dogImage).toBeVisible();
  const firstSrc = await dogImage.getAttribute('src');

  const responsePromise = page.waitForResponse('**/api/dogs/random');
  await page.click('button.fetch-button');
  await responsePromise;

  const secondSrc = await dogImage.getAttribute('src');
  expect(secondSrc).toBeTruthy();

  expect(secondSrc).toMatch(/^https:\/\//);
});

test('should display an error message when the API call fails', async ({ page }) => {
  await page.route('**/api/dogs/random', route => route.abort());

  await page.goto('http://localhost:5173/');

  const errorElement = page.locator('text=/error/i');

  await expect(errorElement).toBeVisible();
});
