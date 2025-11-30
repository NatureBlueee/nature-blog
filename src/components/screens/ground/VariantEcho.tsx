/**
 * 变体 B：【重影 · 混沌】(The Echo) - 最终重构 v11：隐形神树与虚空呼吸
 *
 * 核心意象：
 * 1. 隐形神树 (The Invisible Tree)：移除几何连线，以中轴对齐和能量流动暗示树的存在。
 * 2. 虚空生长 (Growth from Void)：修复遮罩 bug，让蛇从虚空中自然显现。
 * 3. 构图：圣杯 (Chalice) - 更加通透的视觉。
 */

"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts";

// 暖宣纸配色方案
const scheme = {
  bg: "#F8F4ED",
  leftSnake: "#2A2520",
  rightSnake: "#9A9590",
  love: "#1A1512",
  nameGradient:
    "linear-gradient(180deg, #8B7355 0%, #C5A059 40%, #D4AF61 70%, #C5A059 100%)",
};

export function VariantEcho() {
  const { language, t } = useLanguage();

  // 虚影动画参数 (呼吸)
  const ghostAnimation = {
    y: [-8, 8, -8],
    opacity: [0.7, 0.9, 0.7],
    filter: ["blur(1px)", "blur(0px)", "blur(1px)"],
  };

  const ghostTransition = {
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: scheme.bg,
        transition: "background-color 0.5s ease",
      }}
    >
      {/* === 全局滤镜定义 === */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          {/* 1. 墨迹流淌 (左蛇) - 用户偏好的版本 */}
          <filter id="ink-flow-heavy">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              result="noise"
            >
              {/* 动态频率，模拟墨汁扩散和收缩的呼吸感 */}
              <animate
                attributeName="baseFrequency"
                values="0.015;0.022;0.015"
                dur="25s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0"
            />
          </filter>

          {/* 2. 烟雾流淌 (右蛇) - 用户偏好的版本 */}
          <filter id="smoke-flow-light">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="4"
              result="noise"
            >
              {/* 动态频率，模拟烟雾飘动 */}
              <animate
                attributeName="baseFrequency"
                values="0.02;0.028;0.02"
                dur="30s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
            <feGaussianBlur stdDeviation="2" />
          </filter>

          {/* 3. 沙砾质感 */}
          <filter id="sand-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0"
              in="noise"
              result="coloredNoise"
            />
            <feComposite
              operator="in"
              in="coloredNoise"
              in2="SourceGraphic"
              result="composite"
            />
            <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
          </filter>

          {/* 4. 泥金噪点 */}
          <filter id="gold-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.5"
              numOctaves="2"
              result="noise"
            />
            <feComposite
              operator="in"
              in="noise"
              in2="SourceGraphic"
              result="composite"
            />
            <feBlend mode="overlay" in="composite" in2="SourceGraphic" />
          </filter>

          {/* 5. 粒子涌动 - 模糊不规则的内部流动 */}
          <filter id="particle-surge">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.03;0.05;0.03"
                dur="12s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
            <feGaussianBlur stdDeviation="3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0"
            />
          </filter>

          {/* 6. 微粒涌动 - 更细腻的涌动 */}
          <filter id="particle-surge-fine">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.04;0.06;0.04"
                dur="8s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
            <feGaussianBlur stdDeviation="4" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0"
            />
          </filter>
        </defs>
      </svg>

      {/* === 背景层 1：隐形神树 (The Invisible Tree) === */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.1,
          zIndex: 0,
        }}
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 仅保留一条极细的中轴线，贯穿天地 */}
        <line
          x1="200"
          y1="50"
          x2="200"
          y2="750"
          stroke="#333"
          strokeWidth="0.5"
          strokeDasharray="4 4"
        />
      </svg>

      {/* === 背景层 2：双蛇异体 (The Duality) === */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          mixBlendMode: "multiply",
          zIndex: 1,
        }}
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 首尾淡入淡出遮罩 */}
          <linearGradient id="snake-fade-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="15%" stopColor="white" stopOpacity="1" />
            <stop offset="85%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="snake-fade-mask">
            <rect
              x="0"
              y="0"
              width="400"
              height="800"
              fill="url(#snake-fade-gradient)"
            />
          </mask>
        </defs>

        {/* 应用首尾淡入淡出遮罩的组 */}
        <g mask="url(#snake-fade-mask)">
          {/* 左蛇 (Boaz) - 焦墨 */}
          {/* 血管层 (稳定底色) */}
          <path
            d="M110,770 Q80,640 200,550 Q355,400 210,270 Q80,180 120,40"
            fill="none"
            stroke={scheme.leftSnake}
            strokeWidth="24"
            opacity="0.1"
            strokeLinecap="round"
          />
          {/* 血液层 (颗粒流淌) - 极慢速 */}
          <motion.path
            animate={{ strokeDashoffset: [0, -1000] }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }} // 120秒极慢速
            d="M110,770 Q80,640 200,550 Q355,400 210,270 Q80,180 120,40" // 向左下移动，与血管层同步
            fill="none"
            stroke={scheme.leftSnake}
            strokeWidth="24"
            strokeDasharray="100 0"
            filter="url(#ink-flow-heavy)"
            strokeLinecap="round"
            opacity="0.55"
          />
          {/* 涌动层 - 模糊不规则的内部流动 (新增) */}
          <motion.path
            animate={{ strokeDashoffset: [0, -400] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            d="M110,770 Q80,640 200,550 Q355,400 210,270 Q80,180 120,40"
            fill="none"
            stroke={scheme.leftSnake}
            strokeWidth="12"
            strokeDasharray="8 30 15 25"
            strokeLinecap="round"
            filter="url(#particle-surge)"
            opacity="0.25"
          />
          {/* 微涌层 - 更细腻的涌动感 (新增) */}
          <motion.path
            animate={{ strokeDashoffset: [0, -250] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            d="M110,770 Q80,640 200,550 Q355,400 210,270 Q80,180 120,40"
            fill="none"
            stroke={scheme.leftSnake}
            strokeWidth="16"
            strokeDasharray="12 40 6 50"
            strokeLinecap="round"
            filter="url(#particle-surge-fine)"
            opacity="0.15"
          />

          {/* 右蛇 (Jachin) - 淡烟 */}
          {/* 血管层 */}
          <path
            d="M290,770 Q320,640 200,550 Q45,400 190,270 Q320,180 280,40"
            fill="none"
            stroke={scheme.rightSnake}
            strokeWidth="20"
            opacity="0.1"
            strokeLinecap="round"
          />
          {/* 血液层 (颗粒流淌) - 极慢速 */}
          <motion.path
            animate={{ strokeDashoffset: [0, -1000] }}
            transition={{ duration: 140, repeat: Infinity, ease: "linear" }} // 140秒极慢速，错开节奏
            // d 指 Path（路径）的坐标与曲线路径。每个数字代表 SVG 上的一个点或控制点的 (x, y) 坐标。
            // 解释：M(起点) Q(三次曲线控制点与终点)
            // M290,770              // 路径起点：x=290, y=770（整体向右移20px得到的起点）
            // Q300,640 180,550      // 第一段三次贝塞尔曲线：控制点(300,640)，终点(180,550)
            // Q60,400 180,250       // 第二段三次贝塞尔曲线：控制点(60,400)，终点(180,250)
            // Q280,170 260,80       // 第三段三次贝塞尔曲线：控制点(280,170)，终点(260,80)
            d="M290,770 Q320,640 200,550 Q45,400 190,270 Q320,180 280,40" // 向右下移动，血管血液同步
            fill="none"
            stroke={scheme.rightSnake}
            strokeWidth="20"
            strokeDasharray="100 0"
            filter="url(#smoke-flow-light)"
            strokeLinecap="round"
            opacity="0.35"
          />
          {/* 涌动层 - 模糊不规则的内部流动 (新增) */}
          <motion.path
            animate={{ strokeDashoffset: [0, -350] }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            d="M290,770 Q320,640 200,550 Q45,400 190,270 Q320,180 280,40"
            fill="none"
            stroke={scheme.rightSnake}
            strokeWidth="10"
            strokeDasharray="10 35 8 28"
            strokeLinecap="round"
            filter="url(#particle-surge)"
            opacity="0.2"
          />
          {/* 微涌层 - 更细腻的涌动感 (新增) */}
          <motion.path
            animate={{ strokeDashoffset: [0, -220] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            d="M290,770 Q320,640 200,550 Q45,400 190,270 Q320,180 280,40"
            fill="none"
            stroke={scheme.rightSnake}
            strokeWidth="14"
            strokeDasharray="15 45 5 55"
            strokeLinecap="round"
            filter="url(#particle-surge-fine)"
            opacity="0.12"
          />
        </g>
      </svg>

      {/* === 内容层 (Z-Index: 10) === */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {/* 独立的 SVG 定义用于文字滤镜 */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="sand-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="3"
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0"
                in="noise"
                result="coloredNoise"
              />
              <feComposite
                operator="in"
                in="coloredNoise"
                in2="SourceGraphic"
                result="composite"
              />
              <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
            </filter>
            <filter id="gold-noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.5"
                numOctaves="2"
                result="noise"
              />
              <feComposite
                operator="in"
                in="noise"
                in2="SourceGraphic"
                result="composite"
              />
              <feBlend mode="overlay" in="composite" in2="SourceGraphic" />
            </filter>
          </defs>
        </svg>

        {/* 1. 顶部：名字 - 中文"张晨曦" / 英文"Nature" */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 1,
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.02 }}
          style={{
            position: "absolute",
            top: "clamp(4%, 6vh, 8%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 15,
            writingMode: language === "zh" ? "vertical-rl" : "horizontal-tb",
            textOrientation: language === "zh" ? "upright" : undefined,
            fontFamily:
              language === "zh"
                ? '"Ma Shan Zheng", cursive'
                : '"Cormorant Garamond", Georgia, serif',
            fontSize:
              language === "zh"
                ? "clamp(32px, 5vw, 48px)"
                : "clamp(28px, 4vw, 40px)",
            fontWeight: 400,
            fontStyle: language === "en" ? "italic" : "normal",
            letterSpacing: language === "zh" ? "0.1em" : "0.15em",
            color: "#8B7355",
            textShadow: "1px 1px 2px rgba(139, 115, 85, 0.3)",
            userSelect: "none",
            cursor: "default",
          }}
        >
          <span
            style={{
              background: scheme.nameGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {language === "zh" ? "张晨曦" : "Nature"}
          </span>
        </motion.div>

        {/* 2. 核心：爱 (实体) - 使用Love.svg */}
        <div style={{ position: "relative" }}>
          {/* 金缮 - 在字的下层 */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              overflow: "visible",
              zIndex: 1,
            }}
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
          </svg>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
            whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              width: "150px",
              height: "auto",
              mixBlendMode: "multiply",
              position: "relative",
              zIndex: 10,
            }}
          >
            {/* Love.svg 手写爱字 - 各部分独立微浮动 */}
            <svg
              viewBox="0 0 150.24 241.44"
              style={{ width: "100%", height: "auto", overflow: "visible" }}
            >
              {/* 主体部分 - 缓慢呼吸 */}
              <motion.path
                animate={{
                  y: [0, -1.5, 0],
                  opacity: [1, 0.95, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                fill={scheme.love}
                d="M61.78,104.11c.25.3.93.56,1.28.88,3.31,3.15,7.32,5.58,10.63,8.66.33.31.64.64.95.97.23,1-2.69.38-3.17.29-2.79-.51-9.4-3.59-11.76-5.25-4.35-3.06-5.18-8.53-11.99-7.36-3.18.55-5.34,2.33-4.88,5.78.6,4.41,5.78,7.22,8.81,10.36,4.38,4.55,8.5,8.54,6.74,15.38-1.89,7.32-9.26,9.36-10.55,19.17-.19,1.45-.5,5.12-.26,6.43.31,1.64,4.06,4.31,5.52,5.02,2.45,1.18,4.85,1.22,7.54.88.44-.05.3-.45.51-.49,1.05-.25,1.57.36,1.75-1.32.43-3.85-.49-8.51.1-12.36s4.41-11.55,6.07-15.5c.25-.6.29-2.36,1.13-1.98.33.15.43.84.49,1.18,2.32,11.93-5.47,21.49.74,32.81.63,1.15,2.55,4.12,3.44,4.95.26.24.38.44.8.33.22-.06,2.69-3.03,3.03-3.46,1.96-2.45,5.36-6.87,5.94-9.88.93-4.88-.16-15.68-2.13-20.28-.44-1.02-3.63-6.54-3.08-7.1.72.11,1.84-.18,2.48.04.28.09,3.24,3.74,3.62,4.29,2.61,3.82,6.27,12.81,6.12,17.36l-.72,7.19c.08.85,3.59,2.42,4.42,2.28.3-.05,2.51-2.01,2.89-2.39,3.57-3.5,5.78-6.93,5.01-12.22l-10.06-15.09c-.64-1.61,2.23-10.57,1.71-11.29-.36-.49-7.25.41-8.64.26-7.58-.86-10.83-11.93-7.4-17.96l9.65-11.12c-.96-1.16-1.62-2.53-2.5-3.74-2.82-3.9-6.15-7.51-8.92-11.44-.31-.44-2.21-3.19-1.96-3.43,1.33.04,3.07.04,4.24.67s1.97,2.15,2.94,3.05c9.58,8.78,19.11,11.68,31.97,12.35.94.05,5.79-.21,6.12.23.09.47-.22.58-.55.77-2.71,1.57-7.48,1.84-10.11,4.27-2.4,2.22-.35,6.76.79,9.27,2.73,6,8.78,9.4,13.33,13.99.52.52,1.53.82,1.57,1.67-.26.24-4.14-1.57-4.72-1.85-.32-.16-.32-.48-.6-.61-2.15-1.03-8.22-3.15-9.64-4.49-1.24-1.16-3.64-5.66-4.4-7.34-1.76-3.94-1.95-7.98-6.08-10.45-.94-.56-3.26-1.69-4.13-.91-.79.71-1.97,3.02-2.87,4.08-3.35,3.94-9.39,6.55-8.71,12.78l.5.45c2.7.96,5.39,1.98,8.08,2.94,4.23,1.51,7.22,2.44,11.18,4.63,4.7,2.6,9.21,5.7,13.01,9.51.23.57-.76.36-1.02.3-4.53-1.1-9.72-3.43-14.26-4.91-.75-.24-5.28-1.78-5.56-1.51l1.62,7.85c6.81,7.73,15.4,15.04,11.62,26.61-.27.83-.8,2.31-1.39,2.93-.71.75-7.57,5.86-8.41,6.21-5.3,2.18-16.87,1.67-18.85,8.22-.97,3.2.09,4.18,2.34,6.19,6.02,5.38,14.06,9.14,21.64,11.9,1.66.6,3.96.59,5.07,1.99-.53.71-10.03-.31-11.55-.55-7.85-1.2-12.29-3.4-18.15-8.44-4.96-4.27-10.1-8.35-15.01-12.66-1-.88-2.07-2.62-3.55-2.8-3.67-.44-6.94.64-10.7-.79-8.05-3.06-10.69-12.27-10.51-20.18.02-.88.14-3.3.3-4.01.21-.94,5.85-5.86,7.02-7.12,2.6-2.81,5.12-5.84,6.23-9.59.27-.9.94-4.14.84-4.9-.04-.33-.22-.56-.5-.72l-8.91-4.68-.56-.69c-6.46-2.9-8.76-5.54-8.25-12.87.17-2.5.21-3.07,2.19-4.52,2.35-1.72,6.92-3.96,9.74-4.64,5.99-1.43,9.99-.74,12.8-7.56.29-.71.85-1.97.05-2.54-1.01-.73-6.05-2.05-7.41-2.17-4.21-.38-6.5.84-10.18-2.28-3.41-2.89-6.62-10.21-6.23-14.63.29-3.3,3.78-5.3,6-7.42,4.62-4.41,8.71-7.5,10.42-14.02.47-1.81.57-3.67.84-5.51.54-.09.65.34.84.72,1.66,3.24,2.2,7.77,3.7,11.15,4.42,2.97,9.47,4.5,11.79,9.77,1.97,4.48,1.05,11.57-.89,15.98-1.33,3.02-5.41,6.13-4.31,9.84.29.97,1.67,1.89,1.94,3.09.74,3.2-1.04,6.21-3.8,7.73-.7.39-1.84.52-2.3,1.06-.75.9-.73,3.42.05,4.33ZM61.39,77.74c.13-.08.24-.44.47-.6,1.48-1.01,3.28-1.98,3.92-3.78-.19-5.94-1.32-11.57-7.43-13.87-1.58-.59-5.62-1.48-7.17-.95-1,.34-3.84,4.26-5.04,5.03-2.02,3.1-2.43,7.73-1.15,11.2.47,1.26,1.44,3.52,2.6,4.11,3.75,1.89,10.27,1.05,13.79-1.14Z"
              />
              {/* 右上撇 - 略快呼吸，轻微左右 */}
              <motion.path
                animate={{
                  y: [0, -2, 0],
                  x: [0, 0.5, 0],
                  opacity: [1, 0.92, 1],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
                fill={scheme.love}
                d="M89.58,50.41c.96,1.07,1.99,2.1,3.19,2.92l20.4,10.14-.07.95c-.25.36-5.6.26-6.49.23-5.99-.21-12.63-2.19-17.21-6.26l-12.11-17.83c.45-.67,1.25-.15,1.83.08,5.35,2.18,6.98,5.87,10.47,9.78Z"
              />
              {/* 右横 - 不同节奏 */}
              <motion.path
                animate={{
                  y: [0, -1, 0],
                  x: [0, -0.8, 0],
                  opacity: [1, 0.94, 1],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
                fill={scheme.love}
                d="M114.64,76.14c-1.58.52-3.23.81-4.84,1.22-2.66.68-5.44,1.32-8.45,1.41-3.31.1-8.18-.21-10.88-2.05-5.9-4.03-7.01-7.76-9.87-13.85l-1.65-3.5c.63-.07,1.1.38,1.55.72,3.62,2.79,6.71,6.64,10.45,9.44,5.47,4.1,12.8,5.4,19.5,5.89.36.03,4.99-.3,4.19.72Z"
              />
              {/* 左点 - 轻微跳动 */}
              <motion.path
                animate={{
                  y: [0, -1.2, 0],
                  scale: [1, 1.02, 1],
                  opacity: [1, 0.9, 1],
                }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.9,
                }}
                fill={scheme.love}
                d="M55.88,63.77c.06.02.08.28.27.36,2.27,1.02,2.91,1.51,3.15,4.23.08.91.25,3.64-.49,4.06-.62.36-5.33.97-5.99.74-.94-.32-2.18-3.73-2.16-4.81.02-.84,1.3-4.33,1.85-4.69.7-.45,2.57-.15,3.36.11Z"
              />
            </svg>
          </motion.div>
        </div>

        {/* 3. 底部组合：生命 + 生命之花 */}
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 生命之花 (基座) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              width: "240px",
              height: "240px",
              opacity: 0.3,
              pointerEvents: "none",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{ width: "100%", height: "100%" }}
            >
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <circle
                cx="50"
                cy="30"
                r="20"
                fill="none"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <circle
                cx="50"
                cy="70"
                r="20"
                fill="none"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <circle
                cx="32.6"
                cy="40"
                r="20"
                fill="none"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <circle
                cx="67.4"
                cy="40"
                r="20"
                fill="none"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <circle
                cx="32.6"
                cy="60"
                r="20"
                fill="none"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <circle
                cx="67.4"
                cy="60"
                r="20"
                fill="none"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
            </svg>
          </motion.div>

          {/* 生命 (虚影) */}
          <motion.div
            animate={ghostAnimation}
            transition={{ ...ghostTransition, duration: 9 }}
            whileHover={{ opacity: 1, filter: "blur(0px)", scale: 1.05 }}
            style={{
              fontFamily:
                language === "zh"
                  ? "var(--font-serif)"
                  : '"Cormorant Garamond", Georgia, serif',
              fontSize: language === "zh" ? "48px" : "42px",
              fontStyle: language === "en" ? "italic" : "normal",
              color: "#333",
              mixBlendMode: "multiply",
              userSelect: "none",
              zIndex: 10,
              cursor: "default",
              textShadow: "0 0 20px rgba(255,255,255,0.8)",
            }}
          >
            {t("生命", "Life")}
          </motion.div>
        </div>

        {/* 4. 散落的信物 (Scattered Artifacts) */}

        {/* ===== "八"字布局：内凹曲线，从中上向两侧下方展开 ===== */}

        {/* 左撇 - 内凹曲线：顶部靠中心，中部向内弯，底部向外 */}
        {/* 碎片 C: wowok (左撇顶部，靠近中心) */}
        <motion.a
          href="https://wowok.net"
          target="_blank"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.85 }}
          transition={{ delay: 0.3, duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          whileHover={{ opacity: 1 }}
          style={{
            position: "absolute",
            bottom: "36%",
            left: "30%",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "22px",
            color: "#C5A059",
            textDecoration: "none",
            cursor: "pointer",
            filter: "url(#sand-grain)",
            whiteSpace: "nowrap",
            transform: "rotate(-15deg)",
          }}
        >
          wowok.net
        </motion.a>

        {/* 碎片 A: 北京 (左撇中部，内凹向右靠) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.75 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{
            position: "absolute",
            bottom: "23%",
            left: "24%",
            fontFamily: "var(--font-serif)",
            fontSize: "19px",
            color: "#2A2A2A",
            filter: "url(#sand-grain)",
            whiteSpace: "nowrap",
            transform: "rotate(-3deg)",
          }}
        >
          {t("北京 · 大四在读", "Beijing · Senior Year")}
        </motion.div>

        {/* 碎片 B: NEU (左撇底部，向外展开) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          transition={{ delay: 0.7, duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{
            position: "absolute",
            bottom: "10%",
            left: "12%",
            fontFamily: "var(--font-mono)",
            fontSize: "17px",
            color: "#444",
            filter: "url(#sand-grain)",
            whiteSpace: "nowrap",
            transform: "rotate(2deg)",
          }}
        >
          NEU 26 Fall
        </motion.div>

        {/* 右捺 - 内凹曲线：顶部靠中心，中部向内弯，底部向外 */}
        {/* 碎片 F: 灵性 (右捺顶部，靠近中心) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.75 }}
          transition={{ delay: 0.4, duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{
            position: "absolute",
            bottom: "37%",
            right: "31%",
            fontFamily: "var(--font-serif)",
            fontSize: "20px",
            color: "#2A2A2A",
            filter: "url(#sand-grain)",
            whiteSpace: "nowrap",
            transform: "rotate(5deg)",
          }}
        >
          {t("跨文化灵性", "Cross-cultural Spirituality")}
        </motion.div>

        {/* 碎片 D: 写作 (右捺中部，内凹向左靠) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.75 }}
          transition={{ delay: 0.6, duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{
            position: "absolute",
            bottom: "22%",
            right: "24%",
            fontFamily: "var(--font-serif)",
            fontSize: "19px",
            color: "#2A2A2A",
            filter: "url(#sand-grain)",
            whiteSpace: "nowrap",
            transform: "rotate(4deg)",
          }}
        >
          {t("写作 & 视觉艺术", "Writing & Visual Arts")}
        </motion.div>

        {/* 碎片 E: 哲学 (右捺底部，向外展开) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{
            position: "absolute",
            bottom: "9%",
            right: "10%",
            fontFamily: "var(--font-serif)",
            fontSize: "18px",
            color: "#444",
            filter: "url(#sand-grain)",
            whiteSpace: "nowrap",
            transform: "rotate(-1deg)",
          }}
        >
          {t("街边哲学", "Street Philosophy")}
        </motion.div>
      </div>
    </div>
  );
}
