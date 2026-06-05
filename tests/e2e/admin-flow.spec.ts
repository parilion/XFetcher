import { expect, test } from "@playwright/test";

test("admin accounts page is accessible", async ({ page }) => {
  await page.goto("/admin/accounts");

  await expect(page.getByRole("heading", { name: "账号管理" })).toBeVisible();
});

test("admin groups page is accessible", async ({ page }) => {
  await page.goto("/admin/groups");

  await expect(page.getByRole("heading", { name: "分组管理" })).toBeVisible();
});

test("admin settings page is accessible", async ({ page }) => {
  await page.goto("/admin/settings");

  await expect(page.getByRole("heading", { name: "系统设置" })).toBeVisible();
});
