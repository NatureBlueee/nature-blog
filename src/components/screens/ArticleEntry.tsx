"use client";

/**
 * 文章条目组件
 *
 * 支持表世界（surface）和里世界（inner）两种样式
 * 展开逻辑：
 * - 点击任意文章标题 → 列表展开，所有文章都显示摘要
 * - 被点击的文章：完整显示摘要
 * - 其他文章：显示一行虚化摘要预览
 * - 再次点击已展开的文章标题 → 跳转详情页
 */

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Article } from "@/services/notion";
import { useLanguage } from "@/contexts";

interface ArticleEntryProps {
  article: Article;
  index: number;
  variant: "surface" | "inner";
  isExpanded?: boolean; // 这篇文章是否被选中（完整展开）
  isListExpanded?: boolean; // 列表是否处于展开状态（显示虚化预览）
  onExpand?: (articleId: string) => void;
}

/**
 * 格式化日期为 MM/DD/YYYY (月日年)
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}

export function ArticleEntry({
  article,
  index,
  variant,
  isExpanded = false,
  isListExpanded: _isListExpanded = false,
  onExpand,
}: ArticleEntryProps) {
  const isSurface = variant === "surface";
  const router = useRouter();
  const { t } = useLanguage();

  // 保留参数以兼容
  void index;
  void _isListExpanded;

  // 始终显示摘要（有摘要的情况下）
  const showExcerpt = !!article.excerpt;

  /**
   * 处理标题点击
   * - 未展开：展开摘要（触发列表展开）
   * - 已展开：跳转详情页
   */
  const handleTitleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isExpanded) {
      // 已展开，跳转详情
      router.push(`/posts/${article.id}`);
    } else {
      // 未展开，选中这篇文章
      onExpand?.(article.id);
    }
  };

  return (
    <article className={`article-item group ${isSurface ? "" : ""}`}>
      {/* 日期行 */}
      <div
        className="font-mono"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "0.75rem",
          fontSize: "10px",
          color: isSurface ? "#999" : "#555",
          borderBottom: "1px solid",
          borderColor: isSurface ? "transparent" : "rgba(255,255,255,0.05)",
          paddingBottom: "0.5rem",
        }}
      >
        <span style={{ color: isSurface ? "#999" : "#C7B396" }}>
          {formatDate(article.publishedAt)}
        </span>
      </div>

      {/* 标题 - 点击展开/跳转 */}
      <h2
        onClick={handleTitleClick}
        className="entry-title hover-target"
        style={{
          fontSize: isSurface ? "1.5rem" : "1.875rem",
          fontWeight: isSurface ? 500 : 300,
          marginBottom: showExcerpt ? "1rem" : isSurface ? "1rem" : "1.5rem",
          lineHeight: 1.4,
          color: isSurface ? "inherit" : "#E6E8EB",
          cursor: "pointer",
          transition: "margin-bottom 0.3s ease",
        }}
      >
        {article.title}
      </h2>

      {/* 摘要区域 - 始终显示，通过样式变化实现展开效果 */}
      {showExcerpt && (
        <motion.div
          key="excerpt"
          initial={false}
          animate={{
            height: "auto",
            marginBottom: isExpanded ? "0" : "1rem",
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ overflow: "hidden" }}
        >
          {/* 摘要文本 - 根据是否选中展示不同样式 */}
          {/* 点击虚化摘要也能展开 */}
          <motion.p
            onClick={() => !isExpanded && onExpand?.(article.id)}
            initial={false}
            animate={{
              opacity: isExpanded ? (isSurface ? 1 : 0.85) : 0.4,
              filter: isExpanded ? "blur(0px)" : "blur(0.8px)",
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              fontSize: isExpanded ? "0.85rem" : "0.8rem",
              color: isSurface ? "#555" : "#8FAAB0",
              lineHeight: 1.9,
              textAlign: "justify",
              marginBottom: isExpanded ? "1.5rem" : "0.5rem",
              // 虚化预览时的样式
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: isExpanded ? "unset" : 1,
              overflow: "hidden",
              // 渐变遮罩（虚化时）
              maskImage: isExpanded
                ? "none"
                : "linear-gradient(to right, black 60%, transparent 95%)",
              WebkitMaskImage: isExpanded
                ? "none"
                : "linear-gradient(to right, black 60%, transparent 95%)",
              // 虚化时显示可点击
              cursor: isExpanded ? "default" : "pointer",
            }}
          >
            {article.excerpt}
          </motion.p>

          {/* 阅读全文链接 - 只在完全展开时显示 */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => router.push(`/posts/${article.id}`)}
                  className="hover-target"
                  style={{
                    background: "none",
                    border: "none",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                    color: isSurface ? "#666" : "#C7B396",
                    cursor: "pointer",
                    opacity: 0.8,
                    transition: "opacity 0.2s ease",
                    letterSpacing: "0.05em",
                  }}
                >
                  {t("阅读全文 →", "Read more →")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </article>
  );
}
