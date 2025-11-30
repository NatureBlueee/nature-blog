# 表世界 (Surface Screen) 审美优化实施计划

## 目标
深化“表世界（理性）”的“宋代美学 x 瑞士主义”特质。
通过微妙的细节创造深度：“不可见之网”、“金石气排印”和“朱砂呼吸”。

## 需要用户审查
> [!NOTE]
> 网格将非常微弱（3% 不透明度），作为潜意识的结构支撑，而非显眼的视觉图案。

## 拟议变更

### 样式 (`src/app/globals.css`)

#### [MODIFY] [globals.css](file:///d:/Profolio/-/personal-blog/src/app/globals.css)
*   **添加网格图案**: 创建 `.bg-grid-pattern` 工具类，使用 `linear-gradient` 绘制 40px 的精细网格。
*   **添加排印风格**: 创建 `.text-architectural` 类，增加 `letter-spacing` 并添加模拟墨晕的 `text-shadow`。
*   **添加动画**: 定义 `@keyframes pulse-cinnabar` 用于朱砂红条的呼吸效果。

### 组件 (`src/components/screens/SurfaceScreen.tsx`)

#### [MODIFY] [SurfaceScreen.tsx](file:///d:/Profolio/-/personal-blog/src/components/screens/SurfaceScreen.tsx)
*   **应用网格**: 将网格类添加到左侧的 `<aside className="void-area">`。
*   **应用排印**: 更新 Logo 和签名区块，使用新的金石气排印风格。
*   **应用动画**: 将呼吸动画类添加到 `.divider-accent`。

## 验证计划

### 人工验证
*   **网格可见性**: 检查左侧留白区的网格是否可见但不过分抢眼。
*   **排印质感**: 验证竖排文字是否更具“碑刻感”和微妙的墨晕效果。
*   **动画效果**: 确认红线是否在进行极慢速的呼吸（4秒周期）。
