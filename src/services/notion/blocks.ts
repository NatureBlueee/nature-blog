import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { extractText, richTextToMarkdown } from "./rich-text";
import { collectPages } from "./pagination";

export type NotionBlock = (BlockObjectResponse | PartialBlockObjectResponse) & {
  children?: NotionBlock[];
};

type BlockBatch = { results: NotionBlock[]; has_more: boolean; next_cursor: string | null };

export async function loadBlockChildren(
  blockId: string,
  fetchChildren: (id: string, cursor?: string) => Promise<BlockBatch>,
  depth = 0
): Promise<NotionBlock[]> {
  if (depth > 32) throw new Error("Notion content nesting exceeds 32 levels");
  const blocks = await collectPages((cursor) => fetchChildren(blockId, cursor));
  for (const block of blocks) {
    if (isFullBlock(block) && block.has_children && block.type !== "child_page" && block.type !== "child_database") {
      block.children = await loadBlockChildren(block.id, fetchChildren, depth + 1);
    }
  }
  return blocks;
}

function isFullBlock(block: NotionBlock): block is BlockObjectResponse & { children?: NotionBlock[] } {
  return "type" in block;
}

export function blocksToMarkdown(blocks: NotionBlock[]): string {
  return blocks
    .map((block) => {
      if (!isFullBlock(block)) return "";

      const children = block.children ? blocksToMarkdown(block.children).trimEnd() : "";
      const nested = children ? children.split("\n").map((line) => `    ${line}`).join("\n") + "\n" : "";
      const quote = (text: string) => text.split("\n").map((line) => `> ${line}`).join("\n") + "\n\n";

      switch (block.type) {
        case "paragraph":
          return `${richTextToMarkdown(block.paragraph.rich_text)}\n\n${children ? children + "\n\n" : ""}`;
        case "heading_1":
          return `# ${richTextToMarkdown(block.heading_1.rich_text)}\n\n`;
        case "heading_2":
          return `## ${richTextToMarkdown(block.heading_2.rich_text)}\n\n`;
        case "heading_3":
          return `### ${richTextToMarkdown(block.heading_3.rich_text)}\n\n`;
        case "bulleted_list_item":
          return `- ${richTextToMarkdown(block.bulleted_list_item.rich_text)}\n${nested}`;
        case "numbered_list_item":
          return `1. ${richTextToMarkdown(block.numbered_list_item.rich_text)}\n${nested}`;
        case "quote":
          return quote([richTextToMarkdown(block.quote.rich_text), children].filter(Boolean).join("\n\n"));
        case "code":
          return `\`\`\`${block.code.language || ""}\n${extractText(
            block.code.rich_text
          )}\n\`\`\`\n\n`;
        case "divider":
          return "---\n\n";
        case "image": {
          const imageUrl =
            block.image.type === "external"
              ? block.image.external.url
              : block.image.file.url;
          const caption = extractText(block.image.caption);
          return imageUrl ? `![${caption || "image"}](${imageUrl})\n\n` : "";
        }
        case "callout": {
          const icon = block.callout.icon;
          const emoji = icon?.type === "emoji" ? icon.emoji : "Note";
          return quote([`${emoji} ${richTextToMarkdown(block.callout.rich_text)}`, children].filter(Boolean).join("\n\n"));
        }
        case "toggle":
          return `**${richTextToMarkdown(block.toggle.rich_text)}**\n\n${children ? children + "\n\n" : ""}`;
        case "column_list":
        case "column":
        case "synced_block":
          return children ? children + "\n\n" : "";
        case "table": {
          const rows = (block.children ?? []).flatMap((row) =>
            isFullBlock(row) && row.type === "table_row"
              ? [row.table_row.cells.map((cell) => richTextToMarkdown(cell).replaceAll("|", "\\|").replaceAll("\n", "<br>"))]
              : []
          );
          if (rows.length === 0) return "";
          const width = block.table.table_width;
          const header = block.table.has_column_header ? rows.shift()! : Array<string>(width).fill("");
          const render = (cells: string[]) => `| ${cells.join(" | ")} |`;
          return [render(header), render(Array<string>(width).fill("---")), ...rows.map(render)].join("\n") + "\n\n";
        }
        case "bookmark": {
          const caption = extractText(block.bookmark.caption) || block.bookmark.url;
          return `[${caption}](${block.bookmark.url})\n\n`;
        }
        default:
          return "";
      }
    })
    .join("");
}
