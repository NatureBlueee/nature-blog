/**
 * 文本处理工具函数
 */

/**
 * 计算阅读时间（分钟）
 *
 * 中文阅读速度约 300-500 字/分钟，取 400
 * 英文阅读速度约 200-250 词/分钟，取 225
 */
export function calculateReadingTime(content: string): number {
  // 统计中文字符
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;

  // 统计英文单词
  const englishWords = (
    content.match(/[a-zA-Z]+/g) || []
  ).length;

  // 计算阅读时间
  const chineseTime = chineseChars / 400;
  const englishTime = englishWords / 225;

  // 至少 1 分钟
  return Math.max(1, Math.ceil(chineseTime + englishTime));
}

/**
 * 统计字数
 *
 * 中文按字符计数，英文按单词计数
 */
export function countWords(content: string): number {
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;

  return chineseChars + englishWords;
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * 移除 Markdown 标记（用于生成纯文本摘要）
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    // 移除行内代码
    .replace(/`[^`]+`/g, '')
    // 移除图片
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // 移除链接，保留文本
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, '')
    // 移除粗体/斜体
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // 移除引用标记
    .replace(/^>\s+/gm, '')
    // 移除列表标记
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // 压缩空白
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
