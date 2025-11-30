"use client";

/**
 * 里世界（感性）- 第二屏
 *
 * 鸦青背景，月白文字
 * 支持文章摘要展开交互
 */

import { useState, useMemo } from "react";
import type { Article } from "@/services/notion";
import { ArticleEntry } from "./ArticleEntry";
import { useLanguage } from "@/contexts";

interface InnerScreenProps {
  articles: Article[];
}

export function InnerScreen({ articles }: InnerScreenProps) {
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(
    null
  );
  const { language } = useLanguage();

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
      className="screen screen-inner"
      id="inner-smoke"
      style={
        {
          // 动态调整布局宽度
          "--void-width": hasExpanded ? "55%" : "68%",
          "--content-width": hasExpanded ? "45%" : "32%",
        } as React.CSSProperties
      }
    >
      {/* 微调版烟雾滤镜 */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="smoke-refined-v2">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.04"
              numOctaves="4"
              result="noise"
              seed="5"
            >
              <animate
                attributeName="baseFrequency"
                dur="8s"
                values="0.015 0.04; 0.018 0.05; 0.015 0.04"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="45" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.25 1" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
      </svg>

      {/* 烟雾分割线 */}
      <div className="divider-smoke-container hidden md:block">
        <div className="divider-smoke-line" />
      </div>

      {/* 左侧：虚空 - 点击可收起展开的文章 */}
      <aside
        className="void-area hidden md:flex"
        onClick={handleVoidClick}
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          cursor: hasExpanded ? "pointer" : "default",
        }}
      >
        {/* 语言切换已移除，只在第一屏显示 */}
      </aside>

      {/* 右侧：梦境流 */}
      <main className="content-area">
        {/* Drift Layout */}
        <div
          className="drift-layout"
          style={{ display: "flex", flexDirection: "column", gap: "8rem" }}
        >
          {filteredArticles.map((article, index) => (
            <ArticleEntry
              key={article.id}
              article={article}
              index={index + 1}
              variant="inner"
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
