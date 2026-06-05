# XFetcher

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
