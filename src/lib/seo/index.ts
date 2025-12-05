/**
 * SEO 模块统一导出
 *
 * 提供所有 SEO 相关功能的统一入口
 */

// 配置
export { seoConfig } from './config';

// 元数据生成
export {
  generateArticleMetadata,
  generateArticleMetadataWithI18n,
  generatePageMetadata,
} from './metadata';
export type { ArticleMetadataWithI18n } from './metadata';

// 结构化数据
export {
  // 基础 Schema
  generateWebSiteSchema,
  generatePersonSchema,
  generateArticleSchema,
  // 增强 Schema
  generateBlogSchema,
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  // 组件
  JsonLd,
} from './structured-data';

// 多语言 SEO
export {
  generateArticleHreflang,
  generatePageHreflang,
  generateAlternates,
  getLanguageDisplayName,
  buildArticleUrl,
} from './i18n';
export type { SupportedLanguage, LanguageVersion, HreflangConfig } from './i18n';

// GEO (AI 爬虫优化)
export {
  generateLlmsTxt,
  generateAiSummary,
  aiCrawlers,
  defaultLlmsTxtConfig,
} from './geo';
export type { LlmsTxtConfig } from './geo';

// 类型
export type {
  SEOConfig,
  AuthorInfo,
  SocialLinks,
  OGImageConfig,
  VerificationConfig,
  ArticleMetadataInput,
  ArticleSchemaInput,
  // 增强类型
  BlogPostingSchemaInput,
  BreadcrumbItem,
  CollectionPageSchemaInput,
} from './types';
