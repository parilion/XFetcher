# Repository Guidelines

## 项目结构与模块划分
`src/app` 是 Next.js App Router 入口，包含首页、`/daily`、`/status`、后台页面，以及 `src/app/api/*` 下的接口路由。`src/components` 放通用界面组件，当前按 `feed` 和 `admin` 分目录。`src/modules` 放业务逻辑，已拆分为 `accounts`、`crawler`、`translation`。数据库相关文件在 `prisma/schema.prisma`，共享工具放在 `src/lib`。测试分为 `tests/unit`、`tests/integration`、`tests/e2e`。

## 开发、构建与测试命令
- `npm run dev`：启动本地开发环境。
- `npm run build`：生产构建，并检查类型与路由可构建性。
- `npm run lint`：运行 ESLint。
- `npm run test`：运行 Vitest，只覆盖单元与集成测试。
- `npx playwright test`：运行端到端测试。
- `npx prisma generate`：Schema 修改后重新生成 Prisma Client。

首次开发前先复制 `.env.example` 到 `.env`，再补齐数据库、Redis、代理等配置。

## 代码风格与命名
默认使用 TypeScript。组件、模块尽量小而清晰，避免把页面、抓取、翻译逻辑混在一个文件里。文件名优先使用 `kebab-case`，如 `post-card.tsx`；变量和函数使用 `camelCase`；组件名和类型名使用 `PascalCase`。路由文件遵循 Next.js 约定，如 `page.tsx`、`route.ts`。提交前至少运行一次 `npm run lint`。

## 测试约定
Vitest 文件使用 `*.test.ts`，Playwright 文件使用 `*.spec.ts`。新增模块逻辑时补 `unit` 测试；新增 API 行为时补 `integration` 测试；改动页面流程时补 `e2e`。常用命令：

- `npm run test`
- `npx playwright test tests/e2e/reader-flow.spec.ts`

## 提交与合并规范
当前历史主要使用 `feat:`、`fix:`、`test:`、`docs:` 前缀，例如 `feat: add admin pages and api skeletons`。提交信息保持短句、聚焦单一改动。提交或发起 PR 前，至少附上 `lint`、`test`、`build` 的结果；涉及界面改动时补截图。

## 测试与部署注意事项
- Playwright 当前配置为使用本机 Chrome，见 `playwright.config.ts` 中的 `channel: "chrome"`。不要随意切回默认 Chromium，否则本机未安装匹配浏览器时会直接失败。
- `vitest.config.ts` 必须排除 `tests/e2e/**`，否则 `npm run test` 会误执行 Playwright 用例并报错。
- ESLint 需要忽略 `.next/`、`node_modules/`、`test-results/`；这些目录也应保持在 `.gitignore` 中。
- 直接运行 `npx prisma validate` 需要提供 `DATABASE_URL`。仓库里的 schema 校验测试已经通过注入测试环境变量处理，不要误判为 schema 本身损坏。
- 不要提交真实代理、数据库或生产环境密钥；`.env` 只保留本地使用。
