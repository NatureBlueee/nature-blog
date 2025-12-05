/**
 * Feed 配置
 *
 * RSS/Atom/JSON Feed 的集中配置
 * 与 SEO 配置保持一致的设计风格
 */

import { seoConfig } from '@/lib/seo';

/**
 * Feed 配置接口
 */
export interface FeedConfig {
  /** Feed 标题 */
  title: string;
  /** Feed 描述 */
  description: string;
  /** 站点链接 */
  link: string;
  /** Feed 自身链接 */
  feedLinks: {
    rss: string;
    atom: string;
    json: string;
  };
  /** 作者信息 */
  author: {
    name: string;
    link?: string;
  };
  /** 语言 */
  language: string;
  /** 版权信息 */
  copyright: string;
  /** 图标 */
  favicon: string;
}

/**
 * Feed 配置
 *
 * 使用 SEO 配置作为数据源，保持一致性
 */
export const feedConfig: FeedConfig = {
  title: seoConfig.siteName,
  description: seoConfig.siteDescription,
  link: seoConfig.siteUrl,
  feedLinks: {
    rss: `${seoConfig.siteUrl}/feed.xml`,
    atom: `${seoConfig.siteUrl}/atom.xml`,
    json: `${seoConfig.siteUrl}/feed.json`,
  },
  author: {
    name: seoConfig.author.name,
    link: seoConfig.author.url,
  },
  language: seoConfig.defaultLocale,
  copyright: `© ${new Date().getFullYear()} ${seoConfig.author.name}. All rights reserved.`,
  favicon: `${seoConfig.siteUrl}/favicon.ico`,
};
