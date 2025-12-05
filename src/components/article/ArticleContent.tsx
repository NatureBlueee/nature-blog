/**
 * 文章正文组件
 *
 * 使用 react-markdown 渲染 Markdown 内容
 * - remark-gfm: 支持 GitHub Flavored Markdown (表格、删除线、任务列表等)
 * - rehype-raw: 支持内嵌 HTML (如 <u> 下划线)
 * - rehype-sanitize: XSS 防护
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Components } from "react-markdown";
import styles from "./styles.module.css";

interface ArticleContentProps {
  content: string;
}

/**
 * 安全配置：扩展默认 schema 以支持额外标签
 */
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "u",        // 下划线
    "figure",   // 图片容器
    "figcaption", // 图片说明
  ],
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img || []),
      "loading",  // 懒加载
      "alt",
      "src",
    ],
    a: [
      ...(defaultSchema.attributes?.a || []),
      "href",
      "target",
      "rel",
    ],
    code: [
      ...(defaultSchema.attributes?.code || []),
      "className", // 代码语言高亮
    ],
  },
};

/**
 * 自定义组件渲染
 */
const components: Components = {
  // 链接：外部链接添加安全属性
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        {...(isExternal && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        {...props}
      >
        {children}
      </a>
    );
  },

  // 图片：懒加载 + figure 包裹
  img: ({ src, alt, ...props }) => {
    const hasCaption = alt && alt !== "image";

    if (hasCaption) {
      return (
        <figure>
          <img src={src} alt={alt} loading="lazy" {...props} />
          <figcaption>{alt}</figcaption>
        </figure>
      );
    }

    return <img src={src} alt={alt || ""} loading="lazy" {...props} />;
  },

  // 代码块：添加语言类名
  code: ({ className, children, ...props }) => {
    // 检查是否是代码块（有 className）还是行内代码
    const isBlock = className?.includes("language-");

    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    // 行内代码
    return <code {...props}>{children}</code>;
  },
};

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content) return null;

  return (
    <div className={styles.content}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,  // 先处理原始 HTML
          [rehypeSanitize, sanitizeSchema],  // 再清洗
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
