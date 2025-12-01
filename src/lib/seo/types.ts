/**
 * SEO 类型定义
 *
 * 集中定义所有 SEO 相关的 TypeScript 类型
 */

/**
 * 作者信息
 */
export interface AuthorInfo {
  /** 作者名称 */
  name: string;
  /** 作者主页 URL */
  url?: string;
}

/**
 * 社交链接
 */
export interface SocialLinks {
  twitter?: string;
  github?: string;
}

/**
 * OG 图片配置
 */
export interface OGImageConfig {
  /** 图片宽度 */
  width: number;
  /** 图片高度 */
  height: number;
  /** 背景色（宣纸白） */
  backgroundColor: string;
  /** 文字色（焦墨） */
  textColor: string;
  /** 强调色（泥金） */
  accentColor: string;
}

/**
 * 站点验证配置
 */
export interface VerificationConfig {
  /** Google Search Console 验证码 */
  google?: string;
  /** Bing Webmaster Tools 验证码 */
  bing?: string;
}

/**
 * SEO 配置接口
 */
export interface SEOConfig {
  /** 站点名称 */
  siteName: string;
  /** 站点描述 */
  siteDescription: string;
  /** 站点 URL */
  siteUrl: string;
  /** 默认语言 */
  defaultLocale: 'zh-CN' | 'en';
  /** 作者信息 */
  author: AuthorInfo;
  /** 社交媒体链接 */
  social?: SocialLinks;
  /** OG 图片配置 */
  ogImage: OGImageConfig;
  /** 站点验证配置 */
  verification?: VerificationConfig;
}

/**
 * 文章元数据输入
 */
export interface ArticleMetadataInput {
  /** 文章标题 */
  title: string;
  /** 文章描述/摘要 */
  description?: string;
  /** 发布时间 */
  publishedAt?: string;
  /** 修改时间 */
  modifiedAt?: string;
  /** 封面图片 URL */
  cover?: string;
  /** 文章 URL */
  url: string;
  /** 语言 */
  language?: 'zh' | 'en';
}

/**
 * 文章结构化数据输入
 */
export interface ArticleSchemaInput {
  /** 文章标题 */
  title: string;
  /** 文章描述 */
  description: string;
  /** 文章 URL */
  url: string;
  /** 发布时间 */
  publishedAt: string;
  /** 修改时间 */
  modifiedAt?: string;
  /** 封面图片 URL */
  cover?: string;
}
