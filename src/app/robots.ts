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
 */

import type { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = seoConfig.siteUrl;

  return {
    rules: [
      {
        // 允许所有搜索引擎爬虫（包括 Googlebot、Bingbot 等）
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        // 明确允许 GPTBot (OpenAI/ChatGPT)
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // 明确允许 ClaudeBot (Anthropic/Claude)
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // 明确允许 PerplexityBot
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // 明确允许 Google-Extended (Gemini)
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
