import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export function isPublishedArticle(page: PageObjectResponse, databaseId: string): boolean {
  if (page.archived || page.in_trash) return false;
  if (page.parent.type !== "database_id") return false;
  const normalize = (id: string) => id.replaceAll("-", "").toLowerCase();
  if (normalize(page.parent.database_id) !== normalize(databaseId)) return false;
  const status = page.properties["状态"];
  return status?.type === "select" && status.select?.name === "已发布";
}
