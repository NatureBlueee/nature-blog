"use client";

/**
 * 语言切换组件
 *
 * 竖排样式，位于右上角，与原"晨曦"位置和风格一致
 * 只显示切换目标语言（中文页面显示EN，英文页面显示中）
 */

import { useLanguage } from "@/contexts";
import { motion } from "framer-motion";

interface LanguageSwitchProps {
  className?: string;
  style?: React.CSSProperties;
}

export function LanguageSwitch({ className, style }: LanguageSwitchProps) {
  const { language, toggleLanguage } = useLanguage();

  // 只显示切换目标
  const displayText = language === "zh" ? "EN" : "中";

  return (
    <motion.button
      onClick={toggleLanguage}
      className={`hover-target ${className || ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.9 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{
        writingMode: "vertical-rl",
        background: "transparent",
        border: "none",
        padding: 0,
        fontSize: "2.5rem",
        fontWeight: 500,
        letterSpacing: "0.5em",
        color: "var(--ink-main)",
        userSelect: "none",
        cursor: "pointer",
        ...style,
      }}
      whileHover={{ opacity: 1 }}
      whileTap={{ scale: 0.95 }}
    >
      {displayText}
    </motion.button>
  );
}
