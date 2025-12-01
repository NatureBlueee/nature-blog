/**
 * SEO 模块统一导出
 *
 * 提供所有 SEO 相关功能的统一入口
 */

// 配置
export { seoConfig } from './config';

// 元数据生成
export { generateArticleMetadata, generatePageMetadata } from './metadata';

// 结构化数据
export {
  generateWebSiteSchema,
  generatePersonSchema,
  generateArticleSchema,
  JsonLd,
} from './structured-data';

// 类型
export type {
  SEOConfig,
  AuthorInfo,
  SocialLinks,
  OGImageConfig,
  VerificationConfig,
  ArticleMetadataInput,
  ArticleSchemaInput,
} from './types';
