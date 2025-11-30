"use client";

/**
 * 文章详情组件
 *
 * 沉浸式阅读体验
 * 继承首页的世界观（表世界/里世界）
 * 支持多语言切换
 */

import type { Article } from "@/services/notion";
import { GrainTexture } from "@/components/common/GrainTexture";
import { CustomCursor } from "@/components/common/CustomCursor";
import { LanguageSwitch } from "@/components/common/LanguageSwitch";
import { MysticalWatermark } from "./MysticalWatermark";
import { NatureSeal } from "./NatureSeal";
import { ArticleContent } from "./ArticleContent";
import { Breadcrumb } from "./Breadcrumb";
import { useLanguage } from "@/contexts";
import styles from "./styles.module.css";

interface ArticleDetailProps {
  article: Article;
  relatedArticle?: Article | null; // 关联的其他语言版本
}

/**
 * 格式化日期为 MM/DD/YYYY
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}

export function ArticleDetail({ article, relatedArticle }: ArticleDetailProps) {
  // 根据文章类型决定主题
  const theme = article.category === "感性" ? "inner" : "surface";
  const { t } = useLanguage();

  // 是否有其他语言版本
  const hasOtherLanguage = !!relatedArticle;

  return (
    <div className="article-page" data-theme={theme}>
      {/* 全局效果 */}
      <GrainTexture />
      <CustomCursor />

      {/* 神秘水印 */}
      <MysticalWatermark theme={theme} />

      {/* 返回导航 */}
      <Breadcrumb />

      {/* 语言切换 */}
      <div
        style={{
          position: "fixed",
          top: "32px",
          right: "32px",
          zIndex: 10,
        }}
      >
        <LanguageSwitch
          style={{
            color: theme === "inner" ? "#C7B396" : "inherit",
          }}
        />
      </div>

      <article className={styles.article}>
        {/* 文章头部 */}
        <header className={styles.header}>
          <h1 className={styles.title}>{article.title}</h1>

          {/* 显示语言版本提示 */}
          {hasOtherLanguage && (
            <p
              className="font-mono"
              style={{
                fontSize: "12px",
                color: "var(--page-text-lighter)",
                marginBottom: "16px",
              }}
            >
              {article.language === "zh"
                ? "English version available"
                : "中文版本可用"}
            </p>
          )}

          <time className={styles.date} dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        </header>

        {/* 封面图片 */}
        {article.cover && (
          <figure className={styles.cover}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.cover}
              alt={article.title}
              className={styles.coverImage}
            />
          </figure>
        )}

        {/* 文章正文 */}
        {article.content && (
          <div className={styles.content}>
            <ArticleContent content={article.content} />
          </div>
        )}

        {/* 文章结尾 */}
        <footer className={styles.footer}>
          <div className={styles.endMark}>{t("完", "End")}</div>
          <NatureSeal />
        </footer>
      </article>
    </div>
  );
}
