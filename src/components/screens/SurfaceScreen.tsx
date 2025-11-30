"use client";

/**
 * 表世界（理性）- 第一屏
 *
 * 宣纸白背景，墨汁黑文字
 * 支持文章摘要展开交互
 */

import { useState, useMemo } from "react";
import type { Article } from "@/services/notion";
import { ArticleEntry } from "./ArticleEntry";
import { LanguageSwitch } from "@/components/common/LanguageSwitch";
import { useLanguage } from "@/contexts";

interface SurfaceScreenProps {
  articles: Article[];
}

export function SurfaceScreen({ articles }: SurfaceScreenProps) {
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(
    null
  );
  const { language, t } = useLanguage();

  // 根据当前语言过滤文章
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => article.language === language);
  }, [articles, language]);

  // 是否有文章展开
  const hasExpanded = expandedArticleId !== null;

  const handleExpand = (articleId: string) => {
    setExpandedArticleId((prev) => (prev === articleId ? null : articleId));
  };

  // 点击左侧空白区域收起
  const handleVoidClick = () => {
    if (hasExpanded) {
      setExpandedArticleId(null);
    }
  };

  return (
    <section
      className="screen screen-surface"
      id="surface"
      style={
        {
          // 动态调整布局宽度
          "--void-width": hasExpanded ? "55%" : "68%",
          "--content-width": hasExpanded ? "45%" : "32%",
        } as React.CSSProperties
      }
    >
      {/* 分割线 */}
      <div className="divider-line hidden md:block" />
      {/* 朱砂红点睛 */}
      <div className="divider-accent hidden md:block animate-pulse-cinnabar" />

      {/* 左侧：留白区 - 点击可收起展开的文章 */}
      <aside
        className="void-area hidden md:flex bg-paper-texture"
        onClick={handleVoidClick}
        style={{ cursor: hasExpanded ? "pointer" : "default" }}
      >
        {/* 语言切换 - 右上角竖排，替代原来的"晨曦" */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "4rem",
            right: "4rem",
          }}
        >
          <LanguageSwitch />
        </div>

        {/* 签名区 */}
        <div className="signature-block" onClick={(e) => e.stopPropagation()}>
          <a
            href="mailto:hi@natureblueee.com"
            className="hover-target"
            style={{
              fontSize: "0.85rem",
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontStyle: "italic",
              letterSpacing: "0.08em",
              textDecoration: "none",
              color: "#B8956E", // 金缮色
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            hi@natureblueee.com
          </a>
          <div className="signature-en" style={{ color: "#8A7A5A" }}>
            {t("与我来信", "Chat with me")}
          </div>
        </div>
      </aside>

      {/* 右侧：内容流 */}
      <main className="content-area">
        {/* 文章列表 - 根据当前语言过滤 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
          {filteredArticles.map((article, index) => (
            <ArticleEntry
              key={article.id}
              article={article}
              index={index + 1}
              variant="surface"
              isExpanded={expandedArticleId === article.id}
              isListExpanded={expandedArticleId !== null}
              onExpand={handleExpand}
            />
          ))}
        </div>
      </main>
    </section>
  );
}
