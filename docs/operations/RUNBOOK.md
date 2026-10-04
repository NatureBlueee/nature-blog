# Operations Runbook

## 1. 本地启动

```bash
npm ci
npm run dev
```

默认地址：`http://localhost:3000`。

Node.js 要求：`>=20.9.0`。

## 2. 环境变量模式

### 2.1 完整内容模式

```env
NOTION_TOKEN=secret_xxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REVALIDATE_SECRET=至少16字符
NEXT_PUBLIC_SITE_URL=https://natureblueee.com
```

用途：本地完整内容验证、预发布、生产。

### 2.2 无 Notion 降级模式

不设置 `NOTION_TOKEN` / `NOTION_DATABASE_ID`。

预期行为：

- `npm run build` 通过。
- 首页、列表、feed、sitemap 使用空内容降级。
- `/api/version` 返回 503 JSON。
- `/api/revalidate` 在无 `REVALIDATE_SECRET` 时返回 503 JSON。

## 3. 日常 CI 与构建交付

使用 Node.js 22；依赖以 `package-lock.json` 为准，运行 `npm ci` 后执行 `npm run verify`。同一入口供本地与 `.github/workflows/ci.yml` 使用：lint → 回归测试 → SEO 静态检查 → 无 CMS 凭据的生产构建 → 生产服务器 HTTP 检查。修改检查组合只改 `package.json`；服务使用检查集中在 `scripts/smoke.mjs`。普通 main/ci 分支 push、PR 和手动运行触发云 CI，同分支新运行取消旧运行。失败日志在对应 Actions step，本地运行同名命令定位。

通过后保留 7 天的 `blog-build-<commit>` 包，包含已验证的 `.next`、静态资源、锁文件和运行配置，另有 SHA256 与源提交。下载后 `sha256sum -c blog-build.sha256`、解包、`npm ci --omit=dev`、`npm run smoke` 可重用同一构建；不要把构建缓存当作交付产物。工作流不持有 Notion 或部署凭据。更新 Node 主版本在此处和 workflow 一起改；依赖更新通过锁文件和现有 Dependabot，重复运行相同入口。

无 CMS 检查验证空内容降级、公开 Feed/SEO 和 API 的 503；真实文章、Notion 刷新和生产发布仍按第 7 节，在具备实际配置的获授权环境验收。当前 CI 不实施生产部署，代码回退也不会回退 Notion 内容。

### 额外环境检查（按改动需要）

```bash
npm run lint
npm run build
npm run seo:check
env -u NOTION_TOKEN -u NOTION_DATABASE_ID npm run build
NOTION_TOKEN=secret_test NOTION_DATABASE_ID=00000000000000000000000000000000 npm run build
```

测试 Notion env 使用无效 token 时，Notion 401 可以出现，但构建必须继续并正常退出。

## 4. HTTP Smoke

启动 dev server 后检查：

```bash
/usr/bin/curl -I http://localhost:3000/
/usr/bin/curl -I http://localhost:3000/posts
/usr/bin/curl -I http://localhost:3000/about
/usr/bin/curl -I http://localhost:3000/feed.xml
/usr/bin/curl -I http://localhost:3000/atom.xml
/usr/bin/curl -I http://localhost:3000/feed.json
/usr/bin/curl -I http://localhost:3000/robots.txt
/usr/bin/curl -I http://localhost:3000/sitemap.xml
/usr/bin/curl -I http://localhost:3000/llms.txt
/usr/bin/curl -I http://localhost:3000/api/version
/usr/bin/curl -I http://localhost:3000/api/revalidate
```

无 env 模式下：

- 页面和公开文本端点应为 200。
- `/api/version` 应为 503。
- `/api/revalidate` 应为 503。

## 5. 浏览器 Smoke

至少打开：

- `/`
- `/posts`
- `/about`
- 一篇真实文章 `/posts/[id]`，需要真实 Notion env

React/UI 改动额外要求：

- desktop 和 mobile 都检查。
- 关注布局、配色、动效意图和主要视觉层级。
- 水印、烟雾、光标这类动效不要求逐像素一致，但不能改变设计目标。

## 6. 常见故障

| 现象 | 先查 | 处理 |
|---|---|---|
| build 在 page data 阶段因 Notion env 失败 | `src/lib/env.ts` | 确认 Notion env 是可选读取，页面路径使用降级 |
| `/api/version` 500 | Notion token/database 是否真实可用 | 无配置应 503；外部 API 错误才 500 |
| `/api/revalidate` 401 | Authorization header 或 query secret | 确认 secret 与 env 完全一致 |
| lint 扫到 `digital-desktop/**` | `eslint.config.mjs` | 保持 legacy ignore |
| 页面空文章列表 | env 和 Notion query | 无 env 是预期；真实 env 下查 Notion 字段和状态 |
| `baseline-browser-mapping` warning | dependency freshness | 本轮不升级；另开依赖维护任务 |
| 3 个 `<img>` warning | ArticleContent / InnerScreen | 本轮保留；换 `next/image` 需视觉/性能 Epic |

## 7. 发布前检查

- `npm run lint`
- `npm run build`
- `npm run seo:check`
- 真实 Notion env 构建或预发布验证
- 公开 URL smoke
- feed/sitemap/robots/llms smoke
- 文章详情 smoke
- 确认 `.env*` 未提交
