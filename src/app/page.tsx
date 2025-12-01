/**
 * 首页 - 双屏布局
 *
 * 第一屏：表世界（理性）
 * 第二屏：里世界（感性）
 *
 * SEO/GEO 优化：
 * - 输出 WebSite 和 Person JSON-LD 结构化数据
 * - 帮助搜索引擎和 AI 理解网站信息
 *
 * 使用 ISR 静态生成，每小时自动刷新
 * 配合 VersionChecker 实现智能更新检测
 */

import { getArticlesByCategory } from "@/services/notion";
import type { Article } from "@/services/notion";
import { SurfaceScreen } from "@/components/screens/SurfaceScreen";
import { InnerScreen } from "@/components/screens/InnerScreen";
import { GroundScreen } from "@/components/screens/GroundScreen";
import { CustomCursor } from "@/components/common/CustomCursor";
import { GrainTexture } from "@/components/common/GrainTexture";
import { SmokeFilters } from "@/components/common/SmokeFilters";
import { VersionChecker } from "@/components/common/VersionChecker";
import {
  generateWebSiteSchema,
  generatePersonSchema,
  JsonLd,
} from "@/lib/seo";

// ISR: 每 3600 秒（1小时）后台刷新
export const revalidate = 3600;

export default async function HomePage() {
  // 从 Notion 获取文章（按类型分类）
  // 如果 API 调用失败，使用空数组作为 fallback
  let rationalArticles: Article[] = [];
  let emotionalArticles: Article[] = [];

  try {
    [rationalArticles, emotionalArticles] = await Promise.all([
      getArticlesByCategory("理性"),
      getArticlesByCategory("感性"),
    ]);
  } catch (error) {
    console.error("[HomePage] Failed to fetch articles:", error);
    // 继续渲染，但显示空列表
  }

  // 生成结构化数据
  const webSiteSchema = generateWebSiteSchema();
  const personSchema = generatePersonSchema();

  return (
    <>
      {/* JSON-LD 结构化数据 - 帮助搜索引擎和 AI 理解网站信息 */}
      <JsonLd data={webSiteSchema} />
      <JsonLd data={personSchema} />

      {/* 版本检测：自动检测 Notion 是否有更新 */}
      <VersionChecker />

      {/* SVG Filters for Smoke Effects */}
      <SmokeFilters />

      {/* 全局效果 */}
      <GrainTexture />
      <CustomCursor />

      {/* 双屏滚动容器 */}
      <div className="snap-container">
        {/* 第一屏：表世界 (理性) */}
        <SurfaceScreen articles={rationalArticles} />

        {/* 第二屏：里世界 (感性) */}
        <InnerScreen articles={emotionalArticles} />

        {/* 第三屏：地界 (坛城) */}
        <GroundScreen />
      </div>
    </>
  );
}
