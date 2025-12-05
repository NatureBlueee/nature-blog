/**
 * Atom 1.0 Feed 路由
 *
 * 生成标准的 Atom 1.0 格式订阅源
 * 路径: /atom.xml
 *
 * Atom 相比 RSS 有更好的国际化支持
 */

import { generateAtom } from '@/lib/feed';

/**
 * 缓存策略：每小时重新验证
 */
export const revalidate = 3600;

export async function GET() {
  try {
    const atom = await generateAtom();

    return new Response(atom, {
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('[Feed] Atom generation failed:', error);
    return new Response('Atom generation failed', { status: 500 });
  }
}
