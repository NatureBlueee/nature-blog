/**
 * 站点地图生成
 *
 * 使用 Next.js 16 Native sitemap.ts
 * 自动生成包含所有已发布文章的 XML sitemap
 */

import type { MetadataRoute } from 'next';
import { getArticles } from '@/services/notion';
import { seoConfig } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = seoConfig.siteUrl;

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 动态文章页面
  let articlePages: MetadataRoute.Sitemap = [];

  try {
    const articles = await getArticles();
    articlePages = articles.map((article) => ({
      url: `${baseUrl}/posts/${article.id}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    // 渐进式降级：API 失败时仅返回静态页面
    console.warn('[Sitemap] Failed to fetch articles:', error);
  }

  return [...staticPages, ...articlePages];
}
