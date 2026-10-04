# `src/services/notion`

标签：`SERVICE`

这里是 Notion 内容源的唯一边界。页面、feed、SEO 不应该直接理解 Notion SDK response shape。

## 文件职责

| 文件 | 职责 |
|---|---|
| `client.ts` | 读取 Notion env，创建 client，暴露配置状态 |
| `types.ts` | `Article` 与 Notion service 状态类型 |
| `rich-text.ts` | Notion rich text 到文本/Markdown inline |
| `mapper.ts` | Notion page properties 到 `Article` |
| `blocks.ts` | Notion blocks 到 Markdown |
| `articles.ts` | 查询 facade，保持旧调用面兼容 |
| `index.ts` | 对外导出 |

## 公共输出

- `getArticles()`
- `getArticlesByCategory(category, language?)`
- `getArticleById(id)`
- `getArticleByIdAndLanguage(id, language)`
- `getRelatedArticle(articleId)`
- `getAllArticleIds()`
- `Article`

## Notion 字段契约

| 字段 | 用途 |
|---|---|
| `标题` | Article title |
| `状态` | 发布筛选 |
| `类型` | `理性` / `感性` |
| `发布日期` | 排序与 metadata |
| `摘要` | excerpt / SEO description |
| `语言` | `zh` / `en` |
| `关联文章` | 双语关联 |
| `主文章` | 主列表筛选 |

## 降级规则

- Notion env 缺失：query 返回空数组或 `null`，构建继续。
- Notion API 失败：server-side warn，返回空内容。
- 需要实时 Notion 状态的 API route 自己决定 503/500。
