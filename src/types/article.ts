/**
 * 文章实体类型定义
 *
 * 这是应用层的业务类型
 * 实际数据从 Notion Database 获取
 */

/**
 * 文章元数据
 */
export interface ArticleMeta {
  /** 文章唯一标识符 (Notion Page ID) */
  id: string;
  /** 文章标题 */
  title: string;
  /** 英文标题 (可选) */
  titleEn?: string;
  /** 文章摘要 */
  excerpt: string;
  /** 发布时间 */
  publishedAt: string;
  /** 封面图片 URL (可选) */
  cover?: string;
  /** 文章类型 */
  category: '理性' | '感性';
}

/**
 * 完整文章内容
 */
export interface Article extends ArticleMeta {
  /** 文章正文 (Markdown 格式) */
  content?: string;
}

/**
 * 文章列表项 - 用于列表展示，不包含正文
 */
export type ArticleListItem = ArticleMeta;
