# XFetcher 本地部署文档

本文档用于在本地电脑启动 XFetcher，适合开发、调试和预览页面效果。

## 1. 本地环境

需要安装：

- Node.js 20 或更高版本
- npm
- MySQL
- Git

确认版本：

```bash
node -v
npm -v
git --version
mysql --version
```

Windows 用户可以使用 PowerShell 执行命令。

## 2. 获取代码

```bash
git clone https://github.com/parilion/XFetcher.git
cd XFetcher
```

如果你已经有项目目录：

```bash
cd G:\demo\XFetcher
git pull origin master
```

## 3. 安装依赖

```bash
npm install
```

## 4. 准备 MySQL

创建数据库：

```sql
CREATE DATABASE xfetcher DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

如果本地 MySQL 是 root 用户、密码 `123456`、端口 `3307`，可以使用：

```env
DATABASE_URL="mysql://root:123456@127.0.0.1:3307/xfetcher"
```

如果你的 MySQL 是默认端口 `3306`：

```env
DATABASE_URL="mysql://root:123456@127.0.0.1:3306/xfetcher"
```

## 5. 配置 `.env`

复制示例文件：

```bash
cp .env.example .env
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

最小可用配置：

```env
DATABASE_URL="mysql://root:123456@127.0.0.1:3307/xfetcher"
AIHOT_SYNC_SECRET="local-dev-secret"
```

注意：

- `.env` 不要提交到 GitHub。
- `DATABASE_URL` 里的数据库名建议使用小写 `xfetcher`。
- 本地密钥可以简单一些，生产密钥必须换成长随机字符串。

## 6. 初始化数据库

生成 Prisma Client：

```bash
npx prisma generate
```

执行迁移：

```bash
npx prisma migrate deploy
```

如果是全新的本地开发库，也可以使用：

```bash
npx prisma migrate dev
```

如果想用 `init.sql` 手动建表：

```bash
mysql -uroot -p123456 -P3307 < init.sql
```

执行后仍建议运行：

```bash
npx prisma generate
npx prisma migrate deploy
```

## 7. 启动本地项目

```bash
npm run dev
```

访问：

```txt
http://localhost:3000
```

页面：

- 精选：`http://localhost:3000/`
- 全部 AI 动态：`http://localhost:3000/all`
- AI 日报：`http://localhost:3000/daily`

## 8. 本地手动同步 AI HOT 数据

开发服务启动后，在另一个终端执行：

```bash
AIHOT_SYNC_URL="http://localhost:3000/api/aihot/sync" AIHOT_SYNC_SECRET="local-dev-secret" sh scripts/sync-aihot.sh
```

Windows PowerShell 可以用：

```powershell
$env:AIHOT_SYNC_URL="http://localhost:3000/api/aihot/sync"
$env:AIHOT_SYNC_SECRET="local-dev-secret"
sh scripts/sync-aihot.sh
```

如果本机没有 `sh`，也可以直接用 PowerShell 调接口：

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/api/aihot/sync" `
  -Headers @{ "x-sync-secret" = "local-dev-secret" }
```

成功后会返回同步统计，例如：

```json
{
  "selected": { "fetchedCount": 100, "insertedCount": 10, "updatedCount": 90 },
  "all": { "fetchedCount": 100, "insertedCount": 60, "updatedCount": 40 },
  "fetchedCount": 200,
  "insertedCount": 70,
  "updatedCount": 130
}
```

## 9. 本地验证

```bash
npm run lint
npm run test
npm run build
```

端到端测试：

```bash
npx playwright test
```

## 10. 常见问题

### 页面显示巨大蓝色图标或样式丢失

通常是 `.next` 缓存异常，CSS 没加载。

处理方式：

```powershell
# 先停止 npm run dev
Remove-Item -Recurse -Force .next
npm run dev
```

Linux/macOS：

```bash
rm -rf .next
npm run dev
```

### `npm run build` 后本地 dev 页面异常

不要在 `npm run dev` 运行时频繁执行 `npm run build`。如果需要 build：

1. 停止 `npm run dev`
2. 执行 `npm run build`
3. 清理 `.next`
4. 重新 `npm run dev`

### 页面没有数据

先手动同步：

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/api/aihot/sync" `
  -Headers @{ "x-sync-secret" = "local-dev-secret" }
```

然后刷新页面。

如果仍然没有数据，检查：

- `.env` 里的 `DATABASE_URL` 是否正确。
- MySQL 是否启动。
- `AIHOT_SYNC_SECRET` 是否和请求头一致。
- 是否已经执行 `npx prisma migrate deploy`。

### Prisma 连接不上 MySQL

检查端口：

```powershell
netstat -ano | findstr 3307
```

如果 MySQL 实际端口不是 `3307`，修改 `.env` 里的 `DATABASE_URL`。

### 端口 3000 被占用

Windows PowerShell：

```powershell
netstat -ano | findstr 3000
```

找到 PID 后结束进程：

```powershell
Stop-Process -Id <PID> -Force
```

也可以临时换端口：

```bash
npx next dev -p 3001
```
