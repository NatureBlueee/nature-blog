import type { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import type { Language } from "@/contexts";
import { blocksToMarkdown, loadBlockChildren } from "./blocks";
import { createNotionClient } from "./client";
import { isFullPage, transformPageToArticle } from "./mapper";
import type { Article, ArticleCategory } from "./types";
import { collectPages } from "./pagination";
import { isPublishedArticle } from "./visibility";

type DatabaseFilter = NonNullable<QueryDatabaseParameters["filter"]>;
type DatabasePropertyFilter = Extract<DatabaseFilter, { property: string }>;
type DatabaseSort = NonNullable<QueryDatabaseParameters["sorts"]>[number];

function missingConfigFallback(operation: string, reason: string): [] {
  console.warn(`[Notion] ${operation} skipped: ${reason}`);
  return [];
}

async function getDatabasePropertyNames(): Promise<string[]> {
  const client = createNotionClient();
  if (!client.configured) return [];

  const database = await client.notion.databases.retrieve({
    database_id: client.databaseId,
  });

  return "properties" in database ? Object.keys(database.properties) : [];
}

function hasProperty(properties: string[], name: string): boolean {
  return properties.includes(name);
}

function buildPublishedFilter(
  properties: string[]
): DatabasePropertyFilter | undefined {
  if (!hasProperty(properties, "状态")) return undefined;
  return { property: "状态", select: { equals: "已发布" } };
}

function buildArticleListFilter(properties: string[]): DatabaseFilter | undefined {
  const publishedFilter = buildPublishedFilter(properties);
  const conditions: DatabasePropertyFilter[] = [];

  if (publishedFilter) conditions.push(publishedFilter);
  if (hasProperty(properties, "主文章")) {
    conditions.push({ property: "主文章", checkbox: { equals: true } });
  }

  if (conditions.length === 0) return undefined;
  return conditions.length === 1 ? conditions[0]! : { and: conditions };
}

function buildCategoryFilter(
  properties: string[],
  category: ArticleCategory,
  language?: Language
): DatabaseFilter | undefined {
  const conditions: DatabasePropertyFilter[] = [];
  const publishedFilter = buildPublishedFilter(properties);

  if (publishedFilter) conditions.push(publishedFilter);
  if (hasProperty(properties, "类型")) {
    conditions.push({ property: "类型", select: { equals: category } });
  }
  if (language && hasProperty(properties, "语言")) {
    conditions.push({ property: "语言", select: { equals: language } });
  }

  if (conditions.length === 0) return undefined;
  return conditions.length === 1 ? conditions[0]! : { and: conditions };
}

function buildDateSort(properties: string[]): DatabaseSort[] | undefined {
  if (!hasProperty(properties, "发布日期")) return undefined;
  return [{ property: "发布日期", direction: "descending" }];
}

export async function getArticles(): Promise<Article[]> {
  const client = createNotionClient();
  if (!client.configured) {
    return missingConfigFallback("getArticles", client.reason);
  }

  try {
    const properties = await getDatabasePropertyNames();
    const results = await collectPages((cursor) => client.notion.databases.query({
      database_id: client.databaseId,
      filter: buildArticleListFilter(properties),
      sorts: buildDateSort(properties),
      start_cursor: cursor,
    }));

    return results.filter(isFullPage)
      .filter((page) => isPublishedArticle(page, client.databaseId))
      .map(transformPageToArticle);
  } catch (error) {
    console.warn("[Notion] Failed to fetch articles:", error);
    return [];
  }
}

export async function getArticlesByCategory(
  category: ArticleCategory,
  language?: Language
): Promise<Article[]> {
  const client = createNotionClient();
  if (!client.configured) {
    return missingConfigFallback(`getArticlesByCategory(${category})`, client.reason);
  }

  try {
    const properties = await getDatabasePropertyNames();
    const results = await collectPages((cursor) => client.notion.databases.query({
      database_id: client.databaseId,
      filter: buildCategoryFilter(properties, category, language),
      sorts: buildDateSort(properties),
      start_cursor: cursor,
    }));

    return results
      .filter(isFullPage)
      .filter((page) => isPublishedArticle(page, client.databaseId))
      .map(transformPageToArticle)
      .filter((article) => article.category === category);
  } catch (error) {
    console.warn(`[Notion] Failed to fetch ${category} articles:`, error);
    return [];
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  const client = createNotionClient();
  if (!client.configured) {
    console.warn(`[Notion] getArticleById skipped: ${client.reason}`);
    return null;
  }

  try {
    const page = await client.notion.pages.retrieve({ page_id: id });
    if (!isFullPage(page) || !isPublishedArticle(page, client.databaseId)) return null;

    const article = transformPageToArticle(page);
    const blocks = await loadBlockChildren(id, (blockId, cursor) => client.notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    }));
    article.content = blocksToMarkdown(blocks);

    if (!article.excerpt) {
      article.excerpt =
        article.content.slice(0, 200).replace(/[#*`>\[\]]/g, "") + "...";
    }

    return article;
  } catch (error) {
    console.warn("[Notion] Failed to fetch article:", error);
    return null;
  }
}

export async function getRelatedArticle(articleId: string): Promise<Article | null> {
  const article = await getArticleById(articleId);
  if (!article?.relatedArticleId) return null;
  return getArticleById(article.relatedArticleId);
}

export async function getArticleByIdAndLanguage(
  id: string,
  language: Language
): Promise<Article | null> {
  const article = await getArticleById(id);
  if (!article) return null;

  if (article.language === language) return article;

  if (article.relatedArticleId) {
    const relatedArticle = await getArticleById(article.relatedArticleId);
    if (relatedArticle?.language === language) return relatedArticle;
  }

  return article;
}

export async function getAllArticleIds(): Promise<string[]> {
  const articles = await getArticles();
  return articles.map((article) => article.id);
}
