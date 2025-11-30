/**
 * 服务层统一导出
 *
 * 数据源：Notion Database
 */

export {
  getArticles,
  getArticlesByCategory,
  getArticleById,
  getArticleByIdAndLanguage,
  getRelatedArticle,
  getAllArticleIds,
  type Article,
} from './notion';
