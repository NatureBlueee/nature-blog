/**
 * Feed 生成器
 *
 * 使用 feed 库生成 RSS 2.0、Atom 1.0、JSON Feed 1.1
 * 自动从 Notion 获取最新文章数据
 */

import { Feed } from 'feed';
import { getArticles } from '@/services/notion';
import { seoConfig } from '@/lib/seo';
import { feedConfig } from './config';

/**
 * 生成 Feed 对象
 *
 * 包含所有已发布文章的完整 Feed
 * 支持输出 RSS、Atom、JSON 三种格式
 */
export async function generateFeed(): Promise<Feed> {
  const articles = await getArticles();

  // 获取最新文章的发布日期，如果没有文章则使用当前日期
  const latestArticle = articles[0];
  const updatedDate = latestArticle
    ? new Date(latestArticle.publishedAt)
    : new Date();

  const feed = new Feed({
    title: feedConfig.title,
    description: feedConfig.description,
    id: feedConfig.link,
    link: feedConfig.link,
    language: feedConfig.language,
    favicon: feedConfig.favicon,
    copyright: feedConfig.copyright,
    updated: updatedDate,
    feedLinks: feedConfig.feedLinks,
    author: {
      name: feedConfig.author.name,
      link: feedConfig.author.link,
    },
  });

  // 添加文章到 Feed
  for (const article of articles) {
    const articleUrl = `${seoConfig.siteUrl}/posts/${article.id}`;

    feed.addItem({
      title: article.title,
      id: articleUrl,
      link: articleUrl,
      description: article.excerpt || article.title,
      date: new Date(article.publishedAt),
      author: [
        {
          name: seoConfig.author.name,
          link: seoConfig.author.url,
        },
      ],
      // 封面图片作为附件
      ...(article.cover && {
        image: article.cover,
      }),
      // 文章分类
      category: [
        {
          name: article.category,
        },
      ],
    });
  }

  return feed;
}

/**
 * 生成 RSS 2.0 XML
 */
export async function generateRSS(): Promise<string> {
  const feed = await generateFeed();
  return feed.rss2();
}

/**
 * 生成 Atom 1.0 XML
 */
export async function generateAtom(): Promise<string> {
  const feed = await generateFeed();
  return feed.atom1();
}

/**
 * 生成 JSON Feed 1.1
 */
export async function generateJSON(): Promise<string> {
  const feed = await generateFeed();
  return feed.json1();
}
