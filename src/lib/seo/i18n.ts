/**
 * 多语言 SEO 工具
 *
 * 处理 hreflang 标签生成和多语言 URL 映射
 * 帮助搜索引擎理解页面的语言版本关系
 */

import { seoConfig } from './config';

/**
 * 支持的语言
 */
export type SupportedLanguage = 'zh' | 'en';

/**
 * 语言映射到 hreflang 值
 */
const languageToHreflang: Record<SupportedLanguage, string> = {
  zh: 'zh-CN',
  en: 'en',
};

/**
 * 语言版本信息
 */
export interface LanguageVersion {
  /** 语言代码 */
  language: SupportedLanguage;
  /** 页面 URL */
  url: string;
}

/**
 * hreflang 配置
 */
export interface HreflangConfig {
  /** 语言版本列表 */
  languages: Record<string, string>;
  /** 默认语言的 x-default URL */
  xDefault?: string;
}

/**
 * 生成文章的 hreflang 配置
 *
 * @param currentUrl - 当前文章 URL
 * @param currentLanguage - 当前文章语言
 * @param relatedUrl - 关联语言版本的 URL（可选）
 * @param relatedLanguage - 关联语言版本的语言（可选）
 */
export function generateArticleHreflang(
  currentUrl: string,
  currentLanguage: SupportedLanguage,
  relatedUrl?: string,
  relatedLanguage?: SupportedLanguage
): HreflangConfig {
  const languages: Record<string, string> = {
    [languageToHreflang[currentLanguage]]: currentUrl,
  };

  // 添加关联语言版本
  if (relatedUrl && relatedLanguage) {
    languages[languageToHreflang[relatedLanguage]] = relatedUrl;
  }

  // x-default 指向中文版本（主版本）
  const xDefault = currentLanguage === 'zh' ? currentUrl : relatedUrl;

  return {
    languages,
    xDefault,
  };
}

/**
 * 生成静态页面的 hreflang 配置
 *
 * 对于没有多语言版本的页面，仅设置当前语言
 *
 * @param url - 页面 URL
 * @param language - 页面语言
 */
export function generatePageHreflang(
  url: string,
  language: SupportedLanguage = 'zh'
): HreflangConfig {
  return {
    languages: {
      [languageToHreflang[language]]: url,
    },
    xDefault: url,
  };
}

/**
 * 生成完整的 alternates 配置（用于 Next.js Metadata）
 *
 * @param hreflang - hreflang 配置
 * @param canonical - canonical URL
 */
export function generateAlternates(
  hreflang: HreflangConfig,
  canonical: string
): {
  canonical: string;
  languages: Record<string, string>;
} {
  return {
    canonical,
    languages: {
      ...hreflang.languages,
      ...(hreflang.xDefault && { 'x-default': hreflang.xDefault }),
    },
  };
}

/**
 * 获取语言的显示名称
 */
export function getLanguageDisplayName(language: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    zh: '中文',
    en: 'English',
  };
  return names[language];
}

/**
 * 构建文章的多语言 URL
 */
export function buildArticleUrl(articleId: string): string {
  return `${seoConfig.siteUrl}/posts/${articleId}`;
}
