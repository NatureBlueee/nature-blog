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
 * 使用 ISR 静态生成，每 24 小时自动刷新
 * 配合 VersionChecker 实现智能更新检测
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleById, getAllArticleIds } from '@/services';
import { ArticleDetail } from '@/components/article';
import { siteConfig } from '@/config/site';
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
 */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return { title: '文章未找到' };
  }

  return {
    title: article.title,
    description: article.excerpt || `${article.title} - ${siteConfig.author.name}`,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [siteConfig.author.name],
      images: article.cover ? [article.cover] : [],
    },
  };
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

  return (
    <>
      {/* 版本检测：自动检测 Notion 是否有更新 */}
      <VersionChecker />
      <ArticleDetail article={article} />
    </>
  );
}
