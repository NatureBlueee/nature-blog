/**
 * Layout 组件 - 占位符实现
 *
 * 职责：页面整体布局（Header + Content + Footer）
 * 状态：占位符，基础结构
 */

import { Header } from './Header';
import { Footer } from './Footer';
import type { LayoutProps } from './types';
import styles from './styles.module.css';

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className={`${styles.layout} ${className}`}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}

// 导出子组件供单独使用
export { Header } from './Header';
export { Footer } from './Footer';
export type { LayoutProps, HeaderProps, FooterProps } from './types';
