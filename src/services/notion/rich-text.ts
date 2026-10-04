import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export function extractText(richText: RichTextItemResponse[] | undefined): string {
  if (!richText) return "";
  return richText.map((item) => item.plain_text || "").join("");
}

export function richTextToMarkdown(
  richText: RichTextItemResponse[] | undefined
): string {
  if (!richText) return "";

  return richText
    .map((item) => {
      let text = item.plain_text || "";
      if (!text) return "";

      const annotations = item.annotations || {};

      if (annotations.code) {
        return `\`${text}\``;
      }

      if (item.href) {
        text = `[${text}](${item.href})`;
      }

      if (annotations.bold) {
        text = `**${text}**`;
      }

      if (annotations.italic) {
        text = `*${text}*`;
      }

      if (annotations.strikethrough) {
        text = `~~${text}~~`;
      }

      if (annotations.underline) {
        text = `<u>${text}</u>`;
      }

      return text;
    })
    .join("");
}
