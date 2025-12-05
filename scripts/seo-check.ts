#!/usr/bin/env npx tsx
/**
 * SEO 健康检查脚本
 *
 * 检查项目的 SEO 配置完整性和最佳实践
 *
 * 使用方式：
 * - npm run seo:check
 * - npx tsx scripts/seo-check.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  title: (msg: string) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
  dim: (msg: string) => console.log(`${colors.dim}  ${msg}${colors.reset}`),
};

interface CheckResult {
  passed: boolean;
  message: string;
  details?: string;
}

interface CheckCategory {
  name: string;
  checks: CheckResult[];
}

const results: CheckCategory[] = [];
let currentCategory: CheckCategory | null = null;

function startCategory(name: string) {
  currentCategory = { name, checks: [] };
  results.push(currentCategory);
  log.title(`[ ${name} ]`);
}

function addCheck(result: CheckResult) {
  if (currentCategory) {
    currentCategory.checks.push(result);
  }
  if (result.passed) {
    log.success(result.message);
  } else {
    log.error(result.message);
  }
  if (result.details) {
    log.dim(result.details);
  }
}

// ============ 检查函数 ============

function checkFileExists(filePath: string, description: string): boolean {
  const exists = fs.existsSync(filePath);
  addCheck({
    passed: exists,
    message: `${description}`,
    details: exists ? filePath : `缺失: ${filePath}`,
  });
  return exists;
}

function checkFileContains(
  filePath: string,
  patterns: string[],
  description: string
): boolean {
  if (!fs.existsSync(filePath)) {
    addCheck({
      passed: false,
      message: description,
      details: `文件不存在: ${filePath}`,
    });
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const missing = patterns.filter((p) => !content.includes(p));

  if (missing.length === 0) {
    addCheck({
      passed: true,
      message: description,
    });
    return true;
  } else {
    addCheck({
      passed: false,
      message: description,
      details: `缺失: ${missing.join(', ')}`,
    });
    return false;
  }
}

function checkEnvVar(varName: string, description: string): boolean {
  // 检查 .env.example 或 .env.local 中是否有定义
  const envFiles = ['.env.example', '.env.local', '.env'];
  let found = false;

  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      if (content.includes(varName)) {
        found = true;
        break;
      }
    }
  }

  addCheck({
    passed: found,
    message: `环境变量 ${varName} ${description}`,
    details: found ? undefined : '建议在 .env.example 中添加示例',
  });
  return found;
}

// ============ 主检查逻辑 ============

async function runChecks() {
  console.log('\n🔍 SEO 健康检查');
  console.log('═'.repeat(50));

  const srcDir = path.join(process.cwd(), 'src');
  const appDir = path.join(srcDir, 'app');
  const libDir = path.join(srcDir, 'lib');

  // 1. 核心 SEO 文件检查
  startCategory('核心 SEO 文件');

  checkFileExists(
    path.join(appDir, 'robots.ts'),
    'robots.txt 生成文件'
  );

  checkFileExists(
    path.join(appDir, 'sitemap.ts'),
    'sitemap.xml 生成文件'
  );

  checkFileExists(
    path.join(appDir, 'layout.tsx'),
    '根布局文件 (metadata 配置)'
  );

  checkFileExists(
    path.join(libDir, 'seo', 'config.ts'),
    'SEO 配置文件'
  );

  checkFileExists(
    path.join(libDir, 'seo', 'metadata.ts'),
    '元数据生成工具'
  );

  checkFileExists(
    path.join(libDir, 'seo', 'structured-data.tsx'),
    '结构化数据生成工具'
  );

  // 2. Feed 文件检查
  startCategory('RSS/Atom/JSON Feed');

  checkFileExists(
    path.join(appDir, 'feed.xml', 'route.ts'),
    'RSS 2.0 Feed'
  );

  checkFileExists(
    path.join(appDir, 'atom.xml', 'route.ts'),
    'Atom 1.0 Feed'
  );

  checkFileExists(
    path.join(appDir, 'feed.json', 'route.ts'),
    'JSON Feed 1.1'
  );

  // 3. GEO 优化检查
  startCategory('GEO (AI 爬虫优化)');

  checkFileExists(
    path.join(appDir, 'llms.txt', 'route.ts'),
    'llms.txt AI 说明文件'
  );

  // 检查 robots.ts 中是否包含 AI 爬虫规则
  const robotsPath = path.join(appDir, 'robots.ts');
  if (fs.existsSync(robotsPath)) {
    checkFileContains(
      robotsPath,
      ['GPTBot', 'ClaudeBot'],
      'robots.txt 包含 AI 爬虫规则'
    );
  }

  // 4. 元数据配置检查
  startCategory('元数据配置');

  const seoConfigPath = path.join(libDir, 'seo', 'config.ts');
  if (fs.existsSync(seoConfigPath)) {
    checkFileContains(
      seoConfigPath,
      ['siteName', 'siteDescription', 'siteUrl', 'author'],
      'SEO 配置完整性'
    );
  }

  const layoutPath = path.join(appDir, 'layout.tsx');
  if (fs.existsSync(layoutPath)) {
    checkFileContains(
      layoutPath,
      ['metadataBase', 'title', 'description'],
      '根布局元数据配置'
    );
  }

  // 5. 结构化数据检查
  startCategory('结构化数据 (JSON-LD)');

  const structuredDataPath = path.join(libDir, 'seo', 'structured-data.tsx');
  if (fs.existsSync(structuredDataPath)) {
    checkFileContains(
      structuredDataPath,
      ['WebSite', 'Person', 'Blog', 'BlogPosting', 'BreadcrumbList'],
      'Schema 类型完整性'
    );
  }

  // 6. 多语言 SEO 检查
  startCategory('多语言 SEO');

  checkFileExists(
    path.join(libDir, 'seo', 'i18n.ts'),
    'hreflang 工具文件'
  );

  const i18nPath = path.join(libDir, 'seo', 'i18n.ts');
  if (fs.existsSync(i18nPath)) {
    checkFileContains(
      i18nPath,
      ['hreflang', 'x-default'],
      'hreflang 标签支持'
    );
  }

  // 7. 环境变量检查
  startCategory('环境变量');

  checkEnvVar('NEXT_PUBLIC_SITE_URL', '(站点 URL)');
  checkEnvVar('GOOGLE_SITE_VERIFICATION', '(Google 验证)');

  // 8. OG 图片检查
  startCategory('社交分享 (OG 图片)');

  checkFileExists(
    path.join(appDir, 'og', 'route.tsx'),
    '动态 OG 图片生成'
  );

  // ============ 总结 ============

  console.log('\n' + '═'.repeat(50));
  log.title('检查结果摘要');

  let totalPassed = 0;
  let totalFailed = 0;

  for (const category of results) {
    const passed = category.checks.filter((c) => c.passed).length;
    const failed = category.checks.filter((c) => !c.passed).length;
    totalPassed += passed;
    totalFailed += failed;

    if (failed > 0) {
      log.warn(`${category.name}: ${passed}/${category.checks.length} 通过`);
    } else {
      log.success(`${category.name}: ${passed}/${category.checks.length} 通过`);
    }
  }

  console.log('\n' + '─'.repeat(50));

  const total = totalPassed + totalFailed;
  const percentage = Math.round((totalPassed / total) * 100);

  if (totalFailed === 0) {
    log.success(`🎉 所有 ${total} 项检查通过！SEO 配置完善。`);
  } else {
    log.warn(`${totalPassed}/${total} 项通过 (${percentage}%)`);
    log.info(`有 ${totalFailed} 项需要关注，请查看上方详情。`);
  }

  console.log('');

  // 返回非零退出码如果有失败
  process.exit(totalFailed > 0 ? 1 : 0);
}

// 运行检查
runChecks().catch((error) => {
  console.error('检查过程出错:', error);
  process.exit(1);
});
