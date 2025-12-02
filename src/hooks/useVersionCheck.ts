"use client";

/**
 * 版本检测 Hook
 *
 * 检测 Notion 数据库是否有更新：
 * - 首次访问：保存版本号
 * - 再次访问：对比版本号，如果变了就刷新页面
 *
 * 这样可以在保持 ISR 静态页面优势的同时，实现自动检测更新
 *
 * 安全优化：
 * - localStorage 数据过期策略（7 天）
 * - 自动清理过期数据，避免长期占用存储空间
 */

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const VERSION_KEY = "notion-version";
const VERSION_TIMESTAMP_KEY = "notion-version-ts";
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 天过期

/**
 * 检查并清理过期的 localStorage 数据
 */
function cleanupExpiredData(): boolean {
  const timestamp = localStorage.getItem(VERSION_TIMESTAMP_KEY);
  if (!timestamp) return false;

  const age = Date.now() - Number(timestamp);
  if (age > MAX_AGE) {
    localStorage.removeItem(VERSION_KEY);
    localStorage.removeItem(VERSION_TIMESTAMP_KEY);
    return true;
  }
  return false;
}

export function useVersionCheck() {
  const router = useRouter();
  const checkedRef = useRef(false);

  useEffect(() => {
    // 防止 React 严格模式下重复执行
    if (checkedRef.current) return;
    checkedRef.current = true;

    // 检查并清理过期数据
    cleanupExpiredData();

    async function checkVersion() {
      try {
        const res = await fetch("/api/version");
        if (!res.ok) return;

        const { version, success } = await res.json();
        if (!success || !version) return;

        const cachedVersion = localStorage.getItem(VERSION_KEY);

        if (cachedVersion && cachedVersion !== version) {
          // 版本变了，刷新页面数据
          console.log("[VersionCheck] 检测到更新，刷新数据...");
          localStorage.setItem(VERSION_KEY, version);
          localStorage.setItem(VERSION_TIMESTAMP_KEY, String(Date.now()));
          router.refresh();
        } else if (!cachedVersion) {
          // 首次访问，保存版本
          console.log("[VersionCheck] 首次访问，保存版本号");
          localStorage.setItem(VERSION_KEY, version);
          localStorage.setItem(VERSION_TIMESTAMP_KEY, String(Date.now()));
        } else {
          // 更新时间戳，延长过期时间
          localStorage.setItem(VERSION_TIMESTAMP_KEY, String(Date.now()));
          console.log("[VersionCheck] 版本相同，使用缓存");
        }
      } catch (error) {
        console.warn("[VersionCheck] 版本检测失败:", error);
      }
    }

    checkVersion();
  }, [router]);
}

