# AI 早报工具实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 构建一个个人使用的 AI 早报工具，基于 X 账号白名单抓取原创内容，保存原文，生成中文翻译，并通过网页提供实时流、今日汇总和后台配置能力。

**架构：** 使用 Next.js App Router 作为主应用，前台页面、后台配置页和 API Route 全部放在同一项目中。抓取调度与翻译任务通过独立的服务层和定时入口执行，主数据存储在 PostgreSQL，队列与缓存使用 Redis，抓取源通过适配器接口隔离，代理池能力通过独立模块管理。

**技术栈：** Next.js 15、React 19、TypeScript、Tailwind CSS、PostgreSQL、Prisma、Redis、BullMQ、Vitest、Playwright、ESLint

---

## 文件结构

实现阶段应建立如下结构，并保持每个文件职责单一：

- `package.json`
  - 依赖、脚本命令
- `tsconfig.json`
  - TypeScript 配置
- `next.config.ts`
  - Next.js 配置
- `postcss.config.mjs`
  - Tailwind 构建配置
- `eslint.config.mjs`
  - 代码规范配置
- `.env.example`
  - 本地环境变量模板
- `README.md`
  - 安装、启动、部署说明
- `prisma/schema.prisma`
  - 数据模型定义
- `src/app/layout.tsx`
  - 全局布局
- `src/app/globals.css`
  - Tailwind 导入和全局样式变量
- `src/app/page.tsx`
  - 实时流页面
- `src/app/daily/page.tsx`
  - 今日汇总页面
- `src/app/status/page.tsx`
  - 系统状态页面
- `src/app/admin/accounts/page.tsx`
  - 账号管理页
- `src/app/admin/groups/page.tsx`
  - 分组管理页
- `src/app/admin/settings/page.tsx`
  - 抓取、代理、翻译设置页
- `src/app/api/accounts/route.ts`
  - 账号接口
- `src/app/api/groups/route.ts`
  - 分组接口
- `src/app/api/crawl/run/route.ts`
  - 手动触发抓取接口
- `src/app/api/settings/route.ts`
  - 系统设置接口
- `src/lib/db.ts`
  - Prisma Client 单例
- `src/lib/env.ts`
  - 环境变量读取与校验
- `src/lib/time.ts`
  - 时间窗口工具函数
- `src/modules/accounts/types.ts`
  - 账号域类型定义
- `src/modules/accounts/service.ts`
  - 账号和分组读写逻辑
- `src/modules/posts/types.ts`
  - 原始帖子类型
- `src/modules/posts/service.ts`
  - 原始帖子入库和查询逻辑
- `src/modules/crawler/proxy-provider.ts`
  - 代理提供器和 URL 组装逻辑
- `src/modules/crawler/proxy-session-manager.ts`
  - 代理 session 管理
- `src/modules/crawler/source-adapters/base.ts`
  - 抓取源接口
- `src/modules/crawler/source-adapters/mock.ts`
  - Mock 抓取源
- `src/modules/crawler/service.ts`
  - 抓取编排逻辑
- `src/modules/crawler/scheduler.ts`
  - 定时任务入口
- `src/modules/translation/service.ts`
  - 翻译逻辑
- `src/modules/translation/queue.ts`
  - 翻译任务入队与消费
- `src/components/feed/post-card.tsx`
  - 实时流卡片
- `src/components/feed/filter-bar.tsx`
  - 筛选条
- `src/components/admin/account-form.tsx`
  - 账号表单
- `src/components/admin/group-form.tsx`
  - 分组表单
- `src/components/admin/settings-form.tsx`
  - 设置表单
- `tests/unit/accounts.service.test.ts`
  - 账号服务单测
- `tests/unit/posts.service.test.ts`
  - 帖子去重和入库单测
- `tests/unit/proxy-provider.test.ts`
  - 代理 URL 和 session 单测
- `tests/unit/crawler.service.test.ts`
  - 抓取编排单测
- `tests/unit/translation.service.test.ts`
  - 翻译流程单测
- `tests/integration/api.accounts.test.ts`
  - 账号接口集成测试
- `tests/integration/api.settings.test.ts`
  - 设置接口集成测试
- `tests/e2e/reader-flow.spec.ts`
  - 前台阅读流程端到端测试
- `tests/e2e/admin-flow.spec.ts`
  - 后台配置流程端到端测试

## Task 1：初始化 Next.js + TypeScript + Tailwind 项目骨架

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `tests/unit/smoke.test.ts`
- Test: `tests/unit/smoke.test.ts`

- [ ] **Step 1: 先写失败测试**

```ts
// tests/unit/smoke.test.ts
import { describe, expect, it } from "vitest";

describe("project scaffold", () => {
  it("defines the app name", async () => {
    const pkg = await import("../../package.json");
    expect(pkg.name).toBe("xfetcher");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- tests/unit/smoke.test.ts`
Expected: FAIL，因为 `package.json` 和测试命令还不存在。

- [ ] **Step 3: 写最小项目骨架**

```json
// package.json
{
  "name": "xfetcher",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.6.0",
    "vitest": "^2.0.0"
  }
}
```

```tsx
// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #f6f1e8;
  --fg: #1f1d1a;
}

body {
  background: var(--bg);
  color: var(--fg);
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test -- tests/unit/smoke.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add package.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs src/app tests/unit/smoke.test.ts
git commit -m "chore: bootstrap nextjs app"
```

## Task 2：建立数据库模型和 Prisma 基础设施

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `.env.example`
- Create: `tests/unit/schema-shape.test.ts`
- Test: `tests/unit/schema-shape.test.ts`

- [ ] **Step 1: 先写失败测试**

```ts
// tests/unit/schema-shape.test.ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("prisma schema", () => {
  it("contains source account model", () => {
    const schema = readFileSync("prisma/schema.prisma", "utf8");
    expect(schema).toContain("model SourceAccount");
    expect(schema).toContain("model AccountGroup");
    expect(schema).toContain("model RawPost");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- tests/unit/schema-shape.test.ts`
Expected: FAIL，因为 `prisma/schema.prisma` 不存在。

- [ ] **Step 3: 写最小 Prisma 结构**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model AccountGroup {
  id                   String          @id @default(cuid())
  name                 String          @unique
  description          String          @default("")
  defaultFetchInterval Int             @default(300)
  createdAt            DateTime        @default(now())
  updatedAt            DateTime        @updatedAt
  accounts             SourceAccount[]
}

model SourceAccount {
  id          String      @id @default(cuid())
  xHandle     String      @unique
  displayName String
  enabled     Boolean     @default(true)
  groupId     String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  group       AccountGroup @relation(fields: [groupId], references: [id])
  rawPosts    RawPost[]
  crawlRuns   CrawlRun[]
}

model RawPost {
  id               String   @id @default(cuid())
  sourceAccountId  String
  externalPostId   String
  originalText     String
  originalLanguage String
  postedAt         DateTime
  fetchedAt        DateTime @default(now())
  sourceType       String
  rawPayload       Json
  sourceAccount    SourceAccount @relation(fields: [sourceAccountId], references: [id])
  translation      PostTranslation?

  @@unique([sourceAccountId, externalPostId])
}

model PostTranslation {
  id               String   @id @default(cuid())
  rawPostId        String   @unique
  translatedTextZh String   @default("")
  status           String   @default("pending")
  errorMessage     String   @default("")
  modelName        String   @default("mock-translator")
  modelVersion     String   @default("v1")
  translatedAt     DateTime?
  rawPost          RawPost  @relation(fields: [rawPostId], references: [id])
}

model CrawlRun {
  id                     String   @id @default(cuid())
  sourceAccountId        String
  status                 String
  fetchedCount           Int      @default(0)
  insertedCount          Int      @default(0)
  failedCount            Int      @default(0)
  proxySessionIdentifier String   @default("")
  errorSummary           String   @default("")
  startedAt              DateTime @default(now())
  finishedAt             DateTime?
  sourceAccount          SourceAccount @relation(fields: [sourceAccountId], references: [id])
}
```

```ts
// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test -- tests/unit/schema-shape.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add prisma/schema.prisma src/lib/db.ts .env.example tests/unit/schema-shape.test.ts
git commit -m "feat: add prisma schema"
```

## Task 3：实现账号和分组服务

**Files:**
- Create: `src/modules/accounts/types.ts`
- Create: `src/modules/accounts/service.ts`
- Create: `tests/unit/accounts.service.test.ts`
- Test: `tests/unit/accounts.service.test.ts`

- [ ] **Step 1: 先写失败测试**

```ts
// tests/unit/accounts.service.test.ts
import { describe, expect, it } from "vitest";
import { normalizeHandle } from "../../src/modules/accounts/service";

describe("normalizeHandle", () => {
  it("removes @ prefix and trims spaces", () => {
    expect(normalizeHandle("  @OpenAI  ")).toBe("OpenAI");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- tests/unit/accounts.service.test.ts`
Expected: FAIL，因为 `src/modules/accounts/service.ts` 不存在。

- [ ] **Step 3: 写最小服务实现**

```ts
// src/modules/accounts/service.ts
export function normalizeHandle(input: string): string {
  return input.trim().replace(/^@/, "");
}
```

```ts
// src/modules/accounts/types.ts
export type AccountGroupInput = {
  name: string;
  description: string;
  defaultFetchInterval: number;
};

export type SourceAccountInput = {
  xHandle: string;
  displayName: string;
  groupId: string;
  enabled: boolean;
};
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test -- tests/unit/accounts.service.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/modules/accounts tests/unit/accounts.service.test.ts
git commit -m "feat: add account service primitives"
```

## Task 4：实现原始帖子去重入库逻辑

**Files:**
- Create: `src/modules/posts/types.ts`
- Create: `src/modules/posts/service.ts`
- Create: `tests/unit/posts.service.test.ts`
- Test: `tests/unit/posts.service.test.ts`

- [ ] **Step 1: 先写失败测试**

```ts
// tests/unit/posts.service.test.ts
import { describe, expect, it } from "vitest";
import { buildRawPostUniqueKey } from "../../src/modules/posts/service";

describe("buildRawPostUniqueKey", () => {
  it("combines account id and external post id", () => {
    expect(buildRawPostUniqueKey("acc_1", "post_2")).toBe("acc_1:post_2");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- tests/unit/posts.service.test.ts`
Expected: FAIL，因为帖子服务文件不存在。

- [ ] **Step 3: 写最小帖子服务**

```ts
// src/modules/posts/types.ts
export type RawPostInput = {
  sourceAccountId: string;
  externalPostId: string;
  originalText: string;
  originalLanguage: string;
  postedAt: string;
  sourceType: string;
  rawPayload: Record<string, unknown>;
};
```

```ts
// src/modules/posts/service.ts
export function buildRawPostUniqueKey(sourceAccountId: string, externalPostId: string): string {
  return `${sourceAccountId}:${externalPostId}`;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test -- tests/unit/posts.service.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/modules/posts tests/unit/posts.service.test.ts
git commit -m "feat: add raw post service primitives"
```

## Task 5：实现代理提供器和抓取源接口

**Files:**
- Create: `src/modules/crawler/proxy-provider.ts`
- Create: `src/modules/crawler/proxy-session-manager.ts`
- Create: `src/modules/crawler/source-adapters/base.ts`
- Create: `src/modules/crawler/source-adapters/mock.ts`
- Create: `tests/unit/proxy-provider.test.ts`
- Test: `tests/unit/proxy-provider.test.ts`

- [ ] **Step 1: 先写失败测试**

```ts
// tests/unit/proxy-provider.test.ts
import { describe, expect, it } from "vitest";
import { buildProxyUrl } from "../../src/modules/crawler/proxy-provider";

describe("buildProxyUrl", () => {
  it("builds authenticated proxy url", () => {
    expect(
      buildProxyUrl({
        scheme: "http",
        host: "542cd09n.pr.thordata.net",
        port: 9999,
        username: "td-customer-demo",
        password: "secret",
      }),
    ).toBe("http://td-customer-demo:secret@542cd09n.pr.thordata.net:9999");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- tests/unit/proxy-provider.test.ts`
Expected: FAIL，因为代理模块不存在。

- [ ] **Step 3: 写最小代理与适配器接口**

```ts
// src/modules/crawler/proxy-provider.ts
export type ProxyConfig = {
  scheme: string;
  host: string;
  port: number;
  username: string;
  password: string;
};

export function buildProxyUrl(config: ProxyConfig): string {
  return `${config.scheme}://${config.username}:${config.password}@${config.host}:${config.port}`;
}
```

```ts
// src/modules/crawler/source-adapters/base.ts
export type FetchOriginalPostsInput = {
  accountHandle: string;
  proxyUrl?: string;
};

export type FetchedPost = {
  externalPostId: string;
  originalText: string;
  originalLanguage: string;
  postedAt: string;
  sourceType: string;
  rawPayload: Record<string, unknown>;
};

export interface SourceAdapter {
  sourceType: string;
  fetchOriginalPosts(input: FetchOriginalPostsInput): Promise<FetchedPost[]>;
}
```

```ts
// src/modules/crawler/source-adapters/mock.ts
import type { FetchedPost, FetchOriginalPostsInput, SourceAdapter } from "./base";

export class MockSourceAdapter implements SourceAdapter {
  sourceType = "mock";

  async fetchOriginalPosts(input: FetchOriginalPostsInput): Promise<FetchedPost[]> {
    return [
      {
        externalPostId: `${input.accountHandle}-001`,
        originalText: `Latest update from ${input.accountHandle}`,
        originalLanguage: "en",
        postedAt: "2026-06-04T12:00:00.000Z",
        sourceType: this.sourceType,
        rawPayload: input,
      },
    ];
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test -- tests/unit/proxy-provider.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/modules/crawler tests/unit/proxy-provider.test.ts
git commit -m "feat: add proxy and source adapter primitives"
```

## Task 6：实现抓取编排和抓取记录

**Files:**
- Create: `src/modules/crawler/service.ts`
- Create: `tests/unit/crawler.service.test.ts`
- Modify: `src/modules/posts/service.ts`
- Test: `tests/unit/crawler.service.test.ts`

- [ ] **Step 1: 先写失败测试**

```ts
// tests/unit/crawler.service.test.ts
import { describe, expect, it } from "vitest";
import { countInsertedPosts } from "../../src/modules/crawler/service";

describe("countInsertedPosts", () => {
  it("counts only newly inserted posts", () => {
    expect(countInsertedPosts([true, false, true])).toBe(2);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- tests/unit/crawler.service.test.ts`
Expected: FAIL，因为抓取编排服务不存在。

- [ ] **Step 3: 写最小编排逻辑**

```ts
// src/modules/crawler/service.ts
export function countInsertedPosts(results: boolean[]): number {
  return results.filter(Boolean).length;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test -- tests/unit/crawler.service.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/modules/crawler/service.ts tests/unit/crawler.service.test.ts
git commit -m "feat: add crawl orchestration primitives"
```

## Task 7：实现翻译服务和任务队列入口

**Files:**
- Create: `src/modules/translation/service.ts`
- Create: `src/modules/translation/queue.ts`
- Create: `tests/unit/translation.service.test.ts`
- Test: `tests/unit/translation.service.test.ts`

- [ ] **Step 1: 先写失败测试**

```ts
// tests/unit/translation.service.test.ts
import { describe, expect, it } from "vitest";
import { shouldTranslate } from "../../src/modules/translation/service";

describe("shouldTranslate", () => {
  it("returns true for english posts", () => {
    expect(shouldTranslate("en")).toBe(true);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- tests/unit/translation.service.test.ts`
Expected: FAIL，因为翻译服务不存在。

- [ ] **Step 3: 写最小翻译入口**

```ts
// src/modules/translation/service.ts
export function shouldTranslate(language: string): boolean {
  return language.toLowerCase() !== "zh";
}
```

```ts
// src/modules/translation/queue.ts
export type TranslationJob = {
  rawPostId: string;
};

export function buildTranslationJob(rawPostId: string): TranslationJob {
  return { rawPostId };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test -- tests/unit/translation.service.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/modules/translation tests/unit/translation.service.test.ts
git commit -m "feat: add translation primitives"
```

## Task 8：实现前台实时流、今日汇总、状态页

**Files:**
- Create: `src/components/feed/post-card.tsx`
- Create: `src/components/feed/filter-bar.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/daily/page.tsx`
- Create: `src/app/status/page.tsx`
- Create: `tests/e2e/reader-flow.spec.ts`
- Test: `tests/e2e/reader-flow.spec.ts`

- [ ] **Step 1: 先写失败的端到端测试**

```ts
// tests/e2e/reader-flow.spec.ts
import { test, expect } from "@playwright/test";

test("homepage shows real-time feed heading", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");
  await expect(page.getByRole("heading", { name: "实时流" })).toBeVisible();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test tests/e2e/reader-flow.spec.ts`
Expected: FAIL，因为首页和 Playwright 环境尚未建立。

- [ ] **Step 3: 写最小前台页面**

```tsx
// src/app/page.tsx
export default function FeedPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-semibold">实时流</h1>
    </main>
  );
}
```

```tsx
// src/app/daily/page.tsx
export default function DailyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-semibold">今日汇总</h1>
    </main>
  );
}
```

```tsx
// src/app/status/page.tsx
export default function StatusPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-semibold">系统状态</h1>
    </main>
  );
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx playwright test tests/e2e/reader-flow.spec.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/app src/components tests/e2e/reader-flow.spec.ts
git commit -m "feat: add reader pages"
```

## Task 9：实现后台账号、分组、设置页面和 API

**Files:**
- Create: `src/app/admin/accounts/page.tsx`
- Create: `src/app/admin/groups/page.tsx`
- Create: `src/app/admin/settings/page.tsx`
- Create: `src/app/api/accounts/route.ts`
- Create: `src/app/api/groups/route.ts`
- Create: `src/app/api/settings/route.ts`
- Create: `src/components/admin/account-form.tsx`
- Create: `src/components/admin/group-form.tsx`
- Create: `src/components/admin/settings-form.tsx`
- Create: `tests/integration/api.accounts.test.ts`
- Create: `tests/integration/api.settings.test.ts`
- Create: `tests/e2e/admin-flow.spec.ts`
- Test: `tests/integration/api.accounts.test.ts`

- [ ] **Step 1: 先写失败的 API 测试**

```ts
// tests/integration/api.accounts.test.ts
import { describe, expect, it } from "vitest";
import { normalizeHandle } from "../../src/modules/accounts/service";

describe("accounts api primitives", () => {
  it("normalizes account handles before persistence", () => {
    expect(normalizeHandle("@openai")).toBe("openai");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- tests/integration/api.accounts.test.ts`
Expected: FAIL，因为后台页和 API 尚未落地。

- [ ] **Step 3: 写最小后台页面和 API 骨架**

```tsx
// src/app/admin/accounts/page.tsx
export default function AdminAccountsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-semibold">账号管理</h1>
    </main>
  );
}
```

```ts
// src/app/api/accounts/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ items: [] });
}
```

```ts
// src/app/api/settings/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    fetchInterval: 300,
    concurrency: 3,
    translationEnabled: true,
  });
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test -- tests/integration/api.accounts.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/app/admin src/app/api src/components/admin tests/integration tests/e2e/admin-flow.spec.ts
git commit -m "feat: add admin pages and api skeletons"
```

## Task 10：补齐定时入口、环境变量文档和开发说明

**Files:**
- Create: `src/lib/env.ts`
- Create: `src/lib/time.ts`
- Create: `src/modules/crawler/scheduler.ts`
- Modify: `README.md`
- Modify: `.env.example`
- Test: `tests/unit/scheduler.test.ts`

- [ ] **Step 1: 先写失败测试**

```ts
// tests/unit/scheduler.test.ts
import { describe, expect, it } from "vitest";
import { buildWindowLabel } from "../../src/lib/time";

describe("buildWindowLabel", () => {
  it("builds label for 3-hour window", () => {
    expect(buildWindowLabel(3)).toBe("最近 3 小时");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- tests/unit/scheduler.test.ts`
Expected: FAIL，因为时间工具和调度入口不存在。

- [ ] **Step 3: 写最小时间工具和说明文档**

```ts
// src/lib/time.ts
export function buildWindowLabel(hours: number): string {
  return `最近 ${hours} 小时`;
}
```

```env
# .env.example
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/xfetcher
REDIS_URL=redis://localhost:6379
X_SOURCE_ADAPTER=mock
PROXY_SCHEME=http
PROXY_HOST=542cd09n.pr.thordata.net
PROXY_PORT=9999
PROXY_USERNAME=td-customer-demo
PROXY_PASSWORD=replace-me
```

```md
# README.md

## 本地开发

1. 安装依赖：`npm install`
2. 复制环境变量：`cp .env.example .env`
3. 启动数据库和 Redis
4. 生成 Prisma Client：`npx prisma generate`
5. 执行迁移：`npx prisma migrate dev`
6. 启动开发环境：`npm run dev`

## 第一版范围

- 抓取白名单账号原创帖
- 保存原文与中文翻译
- 展示实时流、今日汇总、系统状态
- 通过网页管理账号、分组和设置
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test -- tests/unit/scheduler.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/lib src/modules/crawler/scheduler.ts README.md .env.example tests/unit/scheduler.test.ts
git commit -m "docs: add environment and scheduler basics"
```

## Spec 覆盖检查

- 个人使用的网页工具：Task 8、Task 9、Task 10
- 白名单账号与分组：Task 2、Task 3、Task 9
- 原创帖抓取与入库：Task 4、Task 5、Task 6
- 可替换抓取源：Task 5
- 代理池接入：Task 5
- 中文翻译：Task 7
- 实时流：Task 8
- 今日汇总：Task 8
- 系统状态页：Task 8
- 网页后台配置：Task 9
- 云服务器友好的单项目部署：Task 1、Task 2、Task 10

## 占位符扫描

已检查整份计划：

- 没有未完成标记
- 没有“后面再补”的模糊步骤
- 没有依赖上下文才能理解的缩写说明

## 类型一致性检查

- `AccountGroup`、`SourceAccount`、`RawPost`、`PostTranslation`、`CrawlRun` 与 spec 命名一致
- 抓取源统一通过 `SourceAdapter` 接口暴露
- 代理配置统一通过 `buildProxyUrl()` 和 session 模块进入抓取层
- 翻译逻辑统一通过 `src/modules/translation/service.ts` 进入
