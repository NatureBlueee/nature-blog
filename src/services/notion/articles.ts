/**
 * Notion 文章服务
 *
 * 从 Notion Database 获取文章数据
 * 支持多语言（中/英）通过独立 Page 关联实现
 */

import { Client } from "@notionhq/client";
import type { Language } from "@/contexts";
import { env } from "@/lib/env";

/**
 * Notion 客户端
 */
const notion = new Client({
  auth: env.NOTION_TOKEN,
});

const DATABASE_ID = env.NOTION_DATABASE_ID;

/**
 * 文章类型
 */
export interface Article {
  id: string;
  title: string;
  publishedAt: string;
  category: "理性" | "感性";
  excerpt: string;
  content?: string;
  cover?: string;
  // 多语言支持
  language: Language;
  relatedArticleId?: string; // 关联的其他语言版本
  isPrimary: boolean; // 是否为主文章（中文版）
}

/**
 * 从 RichText 数组提取纯文本
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(richText: any[] | undefined): string {
  if (!richText) return "";
  return richText.map((t) => t.plain_text || "").join("");
}

/**
 * 将 Notion RichText 转换为 Markdown（保留格式）
 *
 * 支持：粗体、斜体、删除线、行内代码、链接、下划线
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function richTextToMarkdown(richText: any[] | undefined): string {
  if (!richText) return "";

  return richText
    .map((t) => {
      let text = t.plain_text || "";
      if (!text) return "";

      const annotations = t.annotations || {};

      // 行内代码优先处理（不与其他格式混合）
      if (annotations.code) {
        return `\`${text}\``;
      }

      // 链接
      if (t.href) {
        text = `[${text}](${t.href})`;
      }

      // 粗体
      if (annotations.bold) {
        text = `**${text}**`;
      }

      // 斜体
      if (annotations.italic) {
        text = `*${text}*`;
      }

      // 删除线
      if (annotations.strikethrough) {
        text = `~~${text}~~`;
      }

      // 下划线（Markdown 不原生支持，使用 HTML）
      if (annotations.underline) {
        text = `<u>${text}</u>`;
      }

      return text;
    })
    .join("");
}

/**
 * 将 Notion Page 转换为 Article
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformPageToArticle(page: any): Article {
  const props = page.properties || {};

  // 提取封面图片
  let cover: string | undefined;
  if (page.cover) {
    if (page.cover.type === "external") {
      cover = page.cover.external?.url;
    } else if (page.cover.type === "file") {
      cover = page.cover.file?.url;
    }
  }

  const publishedDate =
    props["发布日期"]?.date?.start || page.created_time?.split("T")[0] || "";

  // 提取语言（默认中文）
  const language = (props["语言"]?.select?.name as Language) || "zh";

  // 提取关联文章 ID
  const relatedArticles = props["关联文章"]?.relation || [];
  const relatedArticleId =
    relatedArticles.length > 0 ? relatedArticles[0].id : undefined;

  // 是否为主文章（默认 true，兼容旧数据）
  const isPrimary = props["主文章"]?.checkbox ?? true;

  // 提取摘要
  const excerpt = extractText(props["摘要"]?.rich_text) || "";

  return {
    id: page.id,
    title: extractText(props["标题"]?.title),
    publishedAt: publishedDate,
    category: (props["类型"]?.select?.name as "理性" | "感性") || "理性",
    excerpt,
    cover,
    language,
    relatedArticleId,
    isPrimary,
  };
}

/**
 * 获取已发布的文章列表（只获取主文章）
 */
export async function getArticles(): Promise<Article[]> {
  if (!DATABASE_ID) {
    console.warn("NOTION_DATABASE_ID not configured");
    return [];
  }

  try {
    // 先检查数据库是否有"主文章"属性
    const dbInfo = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });
    const props = Object.keys(dbInfo.properties);
    const hasPrimaryField = props.includes("主文章");

    // 构建过滤器
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let filter: any = {
      property: "状态",
      select: { equals: "已发布" },
    };

    // 如果有主文章字段，只获取主文章
    if (hasPrimaryField) {
      filter = {
        and: [
          { property: "状态", select: { equals: "已发布" } },
          { property: "主文章", checkbox: { equals: true } },
        ],
      };
    }

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter,
      sorts: [
        {
          property: "发布日期",
          direction: "descending",
        },
      ],
    });

    return (
      response.results
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((page: any) => "properties" in page)
        .map(transformPageToArticle)
    );
  } catch (error) {
    console.warn("Failed to fetch articles from Notion:", error);
    return [];
  }
}

/**
 * 按类型获取文章（获取所有语言版本）
 * @param category 文章类型：理性 | 感性
 * @param language 可选，指定语言过滤
 */
export async function getArticlesByCategory(
  category: "理性" | "感性",
  language?: Language
): Promise<Article[]> {
  if (!DATABASE_ID) {
    console.warn("[Notion] DATABASE_ID 未配置");
    return [];
  }

  try {
    // 先尝试获取数据库信息，验证连接和属性
    const dbInfo = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });
    const props = Object.keys(dbInfo.properties);

    // 检查必要属性是否存在
    const requiredProps = ["状态", "类型", "发布日期", "标题", "语言"];
    const missingProps = requiredProps.filter((p) => !props.includes(p));

    if (missingProps.length > 0) {
      console.warn(`[Notion] 数据库缺少属性: ${missingProps.join(", ")}`);
      console.warn(`[Notion] 当前数据库属性: ${props.join(", ")}`);
    }

    // 构建过滤器 - 按状态、类型过滤，语言可选
    const hasStatus = props.includes("状态");
    const hasCategory = props.includes("类型");
    const hasLanguage = props.includes("语言");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = [];

    if (hasStatus) {
      conditions.push({ property: "状态", select: { equals: "已发布" } });
    }
    if (hasCategory) {
      conditions.push({ property: "类型", select: { equals: category } });
    }
    // 只有指定了语言才过滤，否则获取所有语言
    if (language && hasLanguage) {
      conditions.push({ property: "语言", select: { equals: language } });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let filter: any = undefined;
    if (conditions.length > 1) {
      filter = { and: conditions };
    } else if (conditions.length === 1) {
      filter = conditions[0];
    }

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter,
      sorts: props.includes("发布日期")
        ? [{ property: "发布日期", direction: "descending" }]
        : undefined,
    });

    const articles = response.results
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((page: any) => "properties" in page)
      .map(transformPageToArticle)
      // 如果没有类型属性，在代码层面过滤
      .filter((a: Article) => !hasCategory || a.category === category);

    return articles;
  } catch (error) {
    console.warn(`[Notion] 获取 ${category} 文章失败:`, error);
    return [];
  }
}

/**
 * 获取单篇文章详情（含内容）
 * 
 * ISR 已在框架层面处理缓存，这里不需要手动缓存
 */
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });

    if (!("properties" in page)) {
      return null;
    }

    const article = transformPageToArticle(page);

    // 获取页面内容
    const blocks = await notion.blocks.children.list({ block_id: id });
    article.content = blocksToMarkdown(blocks.results);

    // 如果没有摘要，从内容生成
    if (!article.excerpt) {
      article.excerpt =
        article.content.slice(0, 200).replace(/[#*`>\[\]]/g, "") + "...";
    }

    return article;
  } catch (error) {
    console.warn("Failed to fetch article:", error);
    return null;
  }
}

/**
 * 获取文章的关联语言版本
 */
export async function getRelatedArticle(
  articleId: string
): Promise<Article | null> {
  try {
    const article = await getArticleById(articleId);
    if (!article?.relatedArticleId) {
      return null;
    }
    return await getArticleById(article.relatedArticleId);
  } catch (error) {
    console.warn("Failed to fetch related article:", error);
    return null;
  }
}

/**
 * 根据语言获取文章（如果当前语言版本不存在，返回主版本）
 */
export async function getArticleByIdAndLanguage(
  id: string,
  language: Language
): Promise<Article | null> {
  try {
    const article = await getArticleById(id);
    if (!article) return null;

    // 如果文章语言与请求语言匹配，直接返回
    if (article.language === language) {
      return article;
    }

    // 如果不匹配，尝试获取关联的语言版本
    if (article.relatedArticleId) {
      const relatedArticle = await getArticleById(article.relatedArticleId);
      if (relatedArticle && relatedArticle.language === language) {
        return relatedArticle;
      }
    }

    // 如果没有对应语言版本，返回原文章
    return article;
  } catch (error) {
    console.warn("Failed to fetch article by language:", error);
    return null;
  }
}

/**
 * 获取所有文章 ID（用于静态生成）
 */
export async function getAllArticleIds(): Promise<string[]> {
  const articles = await getArticles();
  return articles.map((a) => a.id);
}

/**
 * 将 Notion Blocks 转换为 Markdown
 *
 * 支持富文本格式：粗体、斜体、链接、代码等
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blocksToMarkdown(blocks: any[]): string {
  return blocks
    .map((block) => {
      if (!block.type) return "";

      switch (block.type) {
        case "paragraph":
          return richTextToMarkdown(block.paragraph?.rich_text) + "\n\n";
        case "heading_1":
          return "# " + richTextToMarkdown(block.heading_1?.rich_text) + "\n\n";
        case "heading_2":
          return "## " + richTextToMarkdown(block.heading_2?.rich_text) + "\n\n";
        case "heading_3":
          return "### " + richTextToMarkdown(block.heading_3?.rich_text) + "\n\n";
        case "bulleted_list_item":
          return "- " + richTextToMarkdown(block.bulleted_list_item?.rich_text) + "\n";
        case "numbered_list_item":
          return (
            "1. " + richTextToMarkdown(block.numbered_list_item?.rich_text) + "\n"
          );
        case "quote":
          return "> " + richTextToMarkdown(block.quote?.rich_text) + "\n\n";
        case "code": {
          // 代码块使用纯文本，不处理格式
          const language = block.code?.language || "";
          return "```" + language + "\n" + extractText(block.code?.rich_text) + "\n```\n\n";
        }
        case "divider":
          return "---\n\n";
        case "image": {
          // 图片支持
          let imageUrl = "";
          if (block.image?.type === "external") {
            imageUrl = block.image.external?.url || "";
          } else if (block.image?.type === "file") {
            imageUrl = block.image.file?.url || "";
          }
          const caption = extractText(block.image?.caption);
          if (imageUrl) {
            return `![${caption || "image"}](${imageUrl})\n\n`;
          }
          return "";
        }
        case "callout": {
          // 提示框转为引用
          const icon = block.callout?.icon?.emoji || "💡";
          const text = richTextToMarkdown(block.callout?.rich_text);
          return `> ${icon} ${text}\n\n`;
        }
        case "toggle": {
          // 折叠块转为标题+内容
          const summary = richTextToMarkdown(block.toggle?.rich_text);
          return `**${summary}**\n\n`;
        }
        case "bookmark": {
          // 书签转为链接
          const url = block.bookmark?.url || "";
          const caption = extractText(block.bookmark?.caption) || url;
          return `[${caption}](${url})\n\n`;
        }
        default:
          return "";
      }
    })
    .join("");
}
