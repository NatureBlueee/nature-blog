# SEO/GEO 优化文档

本文档描述了 natureblueee 博客的 SEO（搜索引擎优化）和 GEO（生成式引擎优化）实现。

## 功能概览

### SEO 功能
- **元数据生成** - 自动为每个页面生成 title、description、Open Graph、Twitter Card
- **结构化数据** - 输出符合 Schema.org 标准的 JSON-LD 数据
- **站点地图** - 动态生成包含所有文章的 XML sitemap
- **Canonical URL** - 每个页面都有唯一的规范链接

### GEO 功能（生成式引擎优化）
- **AI 爬虫友好** - robots.txt 明确允许主流 AI 爬虫访问
  - GPTBot (OpenAI/ChatGPT)
  - ClaudeBot (Anthropic/Claude)
  - PerplexityBot (Perplexity AI)
  - Google-Extended (Google Gemini)
- **语义化内容** - 清晰的 HTML 结构便于 AI 理解
- **引用优化** - 完整的作者信息和发布日期便于 AI 正确归因

---

## 目录结构

```
src/
├── app/
│   ├── sitemap.ts          # 站点地图生成
│   ├── robots.ts           # 爬虫访问规则
│   ├── og/
│   │   └── route.tsx       # 动态 OG 图片 API
│   ├── layout.tsx          # 根布局（全局元数据）
│   ├── page.tsx            # 首页（WebSite + Person JSON-LD）
│   └── posts/
│       └── [id]/
│           └── page.tsx    # 文章页（Article JSON-LD）
└── lib/
    └── seo/
        ├── index.ts        # 统一导出
        ├── config.ts       # SEO 配置
        ├── metadata.ts     # 元数据生成工具
        ├── structured-data.tsx  # JSON-LD 生成
        └── types.ts        # 类型定义
```

---

## 配置指南

### 环境变量

在 `.env.local` 中配置：

```bash
# 站点 URL（必需）
NEXT_PUBLIC_SITE_URL=https://natureblueee.com

# 站点验证（可选）
GOOGLE_SITE_VERIFICATION=your-google-verification-code
BING_SITE_VERIFICATION=your-bing-verification-code
```

### SEO 配置 (src/lib/seo/config.ts)

```typescript
export const seoConfig: SEOConfig = {
  siteName: 'natureblueee',
  siteDescription: '思想的数字石碑 - ...',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://natureblueee.vercel.app',
  defaultLocale: 'zh-CN',
  author: {
    name: 'Natureblueee',
    url: 'https://wowok.net',
  },
  ogImage: {
    width: 1200,
    height: 630,
    backgroundColor: '#F5F5F5', // 宣纸白
    textColor: '#1A1A1A',       // 焦墨
    accentColor: '#C5A059',     // 泥金
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    bing: process.env.BING_SITE_VERIFICATION,
  },
};
```

---

## 使用示例

### 为新页面添加 SEO

```typescript
// src/app/about/page.tsx
import { generatePageMetadata, JsonLd, generatePersonSchema } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: '关于我',
  description: '了解更多关于 Natureblueee 的信息',
  url: 'https://natureblueee.vercel.app/about',
});

export default function AboutPage() {
  const personSchema = generatePersonSchema();
  
  return (
    <>
      <JsonLd data={personSchema} />
      {/* 页面内容 */}
    </>
  );
}
```

### 为文章页添加 SEO

```typescript
// src/app/posts/[id]/page.tsx
import { 
  generateArticleMetadata, 
  generateArticleSchema, 
  JsonLd,
  seoConfig 
} from '@/lib/seo';

export async function generateMetadata({ params }) {
  const article = await getArticleById(params.id);
  
  return generateArticleMetadata({
    title: article.title,
    description: article.excerpt,
    publishedAt: article.publishedAt,
    cover: article.cover,
    url: `${seoConfig.siteUrl}/posts/${article.id}`,
    language: article.language,
  });
}

export default async function ArticlePage({ params }) {
  const article = await getArticleById(params.id);
  
  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.excerpt || article.title,
    url: `${seoConfig.siteUrl}/posts/${article.id}`,
    publishedAt: article.publishedAt,
    cover: article.cover,
  });

  return (
    <>
      <JsonLd data={articleSchema} />
      {/* 文章内容 */}
    </>
  );
}
```

---

## 验证工具

部署后使用以下工具验证 SEO 实现：

| 工具 | 用途 | 链接 |
|------|------|------|
| Google Rich Results Test | 验证结构化数据 | https://search.google.com/test/rich-results |
| Schema.org Validator | 验证 JSON-LD 格式 | https://validator.schema.org/ |
| Facebook Sharing Debugger | 验证 OG 图片和标签 | https://developers.facebook.com/tools/debug/ |
| Twitter Card Validator | 验证 Twitter 卡片 | https://cards-dev.twitter.com/validator |
| Google Search Console | 提交 sitemap、监控索引 | https://search.google.com/search-console |

### 本地验证

```bash
# 启动开发服务器
npm run dev

# 验证端点
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
# 浏览器访问 http://localhost:3000/og?title=测试标题
```

---

## 已知限制

### Notion 图片链接时效性

Notion API 返回的图片 URL（S3 链接）通常有 1 小时的有效期。

**影响**：如果直接使用 Notion 图片作为 `og:image`，社交平台爬虫在图片过期后可能无法显示。

**当前策略**：
- ISR 定期刷新（首页 1 小时，文章 24 小时）
- 无封面图的文章使用动态生成的 OG 图片（永不过期）

**未来优化**（可选）：
- 将图片上传到 Cloudinary/Vercel Blob 等永久存储
- 使用 Next.js Image 组件代理 Notion 图片

### OG 图片字体限制

`next/og` 底层使用的 Satori 库只支持 **woff** 和 **ttf** 格式，不支持 woff2。

当前使用 Noto Sans SC (ttf) 作为中文字体，Inter (ttf) 作为备用。

---

## 技术栈

| 功能 | 技术方案 |
|------|----------|
| 元数据 | Next.js 16 Metadata API |
| 结构化数据 | schema-dts + JSON-LD |
| Sitemap | app/sitemap.ts (Next.js 原生) |
| Robots | app/robots.ts (Next.js 原生) |
| OG 图片 | next/og (ImageResponse) |

---

## 相关文件

- 需求文档: `.kiro/specs/seo-geo-optimization/requirements.md`
- 设计文档: `.kiro/specs/seo-geo-optimization/design.md`
- 任务记录: `.kiro/specs/seo-geo-optimization/tasks.md`
