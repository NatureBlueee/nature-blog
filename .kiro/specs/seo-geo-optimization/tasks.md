# Implementation Plan

## SEO/GEO 优化方案实施任务

- [x] 1. 创建 SEO 基础设施

  - [x] 1.1 安装 schema-dts 依赖

    - 运行 `npm install schema-dts`
    - 确认依赖安装成功
    - _Requirements: 2, 13_

  - [x] 1.2 创建 SEO 目录结构和类型定义

    - 创建 `src/lib/seo/` 目录
    - 创建 `src/lib/seo/types.ts` 定义 SEOConfig、AuthorInfo、OGImageConfig 等类型
    - _Requirements: 12_

  - [x] 1.3 创建 SEO 配置文件

    - 创建 `src/lib/seo/config.ts`
    - 配置站点名称、描述、URL、作者信息
    - 配置 OG 图片颜色（宣纸白、焦墨、泥金）
    - 配置站点验证环境变量读取
    - _Requirements: 10_

  - [x] 1.4 创建 SEO 统一导出

    - 创建 `src/lib/seo/index.ts`
    - 导出所有 SEO 相关函数和类型
    - _Requirements: 12_

- [x] 2. 实现元数据生成工具

  - [x] 2.1 创建元数据生成函数

    - 创建 `src/lib/seo/metadata.ts`
    - 实现 `generateArticleMetadata()` 函数
    - 实现 `generatePageMetadata()` 函数
    - 确保生成 canonical URL、Open Graph、Twitter Card 标签
    - _Requirements: 1, 8_

- [x] 3. 实现结构化数据生成

  - [x] 3.1 创建 JSON-LD 生成函数

    - 创建 `src/lib/seo/structured-data.ts`
    - 实现 `generateWebSiteSchema()` 函数
    - 实现 `generatePersonSchema()` 函数
    - 实现 `generateArticleSchema()` 函数
    - 创建 `JsonLd` React 组件用于输出 JSON-LD
    - _Requirements: 2_

- [x] 4. 实现站点地图生成

  - [x] 4.1 创建 sitemap.ts

    - 创建 `src/app/sitemap.ts`
    - 实现静态页面（首页、关于页）的 sitemap 条目
    - 实现动态文章页面的 sitemap 条目
    - 添加 try-catch 错误处理
    - _Requirements: 3, 11_

- [x] 5. 实现 robots.txt 生成

  - [x] 5.1 创建 robots.ts

    - 创建 `src/app/robots.ts`
    - 配置允许所有搜索引擎爬虫访问
    - 明确允许 AI 爬虫（GPTBot、ClaudeBot、PerplexityBot、Google-Extended）
    - 禁止访问 /api/ 和 /\_next/
    - 添加 sitemap 位置
    - _Requirements: 4_

- [x] 6. 实现动态 OG 图片生成

  - [x] 6.1 创建 OG 图片 API 路由

    - 创建 `src/app/og/route.tsx`
    - 实现字体加载函数（fetch Noto Serif SC woff2）
    - 实现 ImageResponse 渲染逻辑
    - 应用宋代美学设计（宣纸白背景、焦墨文字、泥金装饰线）
    - 配置 Edge Runtime
    - _Requirements: 7_

- [x] 7. 更新根布局配置

  - [x] 7.1 修改 layout.tsx 添加 metadataBase

    - 在 `src/app/layout.tsx` 中添加 `metadataBase` 配置
    - 添加站点验证 meta 标签（Google、Bing）
    - 更新 metadata 使用新的 seoConfig
    - _Requirements: 9, 10_

- [x] 8. 更新文章详情页

  - [x] 8.1 集成 SEO 元数据生成

    - 修改 `src/app/posts/[id]/page.tsx`
    - 使用 `generateArticleMetadata()` 替换现有 generateMetadata
    - 添加 JSON-LD 结构化数据输出
    - _Requirements: 1, 2, 6_

- [x] 9. 更新首页

  - [x] 9.1 添加首页结构化数据

    - 修改 `src/app/page.tsx`
    - 添加 WebSite 和 Person JSON-LD 结构化数据
    - _Requirements: 2_

- [x] 10. 更新环境变量配置

  - [x] 10.1 更新 .env.local 示例

    - 确保 NEXT_PUBLIC_SITE_URL 已配置
    - 添加 GOOGLE_SITE_VERIFICATION 占位
    - 添加 BING_SITE_VERIFICATION 占位
    - _Requirements: 9, 10_

- [x] 11. 验证和测试

  - [x] 11.1 本地验证 SEO 输出

    - 运行开发服务器 ✅
    - 访问 /sitemap.xml 验证格式 ✅
    - 访问 /robots.txt 验证内容 ✅
    - 访问 /og?title=测试标题 验证图片生成 ✅ (修复了 woff2 兼容性问题)
    - 检查页面源码中的 meta 标签和 JSON-LD ✅
    - _Requirements: 11_
