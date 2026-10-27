import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
const password = 'browser-test-password';
async function signIn(page: Page, email: string) {
  await page.goto('/login'); await page.getByLabel('Email address').fill(email); await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click(); await expect(page).toHaveURL(/\/requests$/);
}
async function signOut(page: Page) { await page.goto('/account'); await page.getByRole('button', { name: 'Sign out', exact: true }).click(); await expect(page).toHaveURL(/\/$/); }

test('persists saved equipment and quote decisions through the real API and cookie sessions', async ({ page }) => {
  const email = `builder-${Date.now()}@browser.test`;
  await page.goto('/saved'); await expect(page).toHaveURL(/\/login/);
  await page.getByRole('button', { name: 'New here? Create an account' }).click();
  await page.getByLabel('Your name').fill('Project Builder'); await page.getByLabel('Email address').fill(email); await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create account', exact: true }).click(); await expect(page).toHaveURL(/\/saved$/);
  await page.goto('/equipment'); await page.getByRole('button', { name: 'Save CAT 320 Excavator', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Unsave CAT 320 Excavator', exact: true })).toBeVisible();
  await page.reload(); await expect(page.getByRole('button', { name: 'Unsave CAT 320 Excavator', exact: true })).toBeVisible();
  await page.goto('/equipment/1'); await page.getByRole('link', { name: 'Request this equipment' }).click();
  await page.getByLabel('Project location', { exact: true }).fill('Ikeja, Lagos');
  await page.getByLabel('Number of days').fill('3'); await page.getByRole('button', { name: 'Submit quote request' }).click();
  await expect(page.getByText('Your request has been submitted.', { exact: false }).first()).toBeVisible();
  await page.getByRole('link', { name: 'View my requests' }).click(); await expect(page.locator('.project-request')).toHaveCount(1);
  await expect(page.locator('.project-request')).toContainText('540,000');
  await page.reload(); await expect(page.locator('.draft-badge')).toHaveText('submitted');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('sl-')))).toEqual([]);
  await signOut(page); await signIn(page, 'owner@browser.test');
  await page.getByLabel('Complete amount (₦)').fill('600000'); await page.getByLabel('What is included?').fill('Delivery included');
  await page.getByRole('button', { name: 'Send quote', exact: true }).click(); await expect(page.locator('.draft-badge')).toHaveText('quoted');
  await signOut(page); await signIn(page, email); await page.getByRole('button', { name: 'Accept quote' }).click();
  await expect(page.locator('.draft-badge')).toHaveText('accepted'); await page.reload(); await expect(page.locator('.draft-badge')).toHaveText('accepted');
});

test('submits owner inventory for review and keeps pending listings out of the catalog', async ({ page }) => {
  await signIn(page, 'owner@browser.test'); await page.goto('/list-equipment');
  await page.getByLabel('Equipment name', { exact: true }).fill('Browser Test Generator');
  await page.getByLabel('Capacity / specification').fill('100 kVA');
  await page.getByLabel('Tell us about the equipment').fill('A reliable generator for site work');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Daily rate (₦)').fill('45000'); await page.getByLabel('Area / neighbourhood').fill('Ajah'); await page.getByLabel('Business name').fill('Power Rentals');
  await page.getByRole('button', { name: 'Continue', exact: true }).click(); await page.getByRole('button', { name: 'Submit listing', exact: true }).click();
  await expect(page.getByText('Your listing has been submitted for review.', { exact: false })).toBeVisible();
  await page.getByRole('link', { name: 'My equipment', exact: true }).click(); await expect(page.locator('.my-equipment-list')).toContainText('Browser Test Generator');
  await page.reload(); await expect(page.locator('.my-equipment-list')).toContainText('pending');
  await page.goto('/equipment'); await expect(page.locator('.catalog-grid')).not.toContainText('Browser Test Generator');
});

test('shows API failures without falling back to sample inventory', async ({ page }) => {
  await page.route('**/api/equipment?**', route => route.abort()); await page.goto('/equipment');
  await expect(page.getByRole('alert')).toContainText('Cannot reach ServiceLoop'); await expect(page.locator('.equipment-card')).toHaveCount(0);
  await page.unroute('**/api/equipment?**'); await page.getByRole('button', { name: 'Try again' }).click(); await expect(page.locator('.equipment-card')).toHaveCount(1);
});

test('shows an empty catalog when the API has no equipment', async ({ page }) => {
  await page.route('**/api/equipment?**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [], total: 0, limit: 100, offset: 0 }) }));
  await page.goto('/equipment');
  await expect(page.getByRole('heading', { name: 'No equipment matches just yet.' })).toBeVisible();
  await expect(page.locator('.equipment-card')).toHaveCount(0);
  await expect(page.getByText('CAT 320 Excavator', { exact: true })).toHaveCount(0);
  await page.goto('/');
  await expect(page.locator('#equipment .empty-state')).toBeVisible();
  await expect(page.locator('.equipment-card')).toHaveCount(0);
});

for (const port of [5183, 5184]) test(`waitlist ${port} reports success only after an API acknowledgement`, async ({ page }) => {
  await page.goto(`http://127.0.0.1:${port}`); await page.locator('#name').fill('Waitlist Builder'); await page.locator('#phone').fill('+2348012345678');
  if (port === 5184) { await page.getByLabel('Email address').fill('waitlist@browser.test'); await page.getByLabel('I am a...').selectOption('Builder / Contractor'); }
  await page.route('**/api/waitlist', route => route.abort()); await page.getByRole('button', { name: 'Join the waitlist', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Cannot reach ServiceLoop'); await expect(page.locator('.success-number')).toHaveCount(0);
  await page.unroute('**/api/waitlist'); await page.getByRole('button', { name: 'Join the waitlist', exact: true }).click(); await expect(page.locator('.success-number')).toContainText('Your interest has been recorded.');
});
