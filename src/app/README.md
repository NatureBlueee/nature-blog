# `src/app`

标签：`ROUTE`

这里放 Next.js App Router 的页面、API route 和生成文件路由。它是公共 URL 契约层。

## 允许放这里

- `page.tsx`
- `layout.tsx`
- `route.ts`
- `robots.ts`
- `sitemap.ts`
- route-local CSS Module
- Next.js route metadata / ISR / static params

## 不放这里

- Notion SDK query 细节。
- Markdown block 转换逻辑。
- 可复用 UI 组件。
- 全局类型定义。

## 改动规则

- 改 URL、HTTP status、feed 路径、sitemap、robots 都是公共契约改动。
- 页面取数据走 `@/services` 或 `@/services/notion`。
- 页面渲染尽量委托给 `src/components/**`。
- route handler 需要明确无配置和外部错误的状态码。
