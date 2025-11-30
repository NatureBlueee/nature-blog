/**
 * Footer 组件
 *
 * 职责：网站底部信息
 */

import { siteConfig } from '@/config/site';
import type { FooterProps } from '../types';
import styles from './styles.module.css';

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          &copy; {currentYear} {siteConfig.author.name}
        </p>
        <p className={styles.powered}>
          内容管理：Notion
        </p>
      </div>
    </footer>
  );
}
