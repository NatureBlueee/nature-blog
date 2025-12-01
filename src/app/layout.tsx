/**
 * 根布局组件
 *
 * 极简布局，首页使用全屏双屏设计
 * SEO: 配置 metadataBase 和站点验证
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { seoConfig } from '@/lib/seo';
import { Providers } from '@/components/providers';
import './globals.css';

/**
 * 站点元数据
 *
 * metadataBase 是解决 OG 图片路径警告的必要配置
 * verification 支持 Google/Bing 站点验证
 */
export const metadata: Metadata = {
  // 关键：设置 metadataBase 以正确解析相对路径
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: `${siteConfig.name} | 晨曦`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // 站点验证（从环境变量读取）
  verification: {
    google: seoConfig.verification?.google,
    other: seoConfig.verification?.bing
      ? { 'msvalidate.01': seoConfig.verification.bing }
      : undefined,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* Google Fonts - 思源宋体 + JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=JetBrains+Mono:wght@300;400&family=Noto+Serif+SC:wght@200;300;400;500;600&family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&family=Liu+Jian+Mao+Cao&family=Long+Cang&family=ZCOOL+QingKe+HuangYou&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
