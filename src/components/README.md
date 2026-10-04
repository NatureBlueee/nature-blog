# `src/components`

标签：`UI`

这里放用户可见组件、CSS Modules 和少量客户端交互组件。本轮默认保护现有前端显示效果。

## 子目录

| 子目录 | 职责 |
|---|---|
| `screens/` | 首页三屏结构和首页专属视觉组件 |
| `article/` | 文章详情、Markdown 内容、水印、面包屑 |
| `common/` | 全站通用视觉/行为组件 |
| `Layout/` | Header、Footer、页面框架 |
| `providers/` | 客户端 Provider 组合 |

## 改动规则

- 不做审美决策或视觉重设计。
- 为 lint/type/bug 做 React 改动时，保持 DOM/CSS 目标不变。
- 改 CSS Module 后必须做浏览器 smoke。
- 不直接依赖 Notion SDK；需要文章数据时消费 `Article` 类型。
