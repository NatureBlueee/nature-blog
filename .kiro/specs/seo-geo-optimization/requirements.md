# Requirements Document

## Introduction

本文档定义了为 natureblueee 个人博客网站构建成熟、轻量、可维护的 SEO（搜索引擎优化）和 GEO（生成式引擎优化）方案的需求。该博客基于 Next.js 16 + Notion CMS 构建，采用 ISR 静态生成策略，支持中英双语，具有独特的"表里世界"美学设计。

**SEO** - 针对传统搜索引擎（Google、Bing、百度）的优化
**GEO** - 针对 AI 大模型（ChatGPT、Perplexity、Claude、Gemini）的生成式引擎优化

方案目标：

- 轻量但有效的 SEO/GEO 实现
- 优先使用 Next.js 16 原生功能，避免重复造轮子
- 对后续开发和迭代友好
- 让内容同时被搜索引擎和 AI 模型正确理解和引用

## Glossary

- **SEO_System**: 搜索引擎优化系统，负责生成和管理所有 SEO 相关的元数据、结构化数据和技术优化
- **GEO_System**: 生成式引擎优化系统（Generative Engine Optimization），负责优化内容以便被 AI 大模型正确理解、引用和推荐
- **AI_Crawler**: AI 模型的爬虫，如 GPTBot、ClaudeBot、PerplexityBot、Google-Extended 等
- **Metadata_API**: Next.js 16 App Router 原生的元数据 API（export const metadata / generateMetadata）
- **Structured_Data**: JSON-LD 格式的结构化数据，帮助搜索引擎和 AI 理解页面内容
- **OG_Image**: Open Graph 图片，用于社交媒体分享预览
- **ImageResponse**: Next.js next/og 提供的动态图片生成 API
- **ISR**: Incremental Static Regeneration，Next.js 的增量静态再生成功能

## Technical Decisions

基于 Next.js 16 App Router 架构，确定以下技术选型：

| 功能       | 方案                        | 理由                             |
| ---------- | --------------------------- | -------------------------------- |
| SEO 元数据 | Next.js Native Metadata API | 原生支持，类型安全，无需额外依赖 |
| 结构化数据 | schema-dts                  | Google 官方 TypeScript 类型定义  |
| Sitemap    | Next.js Native sitemap.ts   | 原生支持，轻量稳定               |
| Robots.txt | Next.js Native robots.ts    | 原生支持，可配置 AI 爬虫         |
| OG 图片    | next/og (ImageResponse)     | 动态生成，复用宋代美学设计语言   |
| 站点验证   | 环境变量配置                | 灵活，无需改代码                 |

## Requirements

### Requirement 1: 动态元数据生成

**User Story:** As a 博客作者, I want 每篇文章自动生成完整的 SEO 元数据, so that 搜索引擎和 AI 模型能准确理解和索引我的内容

#### Acceptance Criteria

1. WHEN 用户访问任意页面, THE SEO_System SHALL 使用 Next.js Native Metadata API 生成包含 title、description 的完整 meta 标签
2. WHEN 用户访问文章详情页, THE SEO_System SHALL 从 Notion 数据自动提取标题作为 og:title，摘要作为 og:description
3. WHEN 文章包含封面图片, THE SEO_System SHALL 将封面图片设置为 og:image
4. WHEN 文章不包含封面图片, THE SEO_System SHALL 使用 next/og 动态生成符合宋代美学的 OG 图片
5. THE SEO_System SHALL 为每个页面生成唯一的 canonical URL

### Requirement 2: 结构化数据支持

**User Story:** As a 博客作者, I want 网站输出符合 Schema.org 标准的结构化数据, so that 搜索引擎和 AI 模型能以结构化方式理解我的内容

#### Acceptance Criteria

1. WHEN 用户访问首页, THE SEO_System SHALL 输出 WebSite 和 Person 类型的 JSON-LD 结构化数据
2. WHEN 用户访问文章详情页, THE SEO_System SHALL 输出 BlogPosting 类型的 JSON-LD 数据，包含 headline、datePublished、author、image 属性
3. THE SEO_System SHALL 使用 schema-dts 库确保结构化数据类型安全
4. THE SEO_System SHALL 确保所有结构化数据通过 Google Rich Results Test 验证

### Requirement 3: 站点地图生成

**User Story:** As a 博客作者, I want 网站自动生成并更新站点地图, so that 搜索引擎和 AI 爬虫能发现所有可索引页面

#### Acceptance Criteria

1. THE SEO_System SHALL 使用 Next.js Native sitemap.ts 在构建时自动生成包含所有已发布文章的 XML sitemap
2. WHEN Notion 数据库中文章更新, THE SEO_System SHALL 在下次构建时更新 sitemap 中对应条目的 lastmod 时间
3. THE SEO_System SHALL 在 sitemap 中为每个页面指定正确的 changefreq 和 priority
4. THE SEO_System SHALL 支持多语言文章的 sitemap 条目

### Requirement 4: AI 爬虫访问控制 (GEO)

**User Story:** As a 博客作者, I want 允许主流 AI 爬虫访问我的内容, so that 我的内容能被 AI 检索和引用，提升知名度

#### Acceptance Criteria

1. THE GEO_System SHALL 使用 Next.js Native robots.ts 生成 robots.txt
2. THE GEO_System SHALL 在 robots.txt 中明确允许所有主流 AI 爬虫（GPTBot、ClaudeBot、PerplexityBot、Google-Extended、Bingbot）访问公开内容
3. THE GEO_System SHALL 禁止所有爬虫访问 API 路由（/api/\*）
4. THE GEO_System SHALL 提供 sitemap 位置指引

### Requirement 5: 语义化内容结构 (GEO)

**User Story:** As a 博客作者, I want 文章内容具有清晰的语义结构, so that AI 模型能准确理解文章的主题、论点和结论

#### Acceptance Criteria

1. THE GEO_System SHALL 确保文章使用正确的 HTML 语义标签（article、header、main、section）
2. THE GEO_System SHALL 确保文章标题使用正确的层级结构（h1 > h2 > h3）
3. THE GEO_System SHALL 在文章开头提供清晰的摘要，便于 AI 快速理解文章主旨
4. THE GEO_System SHALL 确保关键信息（作者、发布日期）在页面顶部明确展示

### Requirement 6: 引用优化 (GEO)

**User Story:** As a 博客作者, I want AI 模型在引用我的内容时能正确归因, so that 读者能追溯到原始来源

#### Acceptance Criteria

1. THE GEO_System SHALL 在每篇文章中包含明确的作者信息和发布日期
2. THE GEO_System SHALL 为文章提供稳定、永久的 URL 结构
3. THE GEO_System SHALL 在结构化数据中包含完整的 author 信息（name、url）
4. WHEN 文章被更新, THE GEO_System SHALL 在结构化数据中标注 dateModified

### Requirement 7: 动态 OG 图片生成

**User Story:** As a 博客作者, I want 文章分享时自动生成符合网站美学的预览图片, so that 社交分享更加美观统一

#### Acceptance Criteria

1. THE SEO_System SHALL 使用 next/og (ImageResponse) 动态生成 OG 图片
2. THE SEO_System SHALL 在 OG 图片中使用网站的宋代美学设计语言（宋体字、留白、特定配色）
3. THE SEO_System SHALL 根据文章标题动态渲染图片内容
4. WHEN 文章有封面图, THE SEO_System SHALL 优先使用封面图作为 OG 图片
5. THE SEO_System SHALL 确保生成的图片尺寸符合各平台要求（1200x630）

### Requirement 8: 社交媒体分享优化

**User Story:** As a 博客作者, I want 文章在社交媒体分享时显示完整的预览信息, so that 能吸引更多读者点击

#### Acceptance Criteria

1. THE SEO_System SHALL 为每个页面生成完整的 Open Graph 标签（og:title, og:description, og:image, og:url, og:type, og:site_name）
2. THE SEO_System SHALL 为每个页面生成 Twitter Card 标签（twitter:card, twitter:title, twitter:description, twitter:image）
3. THE SEO_System SHALL 设置 twitter:card 为 "summary_large_image" 以显示大图预览

### Requirement 9: 站点验证支持

**User Story:** As a 博客作者, I want 能够验证网站所有权, so that 可以使用搜索引擎站长工具

#### Acceptance Criteria

1. THE SEO_System SHALL 通过环境变量（GOOGLE_SITE_VERIFICATION）支持 Google Search Console 验证
2. THE SEO_System SHALL 通过环境变量（BING_SITE_VERIFICATION）支持 Bing Webmaster Tools 验证
3. THE SEO_System SHALL 在 layout.tsx 中读取环境变量并输出验证 meta 标签
4. WHEN 环境变量未设置, THE SEO_System SHALL 静默跳过，不输出空标签

### Requirement 10: 零运行时开销

**User Story:** As a 开发者, I want SEO/GEO 优化不影响网站性能和用户体验, so that 用户访问速度不受影响

#### Acceptance Criteria

1. THE SEO_System SHALL 在构建时（build time）生成所有静态 SEO 资源
2. THE SEO_System SHALL 使用 Next.js 内置的 Metadata API，不引入额外的客户端 JavaScript
3. THE SEO_System SHALL 确保结构化数据以内联 JSON-LD 形式输出，不产生额外的网络请求
4. THE SEO_System SHALL 不引入任何会影响 Core Web Vitals 的第三方脚本

### Requirement 11: 渐进式降级

**User Story:** As a 开发者, I want SEO/GEO 功能在出错时不影响网站正常运行, so that 用户体验不受影响

#### Acceptance Criteria

1. WHEN Notion API 调用失败, THE SEO_System SHALL 使用默认元数据，不阻塞页面渲染
2. WHEN 结构化数据生成失败, THE SEO_System SHALL 静默降级，页面正常显示
3. THE SEO_System SHALL 使用 try-catch 包裹所有可能失败的 SEO 操作
4. WHEN 配置缺失, THE SEO_System SHALL 使用合理的默认值

### Requirement 12: 易于维护和扩展

**User Story:** As a 开发者, I want SEO/GEO 代码结构清晰易懂, so that 后续维护和功能扩展简单

#### Acceptance Criteria

1. THE SEO_System SHALL 将所有 SEO 相关代码集中在 `src/lib/seo` 目录
2. THE SEO_System SHALL 提供清晰的类型定义
3. THE SEO_System SHALL 遵循单一职责原则，每个函数只做一件事
4. THE SEO_System SHALL 提供可复用的 SEO 工具函数
