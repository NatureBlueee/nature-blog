/**
 * 私印组件 - Nature
 *
 * 文章末尾的个人印章
 * 点击可以写信（mailto）
 */

import styles from './styles.module.css';

export function NatureSeal() {
  const email = 'hello@natureblueee.com'; // 可以改成实际邮箱

  return (
    <a
      href={`mailto:${email}?subject=来自博客的信`}
      className={styles.seal}
      title="写一封信"
    >
      <svg
        viewBox="0 0 80 80"
        className={styles.sealSvg}
        aria-label="Nature 私印"
      >
        {/* 印章外框 - 圆角方形 */}
        <rect
          x="4"
          y="4"
          width="72"
          height="72"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Nature 文字 - 竖排风格化 */}
        <text
          x="40"
          y="44"
          textAnchor="middle"
          dominantBaseline="middle"
          className={styles.sealText}
        >
          Nature
        </text>

        {/* 装饰线 */}
        <line x1="20" y1="64" x2="60" y2="64" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    </a>
  );
}
