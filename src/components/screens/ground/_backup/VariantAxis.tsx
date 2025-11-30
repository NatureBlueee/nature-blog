/**
 * 变体 A：【中轴 · 秩序】(The Axis)
 *
 * 关键词：铁线描、连接、垂直
 * 表达"连接天地"的愿景 —— 卡巴拉生命之树
 */

'use client';

import { motion } from 'framer-motion';

export function VariantAxis() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* === 背景层：铁线描生命之树 (Iron Wire Tree) === */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ mixBlendMode: 'multiply' }}
      >
        <defs>
          {/* 铁线描滤镜 - 模拟毛笔的"涩"感 */}
          <filter id="iron-wire-axis" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* 墨色渐变 */}
          <linearGradient id="ink-fade-axis" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A1A1A" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#555555" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 中轴线 - 劲挺有力 */}
        <motion.line
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          x1="200" y1="80" x2="200" y2="720"
          stroke="url(#ink-fade-axis)"
          strokeWidth="1.2"
          filter="url(#iron-wire-axis)"
          className="iron-wire-line"
        />

        {/* 生命树枝干 - 左上 */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 2.5, delay: 0.3 }}
          d="M200,180 Q140,220 120,300"
          stroke="#555555"
          strokeWidth="0.8"
          fill="none"
          filter="url(#iron-wire-axis)"
        />

        {/* 生命树枝干 - 右上 */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 2.5, delay: 0.4 }}
          d="M200,180 Q260,220 280,300"
          stroke="#555555"
          strokeWidth="0.8"
          fill="none"
          filter="url(#iron-wire-axis)"
        />

        {/* 生命树枝干 - 左下 */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 2.5, delay: 0.6 }}
          d="M200,620 Q150,660 130,720"
          stroke="#555555"
          strokeWidth="0.8"
          fill="none"
          filter="url(#iron-wire-axis)"
        />

        {/* 生命树枝干 - 右下 */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 2.5, delay: 0.7 }}
          d="M200,620 Q250,660 270,720"
          stroke="#555555"
          strokeWidth="0.8"
          fill="none"
          filter="url(#iron-wire-axis)"
        />

        {/* Sephiroth 节点 - 墨点 */}
        <motion.circle
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          cx="200" cy="180" r="3"
          fill="#1A1A1A"
        />
        <motion.circle
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          cx="200" cy="400" r="4"
          fill="#1A1A1A"
        />
        <motion.circle
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          cx="200" cy="620" r="3"
          fill="#1A1A1A"
        />
      </svg>

      {/* === 内容层：绝对中轴 === */}
      <div className="z-10 flex flex-col items-center justify-between h-[70vh] py-8">

        {/* 1. 塔尖：身份 (Keter) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-[#555]" style={{ opacity: 0.4 }} />
          <h2
            className="text-base tracking-[0.4em] font-medium"
            style={{
              fontFamily: 'var(--font-serif)',
              color: '#333',
              mixBlendMode: 'multiply'
            }}
          >
            张晨曦
          </h2>
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              color: '#888',
              transform: 'scale(0.9)'
            }}
          >
            Nature Chen
          </span>
        </motion.div>

        {/* 2. 核心：咒语 (The Mantra) */}
        <div className="flex flex-col items-center gap-12 relative">
          {/* 上：创造 */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            whileInView={{ opacity: 0.5, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="select-none"
            style={{
              writingMode: 'vertical-rl',
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              color: '#555',
              letterSpacing: '0.3em',
              mixBlendMode: 'multiply'
            }}
          >
            创造
          </motion.div>

          {/* 中：爱 (Tiferet) - 视觉锚点 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            {/* 汉字主体 - 泥金色 */}
            <span
              className="relative z-10"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '72px',
                fontWeight: 500,
                color: '#C5A059',
                letterSpacing: '0.1em',
                mixBlendMode: 'multiply',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              爱
            </span>

            {/* 呼吸光晕 */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full -z-10"
              style={{
                background: '#C5A059',
                filter: 'blur(40px)',
                transform: 'scale(1.5)'
              }}
            />
          </motion.div>

          {/* 下：创造 */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            whileInView={{ opacity: 0.5, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="select-none"
            style={{
              writingMode: 'vertical-rl',
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              color: '#555',
              letterSpacing: '0.3em',
              mixBlendMode: 'multiply'
            }}
          >
            创造
          </motion.div>
        </div>

        {/* 3. 基座：现实 (Malkuth) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-[10px] tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-mono)', color: '#666' }}
            >
              BUILDING WOWOK.NET
            </span>
            <span
              className="text-[10px] tracking-[0.2em]"
              style={{ fontFamily: 'var(--font-mono)', color: '#999' }}
            >
              BJ / NEU (26 FALL)
            </span>
          </div>
          <div className="w-[1px] h-10 bg-gradient-to-t from-transparent to-[#555]" style={{ opacity: 0.4 }} />
        </motion.div>
      </div>
    </div>
  );
}
