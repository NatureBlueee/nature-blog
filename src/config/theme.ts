/**
 * 主题配置
 *
 * 设计系统的核心变量，遵循宋代美学 + 瑞士国际主义
 * 这些值会被转换为 CSS 变量，供组件使用
 */

export const themeConfig = {
  colors: {
    /** 背景色 - 宣纸白，绝对不用纯白 */
    background: '#F5F5F3',
    /** 次级背景色 - 用于卡片等 */
    backgroundSecondary: '#EDEDE9',
    /** 正文色 - 干透的墨汁，不用纯黑 */
    text: '#2B2B2B',
    /** 次级文字 - 淡墨 */
    textSecondary: '#666666',
    /** 更淡的文字 - 用于时间戳等 */
    textTertiary: '#999999',
    /** 强调色 - 朱砂红，仅用于链接或 Hash 值 */
    accent: '#B03A2E',
    /** 强调色悬停态 */
    accentHover: '#922D24',
    /** 边框色 */
    border: '#E0E0DC',
    /** 分割线 */
    divider: '#E8E8E4',
    /** 老绢 - 泛黄的丝绸底色 (第三屏背景) */
    silk: '#E6E4D5',
    /** 深绢 - 用于纹理 */
    silkDark: '#D4D2C5',
    /** 定窑白 - 象牙白 (备用) */
    dingWhite: '#F2F1E8',
    /** 影青 - 雨过天青 (第四屏备用) */
    shadowBlue: '#C8D5DB',
    /** 金泥 - 用于修复/点缀 */
    goldMud: '#C5A059',
  },

  /** 深色模式配色 - 预留结构，Phase 2 实现 */
  colorsDark: {
    background: '#1A1A1A',
    backgroundSecondary: '#242424',
    text: '#E8E8E4',
    textSecondary: '#A0A0A0',
    textTertiary: '#707070',
    accent: '#D4544A',
    accentHover: '#E06B62',
    border: '#333333',
    divider: '#2A2A2A',
  },

  fonts: {
    /** 中文正文 - 思源宋体 */
    serif: '"Noto Serif SC", "Source Han Serif SC", "Songti SC", serif',
    /** 西文/代码 - 等宽字体 */
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    /** 无衬线 - 用于 UI 元素 */
    sans: '"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif',
  },

  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  /** 行高 - 中文阅读需要更大行高 */
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    /** 长文阅读推荐 */
    reading: 1.8,
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  /** 最大内容宽度 */
  maxWidth: {
    /** 文章阅读区 - 适合长文阅读 */
    article: '680px',
    /** 内容区域 */
    content: '800px',
    /** 页面容器 */
    container: '1200px',
  },

  /** 圆角 - 保持克制 */
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
  },

  /** 过渡动画 - 微妙不抢眼 */
  transition: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease',
  },
} as const;

export type ThemeConfig = typeof themeConfig;
