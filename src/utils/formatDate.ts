/**
 * 日期格式化工具
 */

/**
 * 格式化日期为中文友好格式
 *
 * @example
 * formatDate('2024-01-15T10:30:00Z') // '2024年1月15日'
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 格式化日期为简短格式
 *
 * @example
 * formatDateShort('2024-01-15T10:30:00Z') // '2024-01-15'
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  return date.toISOString().split('T')[0] ?? dateString;
}

/**
 * 格式化为相对时间
 *
 * @example
 * formatRelativeTime('2024-01-15T10:30:00Z') // '3 天前'
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '刚刚';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} 分钟前`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} 小时前`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} 天前`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} 个月前`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} 年前`;
}
