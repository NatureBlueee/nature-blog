/**
 * RSS 2.0 Feed 路由
 *
 * 生成标准的 RSS 2.0 格式订阅源
 * 路径: /feed.xml
 *
 * GEO 优化：RSS Feed 是 AI 爬虫获取内容的重要入口
 */

import { generateRSS } from '@/lib/feed';

/**
 * 缓存策略：每小时重新验证
 * 与首页 ISR 策略保持一致
 */
export const revalidate = 3600;

export async function GET() {
  try {
    const rss = await generateRSS();

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('[Feed] RSS generation failed:', error);
    return new Response('RSS generation failed', { status: 500 });
  }
}
