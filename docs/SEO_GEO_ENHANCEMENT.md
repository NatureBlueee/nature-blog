# SEO/GEO 自动化增强方案

> 版本: 1.0.0
> 创建日期: 2025-12-05
> 状态: 实施中

## 概述

本方案旨在将 natureblueee 博客的 SEO/GEO 能力提升到自动化最高境界，特别针对 AI 生成式引擎检索（GEO）进行优化。

## 设计原则

1. **可维护性**: 模块化设计，每个功能独立
2. **自动化**: 几乎无需手动干预
3. **稳定性**: 仅使用经过验证的开源库
4. **兼容性**: 不破坏现有结构，纯增量修改
5. **无技术债务**: 代码风格与现有项目保持一致

## 模块清单

### 模块 1: Feed 自动生成系统

**目的**: 为 AI 爬虫和订阅者提供标准化的内容入口

**新增文件**:
```
src/lib/feed/
├── generator.ts     # Feed 生成核心逻辑
├── config.ts        # Feed 配置
└── index.ts         # 模块导出

src/app/
├── feed.xml/route.ts    # RSS 2.0
├── atom.xml/route.ts    # Atom 1.0
└── feed.json/route.ts   # JSON Feed 1.1
```

**技术选型**: `feed` 库 (npm 周下载量 500K+)

**自动化程度**: 访问时自动从 Notion 拉取最新数据

---

### 模块 2: Schema.org 结构化数据增强

**目的**: 帮助搜索引擎和 AI 更好地理解内容结构

**增强类型**:
| Schema | 用途 | 应用页面 |
|--------|------|----------|
| `Blog` | 描述整个博客 | 首页 |
| `BlogPosting` | 博客文章 | 文章详情页 |
| `BreadcrumbList` | 面包屑导航 | 所有内页 |
| `CollectionPage` | 文章集合 | 文章列表页 |

**文件**: `src/lib/seo/structured-data.tsx`

---

### 模块 3: 多语言 SEO (hreflang)

**目的**: 支持中英文内容的正确索引

**实现效果**:
```html
<link rel="alternate" hreflang="zh-CN" href="..." />
<link rel="alternate" hreflang="en" href="..." />
<link rel="alternate" hreflang="x-default" href="..." />
```

**新增文件**: `src/lib/seo/i18n.ts`

---

### 模块 4: SEO 健康检查工具

**目的**: 自动化检测 SEO 问题

**检查项**:
- 页面 title/description 完整性
- OG 标签完整性
- 结构化数据有效性
- 内部链接有效性
- 图片 alt 属性

**新增文件**:
```
scripts/
├── seo-check.ts     # SEO 检查主脚本
└── seo-rules.ts     # 检查规则定义
```

**使用方式**:
```bash
npm run seo:check    # 手动运行
```

---

### 模块 5: GEO (生成式引擎优化) 增强

**目的**: 针对 AI 爬虫进行专门优化

**新增功能**:
1. `llms.txt` - AI 爬虫专用说明文件
2. 增强的 robots.txt - 明确的 AI 爬虫规则
3. 内容摘要优化

**新增文件**:
```
src/app/llms.txt/route.ts
src/lib/seo/geo.ts
```

---

## 新增依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `feed` | ^4.2.2 | RSS/Atom/JSON 生成 |

---

## 文件变更总览

### 新增文件 (12个)
```
src/app/feed.xml/route.ts
src/app/atom.xml/route.ts
src/app/feed.json/route.ts
src/app/llms.txt/route.ts
src/lib/feed/generator.ts
src/lib/feed/config.ts
src/lib/feed/index.ts
src/lib/seo/i18n.ts
src/lib/seo/geo.ts
scripts/seo-check.ts
```

### 修改文件 (7个)
```
src/lib/seo/structured-data.tsx  # 增加 Schema 类型
src/lib/seo/metadata.ts          # 增加 hreflang 支持
src/lib/seo/config.ts            # 增加 Feed 配置
src/lib/seo/types.ts             # 增加类型定义
src/app/sitemap.ts               # 多语言支持
src/app/robots.ts                # GEO 增强
package.json                     # 添加依赖和脚本
```

---

## 验证清单

- [ ] `npm run build` 成功
- [ ] `/feed.xml` 返回有效 RSS
- [ ] `/atom.xml` 返回有效 Atom
- [ ] `/feed.json` 返回有效 JSON Feed
- [ ] `/llms.txt` 返回 AI 说明
- [ ] `/sitemap.xml` 包含所有页面
- [ ] `/robots.txt` 包含 AI 爬虫规则
- [ ] `npm run seo:check` 运行成功
- [ ] 结构化数据通过 Google 验证工具

---

## 维护指南

### 添加新的 Schema 类型
1. 在 `src/lib/seo/types.ts` 添加类型定义
2. 在 `src/lib/seo/structured-data.tsx` 添加生成函数
3. 在相应页面调用并注入 JsonLd 组件

### 添加新的 Feed 格式
1. 在 `src/lib/feed/generator.ts` 添加生成方法
2. 创建新的 route 文件

### 更新 SEO 检查规则
1. 在 `scripts/seo-rules.ts` 添加新规则
2. 规则会自动被 `seo-check.ts` 执行
