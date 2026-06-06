# XFetcher 云服务器部署文档

本文档用于把 XFetcher 部署到云服务器。示例以 Linux、MySQL、宝塔 Node 项目为主，也适用于普通 SSH 环境。

## 1. 准备环境

服务器需要：

- Node.js 20 或更高版本
- npm
- MySQL
- Git
- 可选：宝塔面板 Node 项目管理

确认版本：

```bash
node -v
npm -v
git --version
mysql --version
```

## 2. 拉取代码

选择部署目录，例如：

```bash
cd /www/wwwroot
git clone https://github.com/parilion/XFetcher.git
cd XFetcher
```

如果仓库已经存在：

```bash
cd /www/wwwroot/XFetcher/XFetcher
git pull origin master
```

如果出现 `detected dubious ownership`：

```bash
git config --global --add safe.directory /www/wwwroot/XFetcher/XFetcher
git pull origin master
```

## 3. 创建 MySQL 数据库

示例：

```sql
CREATE DATABASE xfetcher DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'XFetcher'@'127.0.0.1' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON xfetcher.* TO 'XFetcher'@'127.0.0.1';
FLUSH PRIVILEGES;
```

宝塔面板里创建数据库也可以。数据库名在 Linux MySQL 上建议全部小写，例如 `xfetcher`。

## 4. 配置 `.env`

在项目根目录创建 `.env`：

```bash
cd /www/wwwroot/XFetcher/XFetcher
cp .env.example .env
```

最小可用配置：

```env
DATABASE_URL="mysql://XFetcher:your-password@127.0.0.1:3306/xfetcher"
AIHOT_SYNC_SECRET="replace-with-a-long-random-secret"
```

注意：

- `DATABASE_URL` 里的密码如果有特殊字符，需要 URL encode。
- `AIHOT_SYNC_SECRET` 要保存好，定时任务会用到。
- 不要把 `.env` 提交到 GitHub。

## 5. 安装依赖与初始化数据库

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

如果是已有非空数据库，并且第一次接入 Prisma 迁移时遇到 `P3005`，说明数据库里已经有表但没有迁移记录。生产环境不要随便删库，需要先确认数据是否可以清空；如果不能清空，需要做 Prisma baseline。

## 6. 构建项目

```bash
npm run build
```

构建成功后可以启动：

```bash
npm run start
```

默认监听：

```txt
http://服务器IP:3000
```

## 7. 宝塔 Node 项目配置

如果使用宝塔：

- 项目目录：`/www/wwwroot/XFetcher/XFetcher`
- 启动命令：`npm run start`
- 项目端口：`3000`
- Node 版本：建议 Node.js 20+
- 环境变量：确保项目目录里有 `.env`

修改代码、迁移或环境变量后，需要重启宝塔 Node 项目。

## 8. 配置定时同步

项目不会在 Next.js 进程里自动跑后台循环，推荐用服务器 cron 调用同步接口。

先创建日志目录：

```bash
mkdir -p /www/wwwroot/XFetcher/XFetcher/logs
```

手动测试同步：

```bash
cd /www/wwwroot/XFetcher/XFetcher
AIHOT_SYNC_URL="http://127.0.0.1:3000/api/aihot/sync" AIHOT_SYNC_SECRET="replace-with-a-long-random-secret" sh scripts/sync-aihot.sh
```

成功后会返回类似：

```json
{
  "selected": { "fetchedCount": 100, "insertedCount": 10, "updatedCount": 90 },
  "all": { "fetchedCount": 100, "insertedCount": 60, "updatedCount": 40 },
  "fetchedCount": 200,
  "insertedCount": 70,
  "updatedCount": 130
}
```

配置 crontab：

```bash
crontab -e
```

每 5 分钟同步一次：

```cron
*/5 * * * * cd /www/wwwroot/XFetcher/XFetcher && AIHOT_SYNC_URL="http://127.0.0.1:3000/api/aihot/sync" AIHOT_SYNC_SECRET="replace-with-a-long-random-secret" sh scripts/sync-aihot.sh >> logs/aihot-sync.log 2>&1
```

查看日志：

```bash
tail -n 50 /www/wwwroot/XFetcher/XFetcher/logs/aihot-sync.log
```

## 9. 配置访问域名

如果只通过端口访问：

```txt
http://服务器IP:3000
```

如果希望通过域名访问，需要配置 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

如果服务器上已经有其他应用占用了 80 端口，直接访问 `http://服务器IP/` 会进入那个应用；AI HOT 项目需要通过 `:3000` 或绑定单独域名访问。

## 10. 日常更新部署

以后 GitHub 有新代码时，在服务器执行：

```bash
cd /www/wwwroot/XFetcher/XFetcher
git pull origin master
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

然后重启宝塔 Node 项目或重启你的 Node 进程。

如果只是前端样式小改，也建议完整执行上述流程，避免漏掉迁移或依赖变更。

## 11. 常见问题

### 页面没有数据

检查：

```bash
cat .env
tail -n 50 logs/aihot-sync.log
```

确认：

- `DATABASE_URL` 正确。
- `AIHOT_SYNC_SECRET` 和 crontab 里的密钥一致。
- 手动执行同步接口能返回 JSON。
- 数据库里有 `AihotItem` 数据。

### `git pull` 失败：dubious ownership

执行：

```bash
git config --global --add safe.directory /www/wwwroot/XFetcher/XFetcher
```

然后重试：

```bash
git pull origin master
```

### `npx prisma migrate deploy` 报 P3005

说明数据库不是空库，但 Prisma 没有迁移历史。不要直接 `--force`。先确认是否可以清空数据库；生产已有数据时需要做 baseline。

### 本地开发页面 CSS 丢失或 SVG 巨大

通常是 `.next` 缓存混乱。停止 dev server 后清理：

```bash
rm -rf .next
npm run dev
```

Windows PowerShell：

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### 不要直接运行 `npm audit fix --force`

`--force` 可能升级大版本依赖并破坏项目。先看具体漏洞和依赖来源，再决定是否升级。
