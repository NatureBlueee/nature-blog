/**
 * 地界（坛城）- 第三屏
 *
 * 核心美学：宋代高古 (Old Song) x 神秘学 (Mysticism)
 * 核心布局：绝对居中 (The Altar)
 * 核心文案：创造 · 爱 · 创造
 */

"use client";

import { VariantEcho } from "./ground/VariantEcho";

export function GroundScreen() {
  return (
    <section
      className="screen screen-ground flex flex-col items-center justify-center overflow-hidden"
      id="ground"
    >
      {/* 丝绸纹理 */}
      <div className="silk-texture" />

      {/* 重影 · 双蛇仗 (The Echo) */}
      <VariantEcho />
    </section>
  );
}
