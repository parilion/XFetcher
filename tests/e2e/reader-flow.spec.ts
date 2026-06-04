import { expect, test } from "@playwright/test";

test("homepage shows real-time feed heading", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");
  await expect(
    page.getByRole("heading", { name: "\u5b9e\u65f6\u6d41" }),
  ).toBeVisible();
});
