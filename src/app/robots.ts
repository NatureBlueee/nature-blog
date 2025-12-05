/**
 * Robots.txt 生成
 *
 * 使用 Next.js 16 Native robots.ts
 * 配置搜索引擎和 AI 爬虫的访问规则
 *
 * GEO 优化：明确允许主流 AI 爬虫访问
 * - GPTBot (OpenAI/ChatGPT)
 * - ClaudeBot (Anthropic/Claude)
 * - PerplexityBot (Perplexity AI)
 * - Google-Extended (Google Gemini)
 * - 以及更多 AI 爬虫...
 *
 * 参考: https://platform.openai.com/docs/gptbot
 */

import type { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo';
import { aiCrawlers } from '@/lib/seo/geo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = seoConfig.siteUrl;

  // 为每个 AI 爬虫生成规则
  const aiRules: MetadataRoute.Robots['rules'] = aiCrawlers.map((crawler) => ({
    userAgent: crawler.name,
    allow: [
      '/',
      '/feed.xml',      // RSS Feed
      '/atom.xml',      // Atom Feed
      '/feed.json',     // JSON Feed
      '/llms.txt',      // AI 专用说明
      '/sitemap.xml',   // 站点地图
    ],
    disallow: ['/api/'],
  }));

  return {
    rules: [
      {
        // 允许所有搜索引擎爬虫
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // 所有 AI 爬虫规则
      ...aiRules,
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // 扩展配置：添加主机和额外链接
    host: baseUrl,
  };
}
