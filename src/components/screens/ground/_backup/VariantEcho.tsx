/**
 * 变体 B：【重影 · 混沌】(The Echo)
 *
 * 关键词：水墨晕染、纠缠、双生
 * 表达"二元对立与统一" —— 双蛇仗 (Caduceus)
 */

'use client';

import { motion } from 'framer-motion';

export function VariantEcho() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* === 背景层：水墨双蛇 (Ink Wash Caduceus) === */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid meet"
        style={{ mixBlendMode: 'multiply', opacity: 0.15 }}
      >
        <defs>
          {/* 水墨晕染滤镜 - 没骨画法 */}
          <filter id="ink-wash-echo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" result="noise" />
            <feDisplacementMap in="blur" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* 烟雾流动滤镜 */}
          <filter id="smoke-flow-echo" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise">
              <animate
                attributeName="baseFrequency"
                values="0.015;0.02;0.015"
                dur="20s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* 左蛇 - 浓墨 */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          d="M160,100 Q240,200 160,300 Q80,400 160,500 Q240,600 160,700"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="20"
          filter="url(#ink-wash-echo)"
          strokeLinecap="round"
        />

        {/* 左蛇 - 淡墨晕染层 */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 4.5, ease: "easeInOut" }}
          d="M160,100 Q240,200 160,300 Q80,400 160,500 Q240,600 160,700"
          fill="none"
          stroke="#555555"
          strokeWidth="40"
          filter="url(#smoke-flow-echo)"
          strokeLinecap="round"
        />

        {/* 右蛇 - 浓墨 */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 4, delay: 0.3, ease: "easeInOut" }}
          d="M240,100 Q160,200 240,300 Q320,400 240,500 Q160,600 240,700"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="20"
          filter="url(#ink-wash-echo)"
          strokeLinecap="round"
        />

        {/* 右蛇 - 淡墨晕染层 */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 4.5, delay: 0.3, ease: "easeInOut" }}
          d="M240,100 Q160,200 240,300 Q320,400 240,500 Q160,600 240,700"
          fill="none"
          stroke="#555555"
          strokeWidth="40"
          filter="url(#smoke-flow-echo)"
          strokeLinecap="round"
        />
      </svg>

      {/* === 内容层：重影与实体 === */}
      <div className="z-10 flex flex-col items-center justify-center h-full relative w-full">

        {/* 1. 上虚影：创造 (Echo Past) */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
            opacity: [0.15, 0.25, 0.15],
            filter: ["blur(3px)", "blur(1.5px)", "blur(3px)"]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute select-none"
          style={{
            top: '18%',
            fontFamily: 'var(--font-serif)',
            fontSize: '48px',
            color: '#555',
            mixBlendMode: 'multiply'
          }}
        >
          创造
        </motion.div>

        {/* 2. 下虚影：创造 (Echo Future) */}
        <motion.div
          animate={{
            y: [8, -8, 8],
            opacity: [0.15, 0.25, 0.15],
            filter: ["blur(3px)", "blur(1.5px)", "blur(3px)"]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute select-none"
          style={{
            bottom: '18%',
            fontFamily: 'var(--font-serif)',
            fontSize: '48px',
            color: '#555',
            mixBlendMode: 'multiply'
          }}
        >
          创造
        </motion.div>

        {/* 3. 核心实体：爱 (The Solid Core) */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
            whileInView={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '120px',
              lineHeight: 1,
              fontWeight: 300,
              color: '#111',
              letterSpacing: '0.05em',
              mixBlendMode: 'multiply'
            }}
          >
            爱
          </motion.div>

          {/* 金缮修复 (Kintsugi) - 锐利的金线 */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-20"
            viewBox="0 0 100 100"
          >
            <defs>
              <filter id="gold-glow-echo">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
              d="M15,25 L35,40 L55,32 L75,55"
              fill="none"
              stroke="#C5A059"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#gold-glow-echo)"
            />
            {/* 金粉散落 */}
            <motion.circle
              cx="35" cy="40" r="1.2"
              fill="#C5A059"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 2 }}
            />
            <motion.circle
              cx="55" cy="32" r="0.8"
              fill="#C5A059"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            />
          </svg>
        </div>

        {/* 4. 信息层：极简标注 */}
        <div
          className="absolute flex flex-col items-center gap-2"
          style={{ top: '48px', opacity: 0.5 }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#C5A059' }}
          />
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: '#444' }}
          >
            Nature Chen
          </span>
        </div>

        <div
          className="absolute flex flex-col items-center gap-2"
          style={{ bottom: '48px', opacity: 0.5 }}
        >
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: '#444' }}
          >
            Genesis Architect
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#C5A059' }}
          />
        </div>
      </div>
    </div>
  );
}
