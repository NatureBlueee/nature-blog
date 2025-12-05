/**
 * 环境变量校验模块
 *
 * 使用 Zod 在应用启动时验证必需的环境变量
 * 缺失关键变量时 fail-fast，避免运行时错误
 */

import { z } from "zod";

const envSchema = z.object({
  NOTION_TOKEN: z.string().min(1, "NOTION_TOKEN is required"),
  NOTION_DATABASE_ID: z.string().min(1, "NOTION_DATABASE_ID is required"),
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
 * 验证后的环境变量
 * 如果验证失败，会在启动时抛出错误
 */
export const env = envSchema.parse({
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || undefined,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
});
