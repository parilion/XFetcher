import { expect, test } from "@playwright/test";

test("admin accounts page is accessible", async ({ page }) => {
  await page.goto("/admin/accounts");

  await expect(page.getByRole("heading", { name: "账号管理" })).toBeVisible();
  await expect(page.getByText("账号表单骨架待后续任务接入。")).toBeVisible();
});

test("admin groups page is accessible", async ({ page }) => {
  await page.goto("/admin/groups");

  await expect(page.getByRole("heading", { name: "分组管理" })).toBeVisible();
  await expect(page.getByText("分组表单骨架待后续任务接入。")).toBeVisible();
});

test("admin settings page is accessible", async ({ page }) => {
  await page.goto("/admin/settings");

  await expect(page.getByRole("heading", { name: "系统设置" })).toBeVisible();
  await expect(page.getByText("设置表单骨架待后续任务接入。")).toBeVisible();
});
