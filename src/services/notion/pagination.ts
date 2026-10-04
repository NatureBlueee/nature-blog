/** Collect every batch without losing Notion's ordering. */
export async function collectPages<T>(
  fetchPage: (cursor?: string) => Promise<{
    results: T[];
    has_more: boolean;
    next_cursor: string | null;
  }>
): Promise<T[]> {
  const results: T[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await fetchPage(cursor);
    results.push(...page.results);
    if (!page.has_more) return results;
    if (!page.next_cursor || seen.has(page.next_cursor)) {
      throw new Error("Notion returned an invalid pagination cursor");
    }
    cursor = page.next_cursor;
    seen.add(cursor);
  } while (cursor);
  return results;
}
