/**
 * 版本检测 API
 *
 * 用于检测 Notion 数据库是否有更新
 * 只获取数据库的 last_edited_time，非常快（<100ms）
 */

import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function GET() {
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
