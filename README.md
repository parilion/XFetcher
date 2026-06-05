# XFetcher

## 本地开发

1. 安装依赖：`npm install`
2. 复制环境变量：`cp .env.example .env`
3. 按实际环境填写 `.env`，其中代理字段只是示例占位值，不可直接用于生产
4. 启动数据库和 Redis
5. 生成 Prisma Client：`npx prisma generate`
6. 执行迁移：`npx prisma migrate dev`
7. 启动开发环境：`npm run dev`

## AI HOT 定时同步

项目通过 `POST /api/aihot/sync` 把 AI HOT 最新精选写入本地 MySQL，并用上游 `id` 去重。生产环境建议用云服务器 cron 定时调用该接口，而不是在 Next.js 进程里跑后台循环。

服务器环境变量示例：

```bash
export AIHOT_SYNC_URL="https://your-domain.com/api/aihot/sync"
export AIHOT_SYNC_SECRET="your-production-secret"
```

crontab 示例，每 5 分钟同步一次：

```cron
*/5 * * * * cd /path/to/XFetcher && AIHOT_SYNC_URL="https://your-domain.com/api/aihot/sync" AIHOT_SYNC_SECRET="your-production-secret" sh scripts/sync-aihot.sh >> logs/aihot-sync.log 2>&1
```

本地手动触发示例：

```bash
AIHOT_SYNC_URL="http://localhost:3000/api/aihot/sync" AIHOT_SYNC_SECRET="your-local-secret" sh scripts/sync-aihot.sh
```

## 第一版范围

- 抓取白名单账号原创帖
- 保存原文与中文翻译
- 展示实时流、今日汇总、系统状态
- 通过网页管理账号、分组和设置
