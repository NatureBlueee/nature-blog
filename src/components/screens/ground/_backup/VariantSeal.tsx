/**
 * 变体 C：【金印 · 意志】(The Seal)
 *
 * 关键词：金石气、铭刻、向心
 * 表达"我即法则" —— 塔罗牌魔法师
 */

'use client';

import { motion } from 'framer-motion';

export function VariantSeal() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* === 印章本体 (The Seal) === */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, rotate: 45, y: 50 }}
        whileInView={{ scale: 1, opacity: 1, rotate: 45, y: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 40, damping: 15 }}
        className="relative flex items-center justify-center"
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: '#F2F1E8',
          // 拟态风格阴影 + 纸张压痕效果
          boxShadow: `
            1px 1px 0px rgba(0,0,0,0.04),
            2px 2px 0px rgba(0,0,0,0.04),
            3px 3px 0px rgba(0,0,0,0.04),
            20px 20px 40px rgba(0,0,0,0.08),
            -10px -10px 40px rgba(255,255,255,0.7)
          `
        }}
      >
        {/* 石头/玉石纹理 - SVG 生成 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ mixBlendMode: 'multiply', opacity: 0.3 }}
        >
          <defs>
            <filter id="stone-texture-seal">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" result="noise" />
              <feColorMatrix
                type="matrix"
                values="0.2 0 0 0 0.5
                        0 0.2 0 0 0.5
                        0 0 0.2 0 0.5
                        0 0 0 0.15 0"
              />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#stone-texture-seal)" />
        </svg>

        {/* 印章边框 (内凹效果 - 阴刻) */}
        <div
          className="absolute"
          style={{
            inset: '12px',
            border: '1px solid #C5A059',
            opacity: 0.35,
            mixBlendMode: 'multiply'
          }}
        />
        <div
          className="absolute"
          style={{
            inset: '20px',
            border: '1px solid #C5A059',
            opacity: 0.2,
            mixBlendMode: 'multiply'
          }}
        />

        {/* === 内部内容 (旋转回正) === */}
        <div
          className="flex flex-col items-center justify-center w-full h-full p-6 text-center relative z-10"
          style={{ transform: 'rotate(-45deg)' }}
        >
          {/* 顶部：名 (Name) */}
          <div
            className="flex flex-col items-center gap-2 pb-4"
            style={{
              borderBottom: '1px solid rgba(197, 160, 89, 0.3)',
              width: '75%'
            }}
          >
            <span
              className="text-xl tracking-[0.4em] font-bold"
              style={{
                fontFamily: 'var(--font-serif)',
                color: '#333',
                marginLeft: '0.4em'
              }}
            >
              张晨曦
            </span>
            <span
              className="text-[8px] tracking-[0.3em] uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#999'
              }}
            >
              Nature Chen
            </span>
          </div>

          {/* 核心阵列：创造·爱·创造 */}
          <div className="flex items-center justify-center gap-5 my-5 w-full">
            {/* 左护法：创造 */}
            <div
              className="flex items-center h-14"
              style={{
                writingMode: 'vertical-rl',
                fontFamily: 'var(--font-serif)',
                fontSize: '11px',
                color: '#666',
                opacity: 0.6,
                letterSpacing: '0.3em',
                borderLeft: '1px solid rgba(197, 160, 89, 0.2)',
                paddingLeft: '8px'
              }}
            >
              创造
            </div>

            {/* 核心字：爱 (朱砂红印泥质感) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '2px',
                backgroundColor: '#B22222',
                color: '#F2F1E8',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {/* 印泥纹理 - SVG */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ mixBlendMode: 'multiply', opacity: 0.4 }}
              >
                <defs>
                  <filter id="ink-pad-texture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                    <feColorMatrix
                      type="matrix"
                      values="1 0 0 0 0
                              0 0 0 0 0
                              0 0 0 0 0
                              0 0 0 0.3 0"
                    />
                  </filter>
                </defs>
                <rect width="100%" height="100%" filter="url(#ink-pad-texture)" />
              </svg>

              {/* 暗色叠加增加厚重感 */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  mixBlendMode: 'overlay'
                }}
              />

              <span
                className="relative z-10"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '44px',
                  fontWeight: 700,
                  filter: 'blur(0.2px)'
                }}
              >
                爱
              </span>
            </motion.div>

            {/* 右护法：创造 */}
            <div
              className="flex items-center h-14"
              style={{
                writingMode: 'vertical-rl',
                fontFamily: 'var(--font-serif)',
                fontSize: '11px',
                color: '#666',
                opacity: 0.6,
                letterSpacing: '0.3em',
                borderRight: '1px solid rgba(197, 160, 89, 0.2)',
                paddingRight: '8px'
              }}
            >
              创造
            </div>
          </div>

          {/* 底部：状态 (Status) */}
          <div
            className="flex flex-col items-center gap-2 pt-4"
            style={{
              borderTop: '1px solid rgba(197, 160, 89, 0.3)',
              width: '75%'
            }}
          >
            <span
              className="text-[8px] tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-mono)', color: '#666' }}
            >
              BUILDING WOWOK.NET
            </span>
            <span
              className="text-[8px] tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-mono)', color: '#999' }}
            >
              BJ / NEU (26 FALL)
            </span>
          </div>
        </div>

        {/* 边角金缮 (Kintsugi Corners) */}
        <div
          className="absolute"
          style={{
            top: '8px',
            left: '8px',
            width: '20px',
            height: '20px',
            borderTop: '1px solid #C5A059',
            borderLeft: '1px solid #C5A059',
            opacity: 0.7
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '8px',
            right: '8px',
            width: '20px',
            height: '20px',
            borderBottom: '1px solid #C5A059',
            borderRight: '1px solid #C5A059',
            opacity: 0.7
          }}
        />

        {/* 缺角效果 (Wabi-sabi) */}
        <div
          className="absolute"
          style={{
            top: '-4px',
            right: '-4px',
            width: '28px',
            height: '28px',
            backgroundColor: '#E6E4D5',
            transform: 'rotate(45deg) translateY(8px)'
          }}
        />
      </motion.div>
    </div>
  );
}
