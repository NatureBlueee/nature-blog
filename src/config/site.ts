/**
 * 站点配置
 *
 * 集中管理站点的基本信息，修改配置只需改这一个文件
 */

import { publicEnv } from '@/utils/env';

export const siteConfig = {
  /** 站点名称 */
  name: 'natureblueee',

  /** 站点描述 - 用于 SEO 和社交分享 */
  description: '思想的数字石碑 - 一个记录光怪陆离想法与持久美学追求的空间',

  /** 站点 URL (部署后更新) */
  url: publicEnv.NEXT_PUBLIC_SITE_URL,

  /** 作者信息 */
  author: {
    name: 'Natureblueee',
    handle: 'Natureblueee',
  },

  /** 社交链接 (可选扩展) */
  social: {
    // twitter: '',
    // github: '',
  },

  /** 导航链接 */
  nav: [
    { label: '首页', href: '/' },
    { label: '文章', href: '/posts' },
    { label: '关于', href: '/about' },
  ],

  /** 每页文章数量 */
  postsPerPage: 10,
} as const;

export type SiteConfig = typeof siteConfig;
