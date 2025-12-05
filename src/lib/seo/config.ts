/**
 * SEO 配置
 *
 * 集中管理所有 SEO 相关配置
 * 使用宋代美学配色方案
 */

import type { SEOConfig } from './types';

/**
 * SEO 配置
 *
 * 配色说明（来自 AESTHETIC_DNA.md）：
 * - 宣纸白 (Rice Paper): #F5F5F5 - 带有温度的白，作为背景底色
 * - 焦墨 (Burnt Ink): #1A1A1A - 深沉、有力，用于主体结构和文字
 * - 泥金 (Gold Mud): #C5A059 - 暗哑、内敛的高贵，用于点睛
 */
export const seoConfig: SEOConfig = {
  siteName: 'natureblueee',
  siteDescription: '思想的数字石碑 - 一个记录光怪陆离想法与持久美学追求的空间',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://natureblueee.com',
  defaultLocale: 'zh-CN',
  author: {
    name: 'Natureblueee',
    url: 'https://wowok.net',
  },
  ogImage: {
    width: 1200,
    height: 630,
    backgroundColor: '#F5F5F5', // 宣纸白
    textColor: '#1A1A1A',       // 焦墨
    accentColor: '#C5A059',     // 泥金
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    bing: process.env.BING_SITE_VERIFICATION,
  },
};
