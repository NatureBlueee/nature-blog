/**
 * 结构化数据生成工具
 *
 * 使用 schema-dts 生成符合 Schema.org 标准的 JSON-LD 数据
 * 帮助搜索引擎和 AI 模型理解页面内容
 */

import type { Article, Person, WebSite, WithContext } from 'schema-dts';
import { seoConfig } from './config';
import type { ArticleSchemaInput } from './types';

/**
 * 生成 WebSite 结构化数据
 *
 * 用于首页，描述整个网站的基本信息
 */
export function generateWebSiteSchema(): WithContext<WebSite> {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: seoConfig.siteName,
        description: seoConfig.siteDescription,
        url: seoConfig.siteUrl,
        author: {
            '@type': 'Person',
            name: seoConfig.author.name,
            url: seoConfig.author.url,
        },
    };
}

/**
 * 生成 Person 结构化数据
 *
 * 用于描述网站作者信息
 */
export function generatePersonSchema(): WithContext<Person> {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: seoConfig.author.name,
        url: seoConfig.author.url,
    };
}

/**
 * 生成 Article 结构化数据
 *
 * 用于文章详情页，帮助搜索引擎理解文章内容
 *
 * @param article - 文章信息
 */
export function generateArticleSchema(
    article: ArticleSchemaInput
): WithContext<Article> {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        url: article.url,
        datePublished: article.publishedAt,
        dateModified: article.modifiedAt || article.publishedAt,
        author: {
            '@type': 'Person',
            name: seoConfig.author.name,
            url: seoConfig.author.url,
        },
        publisher: {
            '@type': 'Person',
            name: seoConfig.author.name,
        },
        image: article.cover,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': article.url,
        },
    };
}

/**
 * JSON-LD 脚本组件
 *
 * 将结构化数据以 JSON-LD 格式输出到页面
 * 使用 dangerouslySetInnerHTML 确保 JSON 正确渲染
 *
 * @param data - 结构化数据对象
 */
export function JsonLd<T extends object>({ data }: { data: T }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
