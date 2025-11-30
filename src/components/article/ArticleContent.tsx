/**
 * 文章正文组件
 *
 * 渲染 Markdown 内容
 * 设计：舒适的阅读体验，思源宋体
 */

import styles from "./styles.module.css";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // 简单的 Markdown 到 HTML 转换
  const htmlContent = markdownToHtml(content);

  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

/**
 * 简易 Markdown 转 HTML
 *
 * 支持：段落、标题、列表、引用、代码块
 * 设计原则：够用就好，保持简单
 */
function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  // 先处理代码块，避免内部内容被其他规则影响
  const codeBlocks: string[] = [];
  let processed = markdown.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_, lang, code) => {
      codeBlocks.push(
        `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`
      );
      return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    }
  );

  // 处理列表（需要特殊处理以支持多行）
  processed = processLists(processed);

  // 其他 Markdown 转换
  processed = processed
    // 行内代码
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // 标题
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // 引用（支持多行）
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // 分隔线
    .replace(/^---$/gm, "<hr />")
    // 粗体
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    // 斜体
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 处理段落
  processed = processParagraphs(processed);

  // 恢复代码块
  codeBlocks.forEach((block, i) => {
    processed = processed.replace(`__CODE_BLOCK_${i}__`, block);
  });

  // 合并相邻的 blockquote
  processed = processed.replace(/<\/blockquote>\s*<blockquote>/g, "<br />");

  return processed;
}

/**
 * 处理列表
 */
function processLists(text: string): string {
  // 无序列表
  text = text.replace(/(?:^|\n)((?:- .+\n?)+)/g, (_, items) => {
    const listItems = items
      .trim()
      .split("\n")
      .map((item: string) => {
        const content = item.replace(/^- /, "").trim();
        return `<li>${content}</li>`;
      })
      .join("");
    return `\n<ul>${listItems}</ul>\n`;
  });

  // 有序列表
  text = text.replace(/(?:^|\n)((?:\d+\. .+\n?)+)/g, (_, items) => {
    const listItems = items
      .trim()
      .split("\n")
      .map((item: string) => {
        const content = item.replace(/^\d+\. /, "").trim();
        return `<li>${content}</li>`;
      })
      .join("");
    return `\n<ol>${listItems}</ol>\n`;
  });

  return text;
}

/**
 * 处理段落
 */
function processParagraphs(text: string): string {
  // 按双换行分割
  const blocks = text.split(/\n\n+/);

  return blocks
    .map((block) => {
      block = block.trim();
      if (!block) return "";

      // 如果已经是 HTML 标签，不包裹
      if (
        block.startsWith("<h") ||
        block.startsWith("<ul") ||
        block.startsWith("<ol") ||
        block.startsWith("<blockquote") ||
        block.startsWith("<pre") ||
        block.startsWith("<hr") ||
        block.startsWith("__CODE_BLOCK")
      ) {
        return block;
      }

      // 处理段落内的换行
      block = block.replace(/\n/g, "<br />");

      return `<p>${block}</p>`;
    })
    .join("\n");
}

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
