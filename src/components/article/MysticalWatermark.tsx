/**
 * 神秘水印组件
 *
 * 若隐若现的符号，像古籍里的暗纹
 * 来源：炼金术、卡巴拉、易经、神圣几何等
 */

'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface MysticalWatermarkProps {
  theme: 'surface' | 'inner';
}

/**
 * 符号库 - 精心绘制的 SVG path
 * 每个符号都有其神秘学来源
 */
const SYMBOLS = {
  // 炼金术 - 水银符号（变化与流动）
  mercury: 'M12 2a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm0 10a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M12 14v4 M9 16h6',

  // 炼金术 - 太阳符号（意识与光明）
  sol: 'M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M12 2v4 M12 18v4 M2 12h4 M18 12h4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83',

  // 神圣几何 - 生命之花（创造的蓝图）
  flowerOfLife: 'M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M12 4a8 8 0 0 1 0 16 M12 4a8 8 0 0 0 0 16 M4 12a8 8 0 0 1 16 0 M4 12a8 8 0 0 0 16 0',

  // 易经 - 乾卦（天、创造力）
  qian: 'M4 6h16 M4 12h16 M4 18h16',

  // 易经 - 坤卦（地、接纳）
  kun: 'M4 6h6 M14 6h6 M4 12h6 M14 12h6 M4 18h6 M14 18h6',

  // 卡巴拉 - 生命树简化（Kether 到 Malkuth）
  treeOfLife: 'M12 2a2 2 0 1 0 0 4 M12 10a2 2 0 1 0 0 4 M12 18a2 2 0 1 0 0 4 M6 6a2 2 0 1 0 0 4 M18 6a2 2 0 1 0 0 4 M6 14a2 2 0 1 0 0 4 M18 14a2 2 0 1 0 0 4 M12 6v4 M12 14v4 M8 8l4 4 M16 8l-4 4 M8 16l4-4 M16 16l-4-4',

  // 占星 - 月亮符号（潜意识与直觉）
  luna: 'M20 12c0 5.52-4.48 10-10 10S0 17.52 0 12 4.48 2 10 2c-3.31 0-6 4.03-6 9s2.69 9 6 9c5.52 0 10-4.48 10-10z',

  // 几何 - 无限符号（永恒）
  infinity: 'M4 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm8 0c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z',

  // 神秘 - 全视之眼轮廓
  eye: 'M12 4C5 4 1 12 1 12s4 8 11 8 11-8 11-8-4-8-11-8zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z',
};

const SYMBOL_KEYS = Object.keys(SYMBOLS) as (keyof typeof SYMBOLS)[];

// 简单的伪随机生成器，基于时间戳生成稳定的随机值
function getStableRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function MysticalWatermark({ theme }: MysticalWatermarkProps) {
  const [watermarks, setWatermarks] = useState<{ id: number; symbolKey: keyof typeof SYMBOLS; position: { top: number; left?: number; right?: number }; rotation: number; scale: number }[]>([]);

  useEffect(() => {
    // 1. 准备符号池并打乱 (Fisher-Yates Shuffle)
    const shuffledKeys = [...SYMBOL_KEYS];
    for (let i = shuffledKeys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledKeys[i], shuffledKeys[j]] = [shuffledKeys[j]!, shuffledKeys[i]!];
    }

    // 2. 定义区域系统 (Zone System)
    // 将文章高度分为 4 个区域，每个区域放置一个水印
    const ZONE_COUNT = 4;
    const newWatermarks = [];

    for (let i = 0; i < ZONE_COUNT; i++) {
      // 区域高度范围
      const zoneStart = (i / ZONE_COUNT) * 100;
      const zoneHeight = 100 / ZONE_COUNT;
      
      // 在区域内随机垂直位置 (留出 10% 边距避免贴边)
      const topPos = zoneStart + 10 + Math.random() * (zoneHeight - 20);

      // 水平位置：交替分布 (左 -> 右 -> 左 -> 右)
      // 偶数在左，奇数在右
      const isLeft = i % 2 === 0;
      
      // 边缘距离：5% - 15%
      const edgeDist = 5 + Math.random() * 10;

      newWatermarks.push({
        id: i,
        symbolKey: shuffledKeys[i % shuffledKeys.length] ?? 'sol',
        position: {
          top: topPos,
          [isLeft ? 'left' : 'right']: edgeDist,
        },
        rotation: (Math.random() - 0.5) * 40, // -20 到 20 度
        scale: 0.8 + Math.random() * 0.5, // 0.8 - 1.3 倍
      });
    }
    
    setWatermarks(newWatermarks);
  }, []);

  if (watermarks.length === 0) return null;

  return (
    <>
      {watermarks.map((wm) => (
        <div
          key={wm.id}
          className={styles.watermark}
          style={{
            top: `${wm.position.top}%`,
            left: wm.position.left ? `${wm.position.left}%` : 'auto',
            right: wm.position.right ? `${wm.position.right}%` : 'auto',
            transform: `rotate(${wm.rotation}deg) scale(${wm.scale})`,
          }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.watermarkSvg}
            data-theme={theme}
            style={{ filter: 'url(#ancient-seal)' }}
          >
            <path d={SYMBOLS[wm.symbolKey]} />
          </svg>
        </div>
      ))}
    </>
  );
}
