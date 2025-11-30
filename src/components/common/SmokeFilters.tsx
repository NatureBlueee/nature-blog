/**
 * SVG 烟雾滤镜
 *
 * 用于里世界的烟雾效果
 */

export function SmokeFilters() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        {/* 虚空之烟：极细噪点 */}
        <filter id="smoke-subtle">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="5" result="turbulence">
            <animate attributeName="baseFrequency" dur="40s" values="0.015;0.02;0.015" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="30" />
          <feGaussianBlur stdDeviation="10" />
        </filter>

        {/* 分割线之烟：垂直流动 */}
        <filter id="smoke-line-flow">
          <feTurbulence type="turbulence" baseFrequency="0.05 0.1" numOctaves="4" result="turbulence">
            <animate attributeName="baseFrequency" dur="20s" values="0.05 0.1;0.05 0.15;0.05 0.1" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" />
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
    </svg>
  );
}
