"use client";

/**
 * 版本检测 Hook
 *
 * 检测 Notion 数据库是否有更新：
 * - 首次访问：保存版本号
 * - 再次访问：对比版本号，如果变了就刷新页面
 *
 * 这样可以在保持 ISR 静态页面优势的同时，实现自动检测更新
 */

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const VERSION_KEY = "notion-version";

export function useVersionCheck() {
  const router = useRouter();
  const checkedRef = useRef(false);

  useEffect(() => {
    // 防止 React 严格模式下重复执行
    if (checkedRef.current) return;
    checkedRef.current = true;

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
          router.refresh();
        } else if (!cachedVersion) {
          // 首次访问，保存版本
          console.log("[VersionCheck] 首次访问，保存版本号");
          localStorage.setItem(VERSION_KEY, version);
        } else {
          console.log("[VersionCheck] 版本相同，使用缓存");
        }
      } catch (error) {
        console.warn("[VersionCheck] 版本检测失败:", error);
      }
    }

    checkVersion();
  }, [router]);
}

