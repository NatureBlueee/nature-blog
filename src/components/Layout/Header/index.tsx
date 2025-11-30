/**
 * Header 组件 - 占位符实现
 *
 * 职责：网站顶部导航
 * 状态：占位符，基础结构
 */

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import type { HeaderProps } from '../types';
import styles from './styles.module.css';

export function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.container}>
        {/* Logo / 站点名称 */}
        <Link href="/" className={styles.logo}>
          {siteConfig.name}
        </Link>

        {/* 导航 */}
        <nav className={styles.nav}>
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
