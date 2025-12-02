/**
 * 版本检测 API
 *
 * 用于检测 Notion 数据库是否有更新
 * 只获取数据库的 last_edited_time，非常快（<100ms）
 *
 * 安全措施：
 * - 速率限制：每分钟最多 30 次请求
 * - 版本信息模糊化：返回 hash 而非原始时间戳
 */

import { Client } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { env } from "@/lib/env";

const notion = new Client({ auth: env.NOTION_TOKEN });
const DATABASE_ID = env.NOTION_DATABASE_ID;

// 速率限制配置
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 分钟
const MAX_REQUESTS = 30; // 每分钟最多 30 次
const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

/**
 * 获取客户端 IP 地址
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded && forwarded.length > 0) {
    // 形如 "ip1, ip2, ip3" 取第一个即可
    return forwarded.split(",")[0]!.trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP && realIP.length > 0) {
    return realIP;
  }

  // 在本地或某些运行环境下可能拿不到 IP，用占位符
  return "unknown";
}

/**
 * 检查速率限制
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetTime) {
    ipRequestMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

/**
 * 清理过期的速率限制记录（防止内存泄漏）
 */
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now > record.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}

export async function GET(request: NextRequest) {
  // 速率限制检查
  const clientIP = getClientIP(request);
  if (isRateLimited(clientIP)) {
    return NextResponse.json(
      {
        version: null,
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      },
      { status: 429 }
    );
  }

  // 定期清理过期记录
  if (Math.random() < 0.1) {
    // 10% 概率清理，避免每次请求都清理
    cleanupRateLimitMap();
  }

  try {
    const db = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });

    // 检查是否是完整的数据库响应（包含 last_edited_time）
    if ("last_edited_time" in db) {
      // 版本信息模糊化：返回 hash 而非原始时间戳
      const versionHash = createHash("sha256")
        .update(db.last_edited_time)
        .digest("hex")
        .slice(0, 16);

      return NextResponse.json({
        version: versionHash,
        success: true,
      });
    }

    // 如果是部分响应，返回当前时间的 hash
    const fallbackHash = createHash("sha256")
      .update(new Date().toISOString())
      .digest("hex")
      .slice(0, 16);

    return NextResponse.json({
      version: fallbackHash,
      success: true,
    });
  } catch (error) {
    console.error("[Version API] Failed to check version:", error);
    return NextResponse.json(
      {
        version: null,
        success: false,
      },
      { status: 500 }
    );
  }
}
