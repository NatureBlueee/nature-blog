/**
 * JSON Feed 1.1 路由
 *
 * 生成 JSON Feed 1.1 格式订阅源
 * 路径: /feed.json
 *
 * JSON Feed 是现代的 Feed 格式，对开发者友好
 * 特别适合 AI 和程序化读取
 */

import { generateJSON } from '@/lib/feed';

/**
 * 缓存策略：每小时重新验证
 */
export const revalidate = 3600;

export async function GET() {
  try {
    const json = await generateJSON();

    return new Response(json, {
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('[Feed] JSON Feed generation failed:', error);
    return new Response('JSON Feed generation failed', { status: 500 });
  }
}
