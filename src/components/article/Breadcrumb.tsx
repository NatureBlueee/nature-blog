/**
 * 面包屑导航
 *
 * 简洁的返回路径，符合温润美学
 */

import Link from 'next/link';
import styles from './styles.module.css';

export function Breadcrumb() {
  return (
    <nav className={styles.breadcrumb} aria-label="返回导航">
      <Link href="/" className={styles.breadcrumbLink}>
        ←
      </Link>
    </nav>
  );
}
