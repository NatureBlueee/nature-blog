import type { Language } from "@/contexts";

export type ArticleCategory = "理性" | "感性";

export interface Article {
  id: string;
  title: string;
  publishedAt: string;
  category: ArticleCategory;
  excerpt: string;
  content?: string;
  cover?: string;
  language: Language;
  relatedArticleId?: string;
  isPrimary: boolean;
}

export type NotionUnavailableResult = {
  configured: false;
  reason: string;
};

export type NotionAvailableResult = {
  configured: true;
  databaseId: string;
};

export type NotionStatus = NotionAvailableResult | NotionUnavailableResult;
