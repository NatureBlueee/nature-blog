# `src/lib/seo`

标签：`CAPABILITY`

SEO 模块提供 metadata、JSON-LD、hreflang、llms 文本和相关配置。它消费稳定输入，不依赖 Notion SDK。

## 文件职责

| 文件 | 职责 |
|---|---|
| `config.ts` | SEO 站点配置 |
| `metadata.ts` | 页面和文章 metadata 生成 |
| `structured-data.tsx` | JSON-LD schema 和 `JsonLd` 组件 |
| `i18n.ts` | hreflang / alternates |
| `geo.ts` | llms 文本与爬虫规则辅助 |
| `types.ts` | SEO 输入类型 |
| `index.ts` | 对外导出 |

## 改动规则

- 改 site URL、author、social，需要同时检查 feed 和 sitemap。
- 改 Article metadata 输入，需要检查文章详情页。
- 改 llms/robots 相关能力，需要跑 `npm run seo:check`。
- 不从这里读取 Notion SDK 或 route params。
