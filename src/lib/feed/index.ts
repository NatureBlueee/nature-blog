/**
 * Feed 模块统一导出
 *
 * 提供 RSS/Atom/JSON Feed 生成功能
 */

// 配置
export { feedConfig } from './config';
export type { FeedConfig } from './config';

// 生成器
export {
  generateFeed,
  generateRSS,
  generateAtom,
  generateJSON,
} from './generator';
