"use client";

/**
 * 版本检测组件
 *
 * 放在页面中，自动检测 Notion 数据库是否有更新
 * 不渲染任何可见内容，只执行检测逻辑
 */

import { useVersionCheck } from "@/hooks/useVersionCheck";

export function VersionChecker() {
  useVersionCheck();
  return null;
}

