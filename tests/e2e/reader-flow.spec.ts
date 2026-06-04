import { expect, test } from "@playwright/test";

test("homepage is accessible and shows the real-time feed heading", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "\u5b9e\u65f6\u6d41" }),
  ).toBeVisible();
});

test("homepage renders placeholder filter and post content", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByText("\u5168\u90e8")).toBeVisible();
  await expect(page.getByText("\u5f85\u7ffb\u8bd1")).toBeVisible();
  await expect(page.getByRole("heading", { name: "\u793a\u4f8b\u5185\u5bb9" })).toBeVisible();
  await expect(
    page.getByText(
      "\u5b9e\u65f6\u6d41\u5185\u5bb9\u5c06\u5728\u540e\u7eed\u4efb\u52a1\u4e2d\u63a5\u5165\u3002",
    ),
  ).toBeVisible();
});

test("daily page is accessible and shows the daily summary heading", async ({
  page,
}) => {
  await page.goto("/daily");

  await expect(
    page.getByRole("heading", { name: "\u4eca\u65e5\u6c47\u603b" }),
  ).toBeVisible();
});

test("status page is accessible and shows the system status heading", async ({
  page,
}) => {
  await page.goto("/status");

  await expect(
    page.getByRole("heading", { name: "\u7cfb\u7edf\u72b6\u6001" }),
  ).toBeVisible();
});
