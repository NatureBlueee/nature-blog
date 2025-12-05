# 安全方案文档

> ⚠️ **机密文档**：本文档包含安全配置细节，不应提交到公开仓库。

本文档描述了 natureblueee 博客的安全架构、威胁模型、防护措施和运维流程。

---

## 1. 安全架构概述

### 1.1 技术栈

- **框架**: Next.js 16 (ISR 静态生成)
- **数据源**: Notion API (通过 `@notionhq/client`)
- **部署**: Vercel (自动 HTTPS + HSTS)
- **运行时**: Node.js >= 18.18.0

### 1.2 安全边界

```
┌─────────────────────────────────────────┐
│  客户端浏览器                            │
│  - XSS 防护 (DOMPurify)                 │
│  - CSP 响应头                            │
│  - localStorage 过期策略                 │
└──────────────┬──────────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────────┐
│  Vercel Edge Network                     │
│  - 安全响应头 (CSP, X-Frame-Options)     │
│  - 速率限制 (API)                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Next.js Application                    │
│  - 环境变量校验 (Zod)                    │
│  - 图片代理 (Next.js Image)              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Notion API                              │
│  - 最小权限 Integration Token            │
└─────────────────────────────────────────┘
```

---

## 2. 威胁模型与防护措施

### 2.1 XSS (跨站脚本攻击)

**威胁**：Notion 返回的 Markdown 内容可能包含恶意脚本。

**防护措施**：
- ✅ 使用 `isomorphic-dompurify` 清洗所有 HTML 内容
- ✅ 白名单策略：只允许安全的 HTML 标签和属性
- ✅ CSP 响应头限制脚本执行

**实现位置**：
- `src/components/article/ArticleContent.tsx`

**配置**：
```typescript
const ALLOWED_TAGS = ['p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 
                      'pre', 'code', 'a', 'strong', 'em', 'br', 'hr'];
const ALLOWED_ATTR = ['href', 'class', 'target', 'rel'];
```

### 2.2 环境变量泄漏

**威胁**：缺失或错误的环境变量导致应用异常或信息泄漏。

**防护措施**：
- ✅ 启动时使用 Zod 验证所有必需环境变量
- ✅ Fail-fast：缺失关键变量时立即终止启动
- ✅ `.gitignore` 排除所有 `.env*` 文件

**实现位置**：
- `src/lib/env.ts`

### 2.3 API 滥用

**威胁**：`/api/version` 端点可能被恶意爬虫频繁调用。

**防护措施**：
- ✅ 内存速率限制：每分钟最多 30 次请求
- ✅ 版本信息模糊化：返回 hash 而非原始时间戳
- ✅ 自动清理过期记录，防止内存泄漏

**实现位置**：
- `src/app/api/version/route.ts`

### 2.4 图片资源安全

**威胁**：Notion S3 URL 包含 AWS 签名信息，可能暴露 bucket 结构。

**防护措施**：
- ✅ Next.js Image 组件代理，隐藏原始 URL
- ✅ 域名白名单：只允许 Notion 官方域名

**实现位置**：
- `next.config.ts` → `images.remotePatterns`

### 2.5 客户端存储隐私

**威胁**：localStorage 长期存储版本号，占用空间且可能泄漏用户行为。

**防护措施**：
- ✅ 7 天自动过期策略
- ✅ 访问时自动更新时间戳，延长有效期

**实现位置**：
- `src/hooks/useVersionCheck.ts`

---

## 3. 依赖管理策略

### 3.1 依赖锁定

- ✅ 使用 `package-lock.json` 锁定所有依赖版本
- ✅ 提交 `package-lock.json` 到版本控制
- ✅ 部署前运行 `npm ci` 确保版本一致

### 3.2 安全扫描

**自动化**：
- ✅ Dependabot 每周自动检查依赖更新
- ✅ 限制最多同时打开 5 个 PR

**手动检查**：
```bash
npm audit --production
```

**CI 集成建议**（GitHub Actions）：
```yaml
- name: Security Audit
  run: npm audit --production --audit-level=high
```

### 3.3 关键依赖

| 依赖 | 版本 | 用途 | 安全考虑 |
|------|------|------|----------|
| `next` | 16.0.3 | 框架 | 定期更新，关注安全公告 |
| `@notionhq/client` | ^2.2.15 | Notion API | 官方维护，关注更新 |
| `zod` | ^3.23.8 | 环境变量校验 | 零运行时依赖，安全 |
| `isomorphic-dompurify` | ^2.22.0 | XSS 防护 | 被 Mozilla/Google 使用 |

---

## 4. 密钥轮换流程

### 4.1 密钥清单

| 密钥 | 轮换周期 | 存储位置 | 用途 |
|------|----------|----------|------|
| `NOTION_TOKEN` | 90 天 | Vercel 环境变量 | Notion API 认证 |
| `REVALIDATE_SECRET` | 180 天 | Vercel 环境变量 | 手动刷新 API 认证 |
| `NEXT_PUBLIC_SITE_URL` | 不轮换 | Vercel 环境变量 | 站点 URL（公开） |

### 4.2 NOTION_TOKEN 轮换步骤

1. **生成新 Token**：
   - 访问 Notion Settings → Integrations
   - 选择现有 Integration 或创建新的
   - 复制新的 Integration Token

2. **更新环境变量**：
   - 登录 Vercel Dashboard
   - 进入项目 Settings → Environment Variables
   - 更新 `NOTION_TOKEN` 的值

3. **触发重新部署**：
   - 在 Vercel Dashboard 点击 "Redeploy"
   - 或推送任意 commit 触发自动部署

4. **验证**：
   - 访问网站首页，确认文章正常加载
   - 检查 Vercel 部署日志，确认无错误

5. **撤销旧 Token**（可选但推荐）：
   - 在 Notion Settings → Integrations 中删除旧 Integration
   - 或保留旧 Token 作为备份（不推荐）

### 4.3 REVALIDATE_SECRET 轮换步骤

1. **生成新密钥**：
   ```bash
   # 使用 Node.js 生成 32 位随机字符串
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```

2. **更新环境变量**：
   - 在 Vercel Dashboard 更新 `REVALIDATE_SECRET`
   - 更新本地 `.env.local`（如果使用）

3. **验证**：
   - 访问 `/api/revalidate?secret=新密钥`
   - 确认返回成功消息

---

## 5. 安全事件响应流程

### 5.1 密钥泄漏

**症状**：
- 异常 API 调用
- Notion 访问日志中出现未知 IP
- 网站内容被篡改

**响应步骤**：

1. **立即行动**（< 5 分钟）：
   - 在 Notion Settings → Integrations 中撤销泄漏的 Token
   - 生成新的 Integration Token
   - 更新 Vercel 环境变量并触发重新部署

2. **调查**（< 1 小时）：
   - 检查 Notion 历史版本，确认是否有数据被修改
   - 检查 Vercel Analytics，查看异常流量来源
   - 审查 Git 提交历史，确认密钥是否被提交到仓库

3. **恢复**（< 24 小时）：
   - 如有数据篡改，从 Notion 历史版本恢复
   - 更新所有相关密钥（包括 `REVALIDATE_SECRET`）
   - 通知用户（如适用）

### 5.2 异常流量

**症状**：
- Vercel Analytics 显示异常高的请求量
- `/api/version` 端点响应变慢
- 服务器资源使用率异常

**响应步骤**：

1. **立即行动**：
   - 检查 Vercel Analytics，确认攻击来源
   - 如需要，在 Vercel Dashboard 启用 WAF (Web Application Firewall)
   - 临时降低速率限制阈值（修改 `MAX_REQUESTS`）

2. **分析**：
   - 查看 Vercel 日志，确认攻击模式
   - 检查是否有特定 IP 或 User-Agent
   - 评估是否需要 IP 黑名单

3. **长期防护**：
   - 考虑使用 Vercel Edge Middleware 实现更细粒度的速率限制
   - 或集成第三方 DDoS 防护服务（如 Cloudflare）

### 5.3 数据篡改

**症状**：
- 网站内容与 Notion 源数据不一致
- 文章内容被恶意修改

**响应步骤**：

1. **立即行动**：
   - 检查 Notion 历史版本，确认篡改时间点
   - 从历史版本恢复被篡改的内容
   - 撤销所有可能泄漏的 Token

2. **调查**：
   - 审查 Notion 访问日志
   - 检查 Integration 权限设置
   - 确认是否有未授权访问

3. **加固**：
   - 轮换所有密钥
   - 审查 Integration 权限，确保最小权限原则
   - 启用 Notion 两步验证（如适用）

---

## 6. 监控与告警配置指南

### 6.1 最小监控集

**必需监控项**：

1. **Vercel 部署状态**
   - 位置：Vercel Dashboard → Deployments
   - 告警：部署失败时发送邮件通知

2. **Notion API 错误率**
   - 位置：Vercel Functions 日志
   - 告警：API 错误率 > 5% 时通知

3. **关键页面可用性**
   - 位置：Vercel Analytics → Web Vitals
   - 告警：首页加载失败时通知

### 6.2 推荐监控工具

**免费方案**：
- Vercel Analytics（内置）
- UptimeRobot（外部监控，免费 50 个监控点）

**付费方案**（可选）：
- Sentry（错误追踪）
- Datadog（全栈监控）

### 6.3 告警配置示例

**Vercel 邮件通知**：
1. 登录 Vercel Dashboard
2. Settings → Notifications
3. 启用 "Deployment Failures" 和 "Function Errors"

**UptimeRobot 配置**：
1. 创建 HTTP(S) 监控
2. URL: `https://natureblueee.com`
3. 检查间隔：5 分钟
4. 告警：连续 2 次失败时发送邮件

---

## 7. 安全响应头配置

### 7.1 当前配置

所有响应头在 `next.config.ts` 中配置：

- `X-Content-Type-Options: nosniff` - 防止 MIME 类型嗅探
- `X-Frame-Options: DENY` - 防止点击劫持
- `X-XSS-Protection: 1; mode=block` - 启用浏览器 XSS 过滤器
- `Referrer-Policy: strict-origin-when-cross-origin` - 控制 referrer 信息
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` - 禁用敏感权限
- `Content-Security-Policy` - 限制资源加载源

### 7.2 CSP 策略说明

当前 CSP 配置允许：
- 脚本：`'self' 'unsafe-inline' 'unsafe-eval'`（Next.js 必需）
- 样式：`'self' 'unsafe-inline' https://fonts.googleapis.com`
- 字体：`'self' https://fonts.gstatic.com`
- 图片：`'self' data: https: blob:`
- 连接：`'self' https://api.notion.com`

**注意**：`'unsafe-inline'` 和 `'unsafe-eval'` 是 Next.js 运行时的必需项。虽然降低了 CSP 的严格性，但通过 DOMPurify 清洗内容可以缓解风险。

### 7.3 Vercel 部署配置

**推荐设置**（在 Vercel Dashboard 配置）：
- ✅ Force HTTPS（强制 HTTPS）
- ✅ HSTS（HTTP Strict Transport Security）
- ✅ Automatic HTTPS（自动 HTTPS 证书）

---

## 8. 安全最佳实践

### 8.1 开发阶段

- ✅ 永远不要提交 `.env*` 文件
- ✅ 使用 `.env.local` 存储本地开发密钥
- ✅ 定期运行 `npm audit` 检查依赖漏洞
- ✅ 代码审查时关注安全相关变更

### 8.2 部署阶段

- ✅ 使用 `npm ci` 而非 `npm install` 确保版本一致
- ✅ 部署前运行 `npm audit --production`
- ✅ 检查 Vercel 部署日志，确认无错误
- ✅ 验证安全响应头是否正确设置（使用 [SecurityHeaders.com](https://securityheaders.com)）

### 8.3 运维阶段

- ✅ 定期轮换密钥（按本文档第 4 节）
- ✅ 监控异常流量和错误率
- ✅ 及时更新依赖（通过 Dependabot PR）
- ✅ 关注 Next.js 和 Notion API 安全公告

---

## 9. 应急联系

**紧急情况**：
- 立即撤销所有 Notion Integration Token
- 在 Vercel Dashboard 触发紧急重新部署
- 检查并恢复 Notion 历史版本

**联系方式**：
- 项目维护者：见 README.md

---

## 10. 文档更新记录

| 日期 | 版本 | 更新内容 | 更新人 |
|------|------|----------|--------|
| 2024-01-XX | 1.0 | 初始版本 | - |

---

**最后更新**：2024-01-XX  
**文档状态**：✅ 当前有效

