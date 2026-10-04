import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { Language } from "@/contexts";
import type { Article, ArticleCategory } from "./types";
import { extractText } from "./rich-text";

type PageProperties = PageObjectResponse["properties"];
type PageProperty = PageProperties[string];

function getProperty(props: PageProperties, name: string): PageProperty | undefined {
  return props[name];
}

function getTitle(props: PageProperties, name: string): string {
  const property = getProperty(props, name);
  return property?.type === "title" ? extractText(property.title) : "";
}

function getRichText(props: PageProperties, name: string): string {
  const property = getProperty(props, name);
  return property?.type === "rich_text" ? extractText(property.rich_text) : "";
}

function getSelectName(props: PageProperties, name: string): string | undefined {
  const property = getProperty(props, name);
  return property?.type === "select" ? property.select?.name : undefined;
}

function getDateStart(props: PageProperties, name: string): string | undefined {
  const property = getProperty(props, name);
  return property?.type === "date" ? property.date?.start : undefined;
}

function getCheckbox(props: PageProperties, name: string): boolean | undefined {
  const property = getProperty(props, name);
  return property?.type === "checkbox" ? property.checkbox : undefined;
}

function getFirstRelationId(props: PageProperties, name: string): string | undefined {
  const property = getProperty(props, name);
  if (property?.type !== "relation") return undefined;
  return property.relation[0]?.id;
}

function getCover(page: PageObjectResponse): string | undefined {
  if (!page.cover) return undefined;
  if (page.cover.type === "external") return page.cover.external.url;
  if (page.cover.type === "file") return page.cover.file.url;
  return undefined;
}

function toLanguage(value: string | undefined): Language {
  return value === "en" ? "en" : "zh";
}

function toCategory(value: string | undefined): ArticleCategory {
  return value === "感性" ? "感性" : "理性";
}

export function isFullPage(page: unknown): page is PageObjectResponse {
  if (!page || typeof page !== "object") return false;

  const objectValue = (page as { object?: unknown }).object;
  return objectValue === "page" && "properties" in page;
}

export function transformPageToArticle(page: PageObjectResponse): Article {
  const props = page.properties;
  const publishedDate =
    getDateStart(props, "发布日期") || page.created_time.split("T")[0] || "";

  return {
    id: page.id,
    title: getTitle(props, "标题"),
    publishedAt: publishedDate,
    category: toCategory(getSelectName(props, "类型")),
    excerpt: getRichText(props, "摘要"),
    cover: getCover(page),
    language: toLanguage(getSelectName(props, "语言")),
    relatedArticleId: getFirstRelationId(props, "关联文章"),
    isPrimary: getCheckbox(props, "主文章") ?? true,
  };
}
