/**
 * 动态 OG 图片生成 API
 *
 * 使用 next/og (ImageResponse) 动态生成社交分享图片
 * 应用宋代美学设计语言：宣纸白背景、焦墨文字、泥金装饰
 *
 * 关键技术点：
 * - 运行在 Edge Runtime
 * - 必须通过 fetch 加载字体文件 Buffer
 * - 字体数据传递给 ImageResponse 的 fonts 选项
 * - ⚠️ Satori (next/og底层库) 只支持 woff 和 ttf 格式，不支持 woff2！
 */

import { ImageResponse } from "next/og";
import { seoConfig } from "@/lib/seo";

export const runtime = "edge";

/**
 * 加载字体
 *
 * 注意：next/og (Satori) 只支持 woff 和 ttf 格式，不支持 woff2！
 * 使用 Google Fonts 的 ttf 格式
 */
async function loadFont(): Promise<{ data: ArrayBuffer; name: string } | null> {
  // 使用 Noto Sans SC（思源黑体）ttf 格式
  // 这是 Google Fonts 提供的可直接访问的 ttf 文件
  try {
    const response = await fetch(
      "https://fonts.gstatic.com/s/notosanssc/v37/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYxNbPzS5HE.ttf"
    );
    if (response.ok) {
      return {
        data: await response.arrayBuffer(),
        name: "Noto Sans SC",
      };
    }
  } catch (error) {
    console.warn("[OG] Failed to load Noto Sans SC:", error);
  }

  // 备用：使用 Inter ttf 格式
  try {
    const response = await fetch(
      "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf"
    );
    if (response.ok) {
      return {
        data: await response.arrayBuffer(),
        name: "Inter",
      };
    }
  } catch (error) {
    console.warn("[OG] Failed to load Inter:", error);
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || seoConfig.siteName;

  const { width, height, backgroundColor, textColor, accentColor } =
    seoConfig.ogImage;

  // 加载字体
  const font = await loadFont();

  // 如果字体加载失败，返回简单的纯色图片
  if (!font) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor,
            fontSize: "48px",
            color: textColor,
          }}
        >
          {seoConfig.siteName}
        </div>
      ),
      { width, height }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor,
          fontFamily: `"${font.name}", sans-serif`,
        }}
      >
        {/* 顶部装饰线（泥金） */}
        <div
          style={{
            width: "60px",
            height: "2px",
            backgroundColor: accentColor,
            marginBottom: "40px",
          }}
        />

        {/* 标题（焦墨） */}
        <div
          style={{
            fontSize: title.length > 20 ? "48px" : "64px",
            fontWeight: 400,
            color: textColor,
            textAlign: "center",
            maxWidth: "80%",
            lineHeight: 1.4,
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </div>

        {/* 底部站点名（泥金） */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            fontSize: "24px",
            color: accentColor,
            letterSpacing: "0.2em",
          }}
        >
          {seoConfig.siteName}
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        {
          name: font.name,
          data: font.data,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
