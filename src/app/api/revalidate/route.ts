/**
 * 手动触发刷新 API
 *
 * 在 Notion 修改内容后，访问此链接即可立即刷新网站
 * 使用方式：https://natureblueee.com/api/revalidate?secret=你的密钥
 */

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 从环境变量获取密钥（必须配置）
  const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

  if (!REVALIDATE_SECRET) {
    return NextResponse.json(
      {
        success: false,
        message: "REVALIDATE_SECRET 环境变量未配置。",
      },
      { status: 500 }
    );
  }

  const secret = request.nextUrl.searchParams.get("secret");

  // 验证密钥
  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid secret. 密钥错误。",
      },
      { status: 401 }
    );
  }

  try {
    // 刷新首页
    revalidatePath("/");

    // 刷新所有文章页面
    revalidatePath("/posts/[id]", "page");

    // 刷新文章列表页
    revalidatePath("/posts");

    const now = new Date().toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
    });

    return NextResponse.json({
      success: true,
      message: `✅ 刷新成功！Refreshed successfully!`,
      refreshedAt: now,
      paths: ["/", "/posts", "/posts/[id]"],
    });
  } catch (error) {
    console.error("[Revalidate API] Failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "刷新失败，请稍后重试。",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
