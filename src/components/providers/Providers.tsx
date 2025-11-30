"use client";

/**
 * 客户端 Providers 包装组件
 *
 * 包含所有需要客户端渲染的 Context Providers
 */

import { LanguageProvider } from "@/contexts";
import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

