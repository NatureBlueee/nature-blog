import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 图片域名白名单（Notion S3 和官方域名）
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      { protocol: "https", hostname: "www.notion.so" },
    ],
  },
  // 安全响应头配置
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js 需要
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.notion.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
