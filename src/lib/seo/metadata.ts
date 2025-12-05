/**
 * SEO 元数据生成工具
 *
 * 使用 Next.js 16 Native Metadata API
 * 生成符合 SEO 标准的元数据
 *
 * 支持功能：
 * - Open Graph 标签
 * - Twitter Card
 * - Canonical URL
 * - hreflang 多语言标签
 */

import type { Metadata } from 'next';
import { seoConfig } from './config';
import type { ArticleMetadataInput } from './types';
import {
  generateArticleHreflang,
  generateAlternates,
  type SupportedLanguage,
} from './i18n';

/**
 * 文章元数据输入（带多语言支持）
 */
export interface ArticleMetadataWithI18n extends ArticleMetadataInput {
  /** 关联的其他语言版本 URL */
  relatedUrl?: string;
  /** 关联的其他语言版本语言 */
  relatedLanguage?: SupportedLanguage;
}

/**
 * 生成文章页面元数据
 *
 * @param article - 文章信息
 * @returns Next.js Metadata 对象
 */
export function generateArticleMetadata(article: ArticleMetadataInput): Metadata {
  const {
    title,
    description,
    publishedAt,
    modifiedAt,
    cover,
    url,
    language = 'zh',
  } = article;

  const desc = description || `${title} - ${seoConfig.author.name}`;

  // 如果有封面图使用封面图，否则使用动态生成的 OG 图片
  const ogImageUrl = cover || `${seoConfig.siteUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: seoConfig.siteName,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      authors: [seoConfig.author.name],
      locale: language === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: ogImageUrl,
          width: seoConfig.ogImage.width,
          height: seoConfig.ogImage.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogImageUrl],
    },
  };
}

/**
 * 生成文章页面元数据（带多语言 hreflang 支持）
 *
 * @param article - 文章信息（含多语言配置）
 * @returns Next.js Metadata 对象
 */
export function generateArticleMetadataWithI18n(
  article: ArticleMetadataWithI18n
): Metadata {
  const {
    title,
    description,
    publishedAt,
    modifiedAt,
    cover,
    url,
    language = 'zh',
    relatedUrl,
    relatedLanguage,
  } = article;

  const desc = description || `${title} - ${seoConfig.author.name}`;
  const ogImageUrl = cover || `${seoConfig.siteUrl}/og?title=${encodeURIComponent(title)}`;

  // 生成 hreflang 配置
  const hreflang = generateArticleHreflang(
    url,
    language as SupportedLanguage,
    relatedUrl,
    relatedLanguage
  );
  const alternates = generateAlternates(hreflang, url);

  return {
    title,
    description: desc,
    alternates,
    openGraph: {
      title,
      description: desc,
      url,
      siteName: seoConfig.siteName,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      authors: [seoConfig.author.name],
      locale: language === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: ogImageUrl,
          width: seoConfig.ogImage.width,
          height: seoConfig.ogImage.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogImageUrl],
    },
  };
}

/**
 * 生成通用页面元数据
 *
 * @param options - 页面信息
 * @returns Next.js Metadata 对象
 */
export function generatePageMetadata(options: {
  title: string;
  description?: string;
  url: string;
  ogImage?: string;
}): Metadata {
  const { title, description, url, ogImage } = options;
  const desc = description || seoConfig.siteDescription;
  const imageUrl = ogImage || `${seoConfig.siteUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: seoConfig.siteName,
      type: 'website',
      locale: seoConfig.defaultLocale.replace('-', '_'),
      images: [
        {
          url: imageUrl,
          width: seoConfig.ogImage.width,
          height: seoConfig.ogImage.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [imageUrl],
    },
  };
}
