import { Client } from "@notionhq/client";
import { getNotionConfig } from "@/lib/env";
import type { NotionStatus } from "./types";

export function getNotionStatus(): NotionStatus {
  const config = getNotionConfig();
  if (!config.configured) {
    return { configured: false, reason: config.reason };
  }

  return { configured: true, databaseId: config.databaseId };
}

export function createNotionClient():
  | { configured: true; notion: Client; databaseId: string }
  | { configured: false; reason: string } {
  const config = getNotionConfig();
  if (!config.configured) {
    return { configured: false, reason: config.reason };
  }

  return {
    configured: true,
    notion: new Client({ auth: config.token }),
    databaseId: config.databaseId,
  };
}
