/**
 * 手动触发刷新 API
 *
 * 在 Notion 修改内容后，调用此接口即可立即刷新网站
 *
 * 使用方式（推荐 POST）：
 * curl -X POST https://natureblueee.com/api/revalidate \
 *   -H "Authorization: Bearer 你的密钥"
 *
 * 安全措施：
 * - 使用 Authorization Header 传递密钥（不在 URL 中暴露）
 * - 速率限制：每分钟最多 10 次
 * - 常量时间比较防止时序攻击
 */

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { env } from "@/lib/env";

// 速率限制配置
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 分钟
const MAX_REQUESTS = 10; // 每分钟最多 10 次
const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

/**
 * 获取客户端 IP 地址
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * 检查速率限制
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  // 清理过期记录
  if (record && now > record.resetTime) {
    ipRequestMap.delete(ip);
  }

  const current = ipRequestMap.get(ip);
  if (!current) {
    ipRequestMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (current.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((current.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  current.count++;
  return { allowed: true };
}

/**
 * 常量时间字符串比较，防止时序攻击
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // 长度不同时仍执行比较，避免泄露长度信息
    const dummyA = Buffer.from(a.padEnd(64, "\0"));
    const dummyB = Buffer.from(b.padEnd(64, "\0"));
    timingSafeEqual(dummyA, dummyB);
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * 从请求中提取密钥
 * 支持：Authorization: Bearer xxx 或 ?secret=xxx (向后兼容)
 */
function extractSecret(request: NextRequest): string | null {
  // 优先使用 Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // 向后兼容：支持 query parameter
  return request.nextUrl.searchParams.get("secret");
}

async function handleRevalidate(request: NextRequest) {
  const REVALIDATE_SECRET = env.REVALIDATE_SECRET;

  // 检查是否配置了密钥
  if (!REVALIDATE_SECRET) {
    return NextResponse.json(
      { success: false, message: "Revalidation not configured" },
      { status: 503 }
    );
  }

  // 速率限制
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) }
      }
    );
  }

  // 验证密钥
  const secret = extractSecret(request);
  if (!secret || !secureCompare(secret, REVALIDATE_SECRET)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // 刷新页面
    revalidatePath("/");
    revalidatePath("/posts/[id]", "page");
    revalidatePath("/posts");

    return NextResponse.json({
      success: true,
      message: "Revalidation triggered",
      timestamp: new Date().toISOString(),
    });
  } catch {
    // 不暴露内部错误详情
    console.error("[Revalidate API] Revalidation failed");
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 }
    );
  }
}

// POST 请求（推荐）
export async function POST(request: NextRequest) {
  return handleRevalidate(request);
}

// GET 请求（向后兼容，但不推荐）
export async function GET(request: NextRequest) {
  return handleRevalidate(request);
}
