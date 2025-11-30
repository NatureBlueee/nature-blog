# 张晨曦的个人博客 / Nature's Personal Blog

一个融合东方美学与现代技术的个人博客，以"表里世界"为核心概念，展现理性与感性的双重视角。

## 核心设计理念

### 视觉层次

| 屏幕 | 主题 | 配色 | 内容 |
|------|------|------|------|
| 第一屏 | 表世界（理性） | 宣纸白 + 墨汁黑 | 理性文章列表 |
| 第二屏 | 里世界（感性） | 鸦青背景 + 月白文字 | 感性文章列表 |
| 第三屏 | 地界（坛城） | 暖宣纸 + 金缮 | 个人信息、生命之花 |

### 第三屏元素说明

- **名字**：中文"张晨曦" / 英文"Nature"，根据语言自动切换
- **爱字**：使用自定义 SVG，带微妙浮动动画
- **蛇杖**：双蛇缠绕，墨迹流淌效果，象征智慧与疗愈
- **生命之花**：几何图形缓慢旋转
- **散落词条**：八字布局，中英双语

```
词条翻译：
- 北京 · 大四在读 → Beijing · Senior Year
- 跨文化灵性 → Cross-cultural Spirituality
- 写作 & 视觉艺术 → Writing & Visual Arts
- 街边哲学 → Street Philosophy
```

---

## 技术架构

### 数据缓存策略

采用 **ISR (Incremental Static Regeneration) + 智能版本检测**：

```
用户访问页面
    ↓
ISR 静态页面（首屏秒开）
    ↓
VersionChecker 检测版本（<100ms）
    ↓
┌─────────────────┬─────────────────┐
│ 版本没变         │ 版本变了         │
│ ↓               │ ↓               │
│ 什么都不做       │ router.refresh()│
│                 │ 重新获取数据      │
└─────────────────┴─────────────────┘
```

#### ISR 配置

| 页面 | revalidate 时间 |
|------|-----------------|
| 首页 | 3600s (1小时) |
| 文章详情页 | 86400s (24小时) |

#### 版本检测机制

- **检测目标**：Notion 数据库的 `last_edited_time`
- **检测时机**：每次页面加载
- **存储位置**：localStorage
- **触发刷新**：版本号变化时调用 `router.refresh()`

#### 效果对比

| 场景 | 优化前 | 优化后 |
|------|--------|--------|
| 首次访问 | 3-4秒 | 静态页面秒开 |
| 再次访问（无更新） | 3-4秒 | <100ms |
| 再次访问（有更新） | 3-4秒 | 自动刷新 |
| 发布新文章后 | - | 无需操作，自动检测 |

---

### 多语言支持

采用 **独立 Page 关联** 方案：

#### Notion 数据库结构

| 属性 | 类型 | 用途 |
|------|------|------|
| 标题 | Title | 文章标题 |
| 语言 | Select | `zh` / `en` |
| 摘要 | Text | 当前语言的摘要 |
| 关联文章 | Relation | 指向其他语言版本 |
| 主文章 | Checkbox | 是否为主版本 |

#### 前端实现

- **LanguageContext**：全局语言状态管理
- **localStorage 持久化**：记住用户语言偏好
- **浏览器语言检测**：首次访问自动判断

---

### 文章列表交互

#### 展开逻辑

1. 点击任意文章标题 → 列表展开
2. **被点击的文章**：完整显示摘要 + "阅读全文"按钮
3. **其他文章**：显示一行虚化预览（带渐变遮罩）
4. 再次点击已展开的标题 → 跳转详情页
5. 点击左侧空白区域 → 收起展开

#### 动画特点

- 收起/展开同步进行，不等待
- 使用 `cubic-bezier(0.22, 1, 0.36, 1)` 缓动函数
- 虚化预览：`blur(0.5px)` + 右侧渐变遮罩

---

## 项目结构

```
src/
├── app/
│   ├── api/version/        # 版本检测 API
│   ├── posts/[id]/         # 文章详情页
│   └── page.tsx            # 首页
├── components/
│   ├── common/             # 通用组件
│   │   ├── VersionChecker  # 版本检测
│   │   └── LanguageSwitch  # 语言切换
│   ├── screens/            # 屏幕组件
│   │   ├── SurfaceScreen   # 表世界
│   │   ├── InnerScreen     # 里世界
│   │   └── GroundScreen    # 地界
│   └── article/            # 文章相关
├── contexts/               # React Context
├── hooks/                  # 自定义 Hooks
└── services/notion/        # Notion API 服务
```

---

## 开发指南

### 环境变量

```env
NOTION_TOKEN=your-notion-integration-token
NOTION_DATABASE_ID=your-database-id
```

### 启动开发服务器

```bash
npm run dev
```

### 部署

推荐使用 Vercel，支持 ISR 和自动部署。

---

## 设计参考

- **美学 DNA**：详见 `AESTHETIC_DNA.md`
- **美学优化提案**：详见 `AESTHETIC_OPTIMIZATION_PROPOSAL.md`

---

## 作者

**张晨曦 / Nature**

- Email: hi@natureblueee.com
- Website: [wowok.net](https://wowok.net)
