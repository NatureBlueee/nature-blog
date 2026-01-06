/**
 * 文章列表页
 *
 * 展示所有已发布的文章
 *
 * SEO/GEO 优化：
 * - 输出 CollectionPage 和 BreadcrumbList JSON-LD 结构化数据
 * - 帮助搜索引擎和 AI 理解这是一个文章集合页
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/services";
import { siteConfig } from "@/config/site";
import {
  seoConfig,
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  JsonLd,
} from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "文章",
  description: `${siteConfig.author.name} 的文章列表`,
  alternates: {
    canonical: `${siteConfig.url}/posts`,
  },
};

export default async function PostsPage() {
  const articles = await getArticles();

  // 生成文章集合页结构化数据
  const collectionPageSchema = generateCollectionPageSchema({
    title: "文章",
    description: `${siteConfig.author.name} 的文章列表`,
    url: `${seoConfig.siteUrl}/posts`,
    numberOfItems: articles.length,
  });

  // 生成面包屑导航结构化数据
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "首页", url: seoConfig.siteUrl },
    { name: "文章", url: `${seoConfig.siteUrl}/posts` },
  ]);

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <JsonLd data={collectionPageSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>文章</h1>
        <p className={styles.subtitle}>
          所有文章均存储于 Notion，按发布日期排序
        </p>
      </header>

      {articles.length === 0 ? (
        <p className={styles.empty}>还没有已发布的文章</p>
      ) : (
        <ul className={styles.list}>
          {articles.map((article) => (
            <li key={article.id} className={styles.item}>
              <Link href={`/posts/${article.id}`} className={styles.link}>
                <span className={styles.category}>{article.category}</span>
                <h2 className={styles.articleTitle}>{article.title}</h2>
                <time className={styles.date}>{article.publishedAt}</time>
              </Link>
            </li>
          ))}
        </ul>
      )}
      </div>
    </>
  );
}
