/**
 * 404 页面
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '页面未找到',
  description: '您访问的页面不存在',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Noto Serif SC", serif',
      backgroundColor: '#F5F5F3',
      color: '#2B2B2B',
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 300 }}>404</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.7 }}>
        页面已消散于虚空
      </p>
      <Link
        href="/"
        style={{
          color: '#B03A2E',
          textDecoration: 'none',
          borderBottom: '1px solid #B03A2E',
          paddingBottom: '2px',
        }}
      >
        返回首页
      </Link>
    </div>
  );
}
