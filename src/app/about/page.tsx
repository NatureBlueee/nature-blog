/**
 * 关于页面
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '关于',
  description: `关于 ${siteConfig.author.name}`,
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>关于</h1>
      </header>

      <section className={styles.content}>
        <p className={styles.paragraph}>
          我是 {siteConfig.author.name}，通向惊喜创始人，研究自主智能体与 RSI。
        </p>
        <p className={styles.paragraph}>
          我自研 Flowness，探索 AI 的自主工作与自我改进。
          服务上市公司及多家年营收数亿元企业。
        </p>
        <p className={styles.paragraph}>
          这个网站是我的数字石碑，用来记录那些光怪陆离的想法和持久的美学追求。
        </p>
        <p className={styles.paragraph}>
          表世界记录理性的思考，里世界承载感性的表达。
        </p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>项目与联系</h2>
          <ul className={styles.list}>
            <li><a href={siteConfig.author.projectUrl}>Flowness 研究与实践</a> · AI 的自主工作与自我改进</li>
            <li><a href="https://github.com/Towow-ai/jpp">J++</a> · 语言与运行时实验</li>
            <li><a href="https://github.com/Towow-ai/totype">Totype</a> · 语音输入</li>
            <li><a href={siteConfig.social.github}>GitHub</a> · 项目与代码</li>
            <li><a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
