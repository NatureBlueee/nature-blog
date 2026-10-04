# `src/lib/feed`

标签：`CAPABILITY`

Feed 模块负责 RSS、Atom、JSON Feed 的生成。它消费 `Article` 列表，不直接查询 Notion。

## 文件职责

| 文件 | 职责 |
|---|---|
| `config.ts` | feed 站点配置 |
| `generator.ts` | RSS / Atom / JSON Feed serialization |
| `index.ts` | 对外导出 |

## 公共路径

- `/feed.xml`
- `/atom.xml`
- `/feed.json`

这些路径是公共契约，改动需要考虑订阅工具、sitemap、README 和重定向。

## 验收

- `npm run build`
- dev server 下访问三个 feed 路径
- 有真实 Notion env 时确认文章条目出现
- 无 Notion env 时确认空 feed 不崩溃
