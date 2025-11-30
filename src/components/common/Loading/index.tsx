/**
 * Loading 组件 - 占位符实现
 *
 * 职责：展示加载状态
 * 状态：占位符，基础结构
 */

import styles from './styles.module.css';

export interface LoadingProps {
  /** 加载提示文字 */
  text?: string;
  /** 自定义 className */
  className?: string;
}

export function Loading({ text = '加载中...', className = '' }: LoadingProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
