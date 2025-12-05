/**
 * 文章详情页
 *
 * 职责：数据获取、元数据生成、静态路径生成
 * 渲染：委托给 ArticleDetail 组件
 *
 * 架构原则：
 * - 页面只负责数据层和 Next.js 特性（metadata, generateStaticParams）
 * - UI 渲染由组件负责，便于独立修改视觉层
 *
 * SEO/GEO 优化：
 * - 使用 generateArticleMetadata 生成完整的 SEO 元数据
 * - 输出 JSON-LD 结构化数据便于搜索引擎和 AI 理解
 *
 * 使用 ISR 静态生成，每 24 小时自动刷新
 * 配合 VersionChecker 实现智能更新检测
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleById, getAllArticleIds } from '@/services';
import { ArticleDetail } from '@/components/article';
import {
  seoConfig,
  generateArticleMetadata,
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
  JsonLd,
} from '@/lib/seo';
import { VersionChecker } from '@/components/common/VersionChecker';

// ISR: 每 86400 秒（24小时）后台刷新
export const revalidate = 86400;

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

/**
 * 生成静态路径
 */
export async function generateStaticParams() {
  try {
    const ids = await getAllArticleIds();
    return ids.map((id) => ({ id }));
  } catch (error) {
    console.warn('[Page] generateStaticParams failed:', error);
    return [];
  }
}

/**
 * 生成页面元数据
 *
 * 使用 SEO 工具函数生成完整的元数据
 * 包含 Open Graph、Twitter Card、canonical URL
 */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article) {
      return { title: '文章未找到' };
    }

    return generateArticleMetadata({
      title: article.title,
      description: article.excerpt,
      publishedAt: article.publishedAt,
      cover: article.cover,
      url: `${seoConfig.siteUrl}/posts/${article.id}`,
      language: article.language,
    });
  } catch (error) {
    console.warn('[Metadata] Failed to generate:', error);
    return {
      title: seoConfig.siteName,
      description: seoConfig.siteDescription,
    };
  }
}

/**
 * 页面组件
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const articleUrl = `${seoConfig.siteUrl}/posts/${article.id}`;

  // 生成博客文章结构化数据（BlogPosting 比 Article 更适合博客）
  const blogPostingSchema = generateBlogPostingSchema({
    title: article.title,
    description: article.excerpt || article.title,
    url: articleUrl,
    publishedAt: article.publishedAt,
    cover: article.cover,
    category: article.category,
    content: article.content,
    language: article.language,
  });

  // 生成面包屑导航结构化数据
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: '首页', url: seoConfig.siteUrl },
    { name: '文章', url: `${seoConfig.siteUrl}/posts` },
    { name: article.title, url: articleUrl },
  ]);

  return (
    <>
      {/* JSON-LD 结构化数据 - 帮助搜索引擎和 AI 理解文章内容 */}
      <JsonLd data={blogPostingSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* 版本检测：自动检测 Notion 是否有更新 */}
      <VersionChecker />
      <ArticleDetail article={article} />
    </>
  );
}
