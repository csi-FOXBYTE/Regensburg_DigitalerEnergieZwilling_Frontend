import { expect, test } from '@playwright/test';

test.describe('submission deletion links', () => {
  test('checks availability, cancels persistently, and stays on the page', async ({
    page,
  }) => {
    await page.route('**/api/public/submissions/test-token/status', (route) =>
      route.fulfill({ json: { available: true } }),
    );

    await page.goto('/en/delete/test-token');
    await expect(
      page.getByRole('heading', { name: 'Really delete data?' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(
      page.getByText('Your submitted data has not been deleted.'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/en\/delete\/test-token$/);
    await expect(
      page.getByRole('link', { name: 'Open application' }),
    ).toHaveAttribute('href', '/en');
  });

  test('deletes only after confirmation and shows a persistent result', async ({
    page,
  }) => {
    let deleteRequests = 0;
    await page.route('**/api/public/submissions/test-token/status', (route) =>
      route.fulfill({ json: { available: true } }),
    );
    await page.route('**/api/public/submissions/test-token', async (route) => {
      if (route.request().method() === 'DELETE') deleteRequests += 1;
      await route.fulfill({ json: { success: true } });
    });

    await page.goto('/en/delete/test-token');
    expect(deleteRequests).toBe(0);
    await page.getByRole('button', { name: 'Yes, delete data' }).click();

    await expect(
      page.getByText(
        'Your submitted data has been permanently deleted from the city server.',
      ),
    ).toBeVisible();
    expect(deleteRequests).toBe(1);
    await expect(page).toHaveURL(/\/en\/delete\/test-token$/);
  });

  test('uses one neutral unavailable state for a missing token', async ({
    page,
  }) => {
    await page.route('**/api/public/submissions/missing/status', (route) =>
      route.fulfill({ status: 404, json: {} }),
    );

    await page.goto('/en/delete/missing');
    await expect(
      page.getByRole('heading', { name: 'Deletion link unavailable' }),
    ).toBeVisible();
  });

  test('offers retry for a service failure', async ({ page }) => {
    let statusRequests = 0;
    await page.route(
      '**/api/public/submissions/retry/status',
      async (route) => {
        statusRequests += 1;
        await route.fulfill(
          statusRequests === 1
            ? { status: 503, json: {} }
            : { json: { available: true } },
        );
      },
    );

    await page.goto('/en/delete/retry');
    await expect(
      page.getByRole('heading', { name: 'Service temporarily unavailable' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(
      page.getByRole('heading', { name: 'Really delete data?' }),
    ).toBeVisible();
  });
});
