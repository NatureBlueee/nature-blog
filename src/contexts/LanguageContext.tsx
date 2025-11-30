"use client";

/**
 * 语言上下文
 *
 * 全局语言状态管理，支持中英文切换
 * 语言偏好持久化到 localStorage
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Language = "zh" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (zh: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = "preferred-language";

interface LanguageProviderProps {
  children: ReactNode;
}

// 从 localStorage 获取语言
function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "zh";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "zh" || stored === "en") return stored;
  return "zh";
}

// 订阅 storage 事件
function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// 服务端快照
function getServerSnapshot(): Language {
  return "zh";
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // 使用 useSyncExternalStore 来安全地从 localStorage 读取
  const storedLanguage = useSyncExternalStore(
    subscribeToStorage,
    getStoredLanguage,
    getServerSnapshot
  );

  const [language, setLanguageState] = useState<Language>(storedLanguage);

  // 设置语言并持久化
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, []);

  // 切换语言
  const toggleLanguage = useCallback(() => {
    setLanguage(language === "zh" ? "en" : "zh");
  }, [language, setLanguage]);

  // 翻译辅助函数
  const t = useCallback(
    (zh: string, en: string) => {
      return language === "zh" ? zh : en;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * 使用语言上下文的 Hook
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
