'use client';

/**
 * 自定义光标组件
 *
 * 圆形光标，悬停时放大
 */

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // 光标跟随
    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    // Hover 状态
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('.hover-target')) {
        document.body.classList.add('hovering');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('.hover-target')) {
        document.body.classList.remove('hovering');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}
