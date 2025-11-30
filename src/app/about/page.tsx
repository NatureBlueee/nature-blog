/**
 * 关于页面
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '关于',
  description: `关于 ${siteConfig.author.name}`,
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>关于</h1>
      </header>

      <section className={styles.content}>
        <p className={styles.paragraph}>
          我是 {siteConfig.author.name}。
        </p>
        <p className={styles.paragraph}>
          这个网站是我的数字石碑，用来记录那些光怪陆离的想法和持久的美学追求。
        </p>
        <p className={styles.paragraph}>
          表世界记录理性的思考，里世界承载感性的表达。
        </p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>技术栈</h2>
          <ul className={styles.list}>
            <li>内容管理：Notion</li>
            <li>前端框架：Next.js 16</li>
            <li>部署平台：Vercel</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
