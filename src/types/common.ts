/**
 * 通用类型定义
 */

/**
 * 分页信息
 */
export interface Pagination {
  /** 当前页码 (从 1 开始) */
  currentPage: number;
  /** 每页数量 */
  pageSize: number;
  /** 总条目数 */
  totalCount: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNextPage: boolean;
  /** 是否有上一页 */
  hasPrevPage: boolean;
}

/**
 * 分页响应包装
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * API 错误类型
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * 加载状态
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * 异步数据状态
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * 站点作者信息
 */
export interface Author {
  name: string;
  bio?: string;
  avatar?: string;
}
