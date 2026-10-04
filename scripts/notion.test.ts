import assert from "node:assert/strict";
import test from "node:test";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { collectPages } from "../src/services/notion/pagination";
import { isPublishedArticle } from "../src/services/notion/visibility";
import { blocksToMarkdown, loadBlockChildren, type NotionBlock } from "../src/services/notion/blocks";

test("collects articles or blocks beyond the first batch in order", async () => {
  const calls: (string | undefined)[] = [];
  const result = await collectPages(async (cursor) => {
    calls.push(cursor);
    return cursor
      ? { results: [101, 102], has_more: false, next_cursor: null }
      : { results: Array.from({ length: 100 }, (_, i) => i + 1), has_more: true, next_cursor: "second" };
  });
  assert.deepEqual(calls, [undefined, "second"]);
  assert.equal(result.length, 102);
  assert.deepEqual(result.slice(-3), [100, 101, 102]);
});

test("fails explicitly on invalid cursors and upstream errors", async () => {
  await assert.rejects(collectPages(async () => ({ results: [], has_more: true, next_cursor: null })));
  await assert.rejects(collectPages(async () => ({ results: [], has_more: true, next_cursor: "same" })));
  await assert.rejects(collectPages(async () => { throw new Error("upstream unavailable"); }), /upstream unavailable/);
});

const databaseId = "01234567-89ab-cdef-0123-456789abcdef";
function page(overrides: Record<string, unknown> = {}): PageObjectResponse {
  return {
    object: "page",
    id: "article-id",
    icon: null,
    cover: null,
    created_by: { object: "user", id: "author" },
    last_edited_by: { object: "user", id: "author" },
    created_time: "2026-10-04T00:00:00.000Z",
    last_edited_time: "2026-10-04T00:00:00.000Z",
    url: "https://www.notion.so/article-id",
    public_url: null,
    parent: { type: "database_id", database_id: databaseId },
    archived: false,
    in_trash: false,
    properties: { "状态": { id: "status", type: "select", select: { id: "published", name: "已发布", color: "green" } } },
    ...overrides,
  } as PageObjectResponse;
}

test("allows only published pages from the configured database", () => {
  assert.equal(isPublishedArticle(page(), databaseId.replaceAll("-", "")), true);
  for (const invalid of [
    page({ archived: true }),
    page({ in_trash: true }),
    page({ parent: { type: "page_id", page_id: databaseId } }),
    page({ parent: { type: "database_id", database_id: "other" } }),
    page({ properties: {} }),
    page({ properties: { "状态": { type: "select", select: { name: "草稿" } } } }),
  ]) assert.equal(isPublishedArticle(invalid, databaseId), false);
});

function block(value: Record<string, unknown>): NotionBlock {
  return { object: "block", has_children: false, ...value } as unknown as NotionBlock;
}
function text(content: string) {
  return [{ type: "text", text: { content, link: null }, plain_text: content, href: null,
    annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" } }];
}

test("renders nested callout content and complete tables across batches", async () => {
  const calls: string[] = [];
  const tree = await loadBlockChildren("article", async (id, cursor) => {
    calls.push(`${id}:${cursor ?? "first"}`);
    const results = id === "article" ? [
      block({ id: "note", type: "callout", has_children: true, callout: { icon: null, rich_text: text("Summary") } }),
      block({ id: "table", type: "table", has_children: true, table: { table_width: 2, has_column_header: true } }),
    ] : id === "note" ? [block({ id: "body", type: "paragraph", paragraph: { rich_text: text("Nested body") } })]
      : cursor ? [block({ id: "row2", type: "table_row", table_row: { cells: [text("B|C"), text("value")] } })]
      : [block({ id: "row1", type: "table_row", table_row: { cells: [text("Name"), text("Description")] } })];
    return { results, has_more: id === "table" && !cursor, next_cursor: id === "table" && !cursor ? "second" : null };
  });
  const markdown = blocksToMarkdown(tree);
  assert.match(markdown, /> Nested body/);
  assert.match(markdown, /\| Name \| Description \|\n\| --- \| --- \|/);
  assert.ok(markdown.includes("| B\\|C | value |"));
  assert.deepEqual(calls, ["article:first", "note:first", "table:first", "table:second"]);
});

test("does not traverse unpublished child pages or child databases", async () => {
  const tree = await loadBlockChildren("article", async (id) => {
    assert.equal(id, "article");
    return { results: [block({ id: "private", type: "child_page", has_children: true })], has_more: false, next_cursor: null };
  });
  assert.equal(blocksToMarkdown(tree), "");
});
