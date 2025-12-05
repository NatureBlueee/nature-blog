/**
 * llms.txt 路由
 *
 * 为 AI 爬虫提供网站信息的专用端点
 * 类似于 robots.txt，但专门面向 AI 理解
 *
 * 路径: /llms.txt
 *
 * 这是一个新兴的标准，被 ChatGPT、Claude、Perplexity 等 AI 采用
 */

import { generateLlmsTxt, defaultLlmsTxtConfig } from '@/lib/seo/geo';

/**
 * 缓存策略：每天重新验证
 * AI 爬虫通常不需要实时更新
 */
export const revalidate = 86400;

export async function GET() {
  const content = generateLlmsTxt(defaultLlmsTxtConfig);

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      // 告诉 AI 爬虫这是专门为它们准备的
      'X-Robots-Tag': 'all',
    },
  });
}
