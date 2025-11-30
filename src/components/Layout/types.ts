/**
 * Layout 组件类型定义
 */

import type { ReactNode } from 'react';

export interface LayoutProps {
  /** 页面内容 */
  children: ReactNode;
  /** 自定义 className */
  className?: string;
}

export interface HeaderProps {
  /** 自定义 className */
  className?: string;
}

export interface FooterProps {
  /** 自定义 className */
  className?: string;
}

export interface NavItem {
  label: string;
  href: string;
}
