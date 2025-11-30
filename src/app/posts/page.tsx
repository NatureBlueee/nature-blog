/**
 * 文章列表页
 *
 * 展示所有已发布的文章
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/services";
import { siteConfig } from "@/config/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "文章",
  description: `${siteConfig.author.name} 的文章列表`,
};

export default async function PostsPage() {
  const articles = await getArticles();

  return (
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
  );
}
