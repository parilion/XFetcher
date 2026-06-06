# XFetcher

XFetcher 是一个基于 AI HOT 公共 API 的 AI 资讯聚合项目。项目会定时同步 [aihot.virxact.com](https://aihot.virxact.com) 的资讯到本地 MySQL，并在前端展示「精选」「全部 AI 动态」和「AI 日报」。

当前前端使用 Next.js App Router、React、Tailwind CSS 和 Prisma，页面风格参考 AI HOT 浅色模式。

## 功能

- 精选页 `/`：展示 AI HOT `mode=selected` 内容。
- 全部 AI 动态 `/all`：展示 AI HOT `mode=all` 全量内容。
- AI 日报 `/daily`：展示 AI HOT 每日整理内容，并支持历史日报 `/daily/[date]`。
- 分类筛选：模型、产品、行业、论文、观点。
- 搜索：支持按标题、摘要、来源搜索。
- 分页：信息流使用 URL 分页，例如 `/all?page=2`。
- 数据持久化：AI HOT 动态写入 MySQL，用上游 `id` 去重。
- 定时同步：通过服务器 cron 调用 `POST /api/aihot/sync`。

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma
- MySQL
- Vitest
- Playwright

## 项目结构

```txt
src/app                 Next.js App Router 页面和 API 路由
src/components          前端组件
src/components/feed     信息流、分类、卡片、分页组件
src/components/daily    AI 日报页面组件
src/lib                 AI HOT API 客户端、数据库连接等
src/modules/aihot       AI HOT 同步、入库、查询逻辑
prisma                  Prisma schema 和数据库迁移
scripts                 定时同步脚本
tests                   单元、集成、端到端测试
docs                    项目文档
```

## 本地开发

1. 安装依赖：

```bash
npm install
```

2. 复制环境变量：

```bash
cp .env.example .env
```

3. 填写 `.env`：

```env
DATABASE_URL="mysql://user:password@127.0.0.1:3306/xfetcher"
AIHOT_SYNC_SECRET="change-me-to-a-long-random-secret"
```

其他代理、Redis 字段目前主要是历史占位或预留配置，生产环境不要填写真实密钥到仓库。

4. 生成 Prisma Client：

```bash
npx prisma generate
```

5. 执行数据库迁移：

```bash
npx prisma migrate deploy
```

本地新库也可以使用：

```bash
npx prisma migrate dev
```

6. 启动开发环境：

```bash
npm run dev
```

访问：

```txt
http://localhost:3000
```

## 同步 AI HOT 数据

同步接口：

```txt
POST /api/aihot/sync
```

请求头：

```txt
x-sync-secret: <AIHOT_SYNC_SECRET>
```

同步时会同时抓取：

```txt
GET https://aihot.virxact.com/api/public/items?mode=selected&take=100
GET https://aihot.virxact.com/api/public/items?mode=all&take=100
```

精选内容会写入 `isSelected=true`，全部动态直接入库。同一条上游资讯按 `id` 去重。

本地手动触发示例：

```bash
AIHOT_SYNC_URL="http://localhost:3000/api/aihot/sync" AIHOT_SYNC_SECRET="your-local-secret" sh scripts/sync-aihot.sh
```

云服务器建议用 cron 定时调用，详见 [docs/deployment.md](docs/deployment.md)。

## 测试与构建

```bash
npm run lint
npm run test
npm run build
```

端到端测试：

```bash
npx playwright test
```

注意：不要在 `npm run dev` 正在运行时频繁执行 `npm run build`。如果本地页面出现 CSS 404、巨大 SVG、Next chunk 报错等情况，通常是 `.next` 缓存混乱，处理方式：

```bash
# 停止 dev server 后
rm -rf .next
npm run dev
```

Windows PowerShell：

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | MySQL 连接地址 |
| `AIHOT_SYNC_SECRET` | 同步接口密钥，用于保护 `/api/aihot/sync` |
| `REDIS_URL` | 预留配置 |
| `X_SOURCE_ADAPTER` | 预留配置 |
| `PROXY_*` | 代理配置占位，不要提交真实值 |

## 开源注意事项

- 不要提交 `.env`、数据库密码、代理账号、生产密钥。
- 不要提交 `.next/`、`node_modules/`、`test-results/`、日志文件。
- 使用 AI HOT 数据时请遵守其 API 使用说明，避免高频请求。
- 摘要内容以原文链接为准，引用前请回到原始来源核对。
