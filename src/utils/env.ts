import "server-only";

import { z } from "zod";

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

const envSchema = z.object({
  NOTION_TOKEN: z.string().min(1, "NOTION_TOKEN is required"),
  NOTION_DATABASE_ID: z.string().min(1, "NOTION_DATABASE_ID is required"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_SITE_URL is required")
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL"),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

function parseEnv(): Env {
  const result = envSchema.safeParse({
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!result.success) {
    const message = result.error.errors
      .map((err) => `${err.path.join(".") || "environment"}: ${err.message}`)
      .join("; ");
    throw new ConfigError(`Environment validation failed: ${message}`);
  }

  return result.data;
}

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;
  cachedEnv = parseEnv();
  return cachedEnv;
}

export const env = getEnv();

export const publicEnv = {
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
};
