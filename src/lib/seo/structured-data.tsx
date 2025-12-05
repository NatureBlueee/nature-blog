/**
 * 结构化数据生成工具
 *
 * 使用 schema-dts 生成符合 Schema.org 标准的 JSON-LD 数据
 * 帮助搜索引擎和 AI 模型理解页面内容
 *
 * 支持的 Schema 类型：
 * - WebSite: 网站整体信息
 * - Blog: 博客整体信息
 * - Person: 作者信息
 * - Article: 通用文章（保留兼容）
 * - BlogPosting: 博客文章（推荐）
 * - BreadcrumbList: 面包屑导航
 * - CollectionPage: 文章集合页
 */

import type {
  Article,
  Blog,
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  Person,
  WebSite,
  WithContext,
} from 'schema-dts';
import { seoConfig } from './config';
import type {
  ArticleSchemaInput,
  BlogPostingSchemaInput,
  BreadcrumbItem,
  CollectionPageSchemaInput,
} from './types';

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

/**
 * 生成 Blog 结构化数据
 *
 * 描述整个博客，比 WebSite 更精准
 * 用于首页
 */
export function generateBlogSchema(): WithContext<Blog> {
    return {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: seoConfig.siteName,
        description: seoConfig.siteDescription,
        url: seoConfig.siteUrl,
        inLanguage: seoConfig.defaultLocale,
        author: {
            '@type': 'Person',
            name: seoConfig.author.name,
            url: seoConfig.author.url,
        },
        publisher: {
            '@type': 'Person',
            name: seoConfig.author.name,
            url: seoConfig.author.url,
        },
    };
}

/**
 * 生成 BlogPosting 结构化数据
 *
 * 比 Article 更适合博客文章
 * 包含字数统计、阅读时间等增强信息
 *
 * @param article - 文章信息
 */
export function generateBlogPostingSchema(
    article: BlogPostingSchemaInput
): WithContext<BlogPosting> {
    // 计算字数（中文按字符，英文按单词）
    const wordCount = article.content
        ? article.language === 'en'
            ? article.content.split(/\s+/).length
            : article.content.length
        : undefined;

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
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
        inLanguage: article.language === 'en' ? 'en-US' : 'zh-CN',
        ...(wordCount && { wordCount }),
        ...(article.category && {
            articleSection: article.category,
        }),
    };
}

/**
 * 生成 BreadcrumbList 结构化数据
 *
 * 面包屑导航，帮助搜索引擎理解页面层级
 *
 * @param items - 面包屑项目列表
 */
export function generateBreadcrumbSchema(
    items: BreadcrumbItem[]
): WithContext<BreadcrumbList> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem' as const,
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * 生成 CollectionPage 结构化数据
 *
 * 用于文章列表页
 *
 * @param page - 页面信息
 */
export function generateCollectionPageSchema(
    page: CollectionPageSchemaInput
): WithContext<CollectionPage> {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: page.title,
        description: page.description,
        url: page.url,
        isPartOf: {
            '@type': 'WebSite',
            name: seoConfig.siteName,
            url: seoConfig.siteUrl,
        },
        ...(page.numberOfItems && {
            mainEntity: {
                '@type': 'ItemList',
                numberOfItems: page.numberOfItems,
            },
        }),
    };
}
