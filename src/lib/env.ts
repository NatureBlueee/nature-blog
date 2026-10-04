/**
 * 环境变量模块
 *
 * Next.js 会在 build 的 page-data 阶段加载服务端模块。Notion 配置缺失时，
 * 页面应降级为空内容，只有真正需要 Notion 写操作/实时检查的 API 返回 503。
 */

import { z } from "zod";

const envSchema = z.object({
  NOTION_TOKEN: z.string().min(1).optional(),
  NOTION_DATABASE_ID: z.string().min(1).optional(),
  // REVALIDATE_SECRET 是完全可选的
  // 如果提供且非空，则必须至少16字符
  REVALIDATE_SECRET: z
    .string()
    .min(16, "REVALIDATE_SECRET must be at least 16 characters")
    .optional()
    .or(z.literal("")),
  // NEXT_PUBLIC_SITE_URL 是可选的，有默认值
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

/**
 * 验证后的环境变量。
 * Notion 变量是运行能力开关，不是 import-time 硬前提。
 */
export const env = envSchema.parse({
  NOTION_TOKEN: process.env.NOTION_TOKEN || undefined,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID || undefined,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || undefined,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
});

export function hasNotionConfig(): boolean {
  return Boolean(env.NOTION_TOKEN && env.NOTION_DATABASE_ID);
}

export function getNotionConfig():
  | { configured: true; token: string; databaseId: string }
  | { configured: false; reason: string } {
  if (!env.NOTION_TOKEN || !env.NOTION_DATABASE_ID) {
    return {
      configured: false,
      reason: "NOTION_TOKEN and NOTION_DATABASE_ID are required for Notion content",
    };
  }

  return {
    configured: true,
    token: env.NOTION_TOKEN,
    databaseId: env.NOTION_DATABASE_ID,
  };
}
