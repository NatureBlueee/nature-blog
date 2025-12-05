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
  // REVALIDATE_SECRET 是可选的，但如果提供则必须至少16字符
  // 空字符串会被转换为 undefined
  REVALIDATE_SECRET: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .pipe(
      z
        .string()
        .min(16, "REVALIDATE_SECRET must be at least 16 characters")
        .optional()
    ),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .pipe(z.string().url().optional()),
});

/**
 * 验证后的环境变量
 * 如果验证失败，会在启动时抛出错误
 */
export const env = envSchema.parse({
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

