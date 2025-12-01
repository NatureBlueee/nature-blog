/**
 * 版本检测 API
 *
 * 用于检测 Notion 数据库是否有更新
 * 只获取数据库的 last_edited_time，非常快（<100ms）
 */

import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

type RateRecord = {
  count: number;
  expiresAt: number;
};

const RATE_LIMIT_WINDOW_MS = Number(process.env.VERSION_RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_MAX = Number(process.env.VERSION_RATE_LIMIT_MAX ?? 60);
const ACCESS_HEADER = "x-version-access-key";
const ACCESS_KEY = process.env.VERSION_ACCESS_KEY;

const rateLimitCache = new Map<string, RateRecord>();

function logApiError(reason: string, error: unknown, metadata?: Record<string, unknown>) {
  const normalizedError =
    error instanceof Error
      ? { message: error.message, stack: error.stack }
      : { message: String(error) };

  console.error(
    "[version-api]",
    JSON.stringify({
      level: "error",
      reason,
      ...metadata,
      error: normalizedError,
    })
  );
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0].trim() || realIp || "unknown";
  return ip;
}

function checkRateLimit(identifier: string) {
  const now = Date.now();
  const existing = rateLimitCache.get(identifier);

  if (!existing || existing.expiresAt <= now) {
    rateLimitCache.set(identifier, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return true;
  }

  existing.count += 1;
  rateLimitCache.set(identifier, existing);
  return false;
}

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function GET(request: Request) {
  const accessKey = request.headers.get(ACCESS_HEADER);
  const isKeyValid = ACCESS_KEY && accessKey === ACCESS_KEY;

  if (!isKeyValid) {
    const clientKey = getClientKey(request);
    const limited = checkRateLimit(clientKey);

    if (limited) {
      return NextResponse.json(
        {
          version: null,
          success: false,
          error: "Too many requests",
        },
        { status: 429 }
      );
    }
  }

  if (!DATABASE_ID) {
    return NextResponse.json(
      {
        version: null,
        success: false,
        error: "NOTION_DATABASE_ID not configured",
      },
      { status: 500 }
    );
  }

  try {
    const db = await notion.databases.retrieve({ database_id: DATABASE_ID });

    // 检查是否是完整的数据库响应（包含 last_edited_time）
    if ("last_edited_time" in db) {
      return NextResponse.json({
        version: db.last_edited_time,
        success: true,
      });
    }

    // 如果是部分响应，返回当前时间作为版本
    return NextResponse.json({
      version: new Date().toISOString(),
      success: true,
    });
  } catch (error) {
    logApiError("failed_to_check_version", error, {
      hasDatabaseId: Boolean(DATABASE_ID),
    });
    return NextResponse.json(
      {
        version: null,
        success: false,
      },
      { status: 500 }
    );
  }
}
