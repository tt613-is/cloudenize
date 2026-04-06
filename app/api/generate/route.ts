import { NextRequest, NextResponse } from "next/server";
import { identifyCloud } from "@/lib/cloudIdentify";
import { GenerateCardRequest, GenerateCardResponse, FrameStyle } from "@/types/cloud";

const FRAME_STYLES: FrameStyle[] = ["polaroid", "film", "instant"];

function pickFrameStyle(requested?: FrameStyle): FrameStyle {
  if (requested && FRAME_STYLES.includes(requested)) return requested;
  return FRAME_STYLES[Math.floor(Math.random() * FRAME_STYLES.length)];
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<GenerateCardResponse>> {
  let body: GenerateCardRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { result: { cloudType: "未知", cloudTypeEn: "Unknown", description: "", confidence: 0 }, frameStyle: "polaroid", error: "请求格式错误" },
      { status: 400 }
    );
  }

  const { imageUrl, imageData, frameStyle } = body;

  // Resolve which image source to use
  let imageSource: string | null = null;
  if (imageData && typeof imageData === "string" && imageData.startsWith("data:image/")) {
    imageSource = imageData;
  } else if (imageUrl && typeof imageUrl === "string") {
    if (!isValidUrl(imageUrl)) {
      return NextResponse.json(
        { result: { cloudType: "未知", cloudTypeEn: "Unknown", description: "", confidence: 0 }, frameStyle: "polaroid", error: "URL 格式不正确，请输入完整的 http/https 链接" },
        { status: 400 }
      );
    }
    imageSource = imageUrl;
  }

  if (!imageSource) {
    return NextResponse.json(
      { result: { cloudType: "未知", cloudTypeEn: "Unknown", description: "", confidence: 0 }, frameStyle: "polaroid", error: "请提供图片或图片链接" },
      { status: 400 }
    );
  }

  try {
    const result = await identifyCloud(imageSource);
    const chosenFrame = pickFrameStyle(frameStyle);

    return NextResponse.json({ result, frameStyle: chosenFrame });
  } catch (err) {
    const message = err instanceof Error ? err.message : "识别失败，请稍后重试";
    console.error("[generate] error:", err);
    return NextResponse.json(
      { result: { cloudType: "未知", cloudTypeEn: "Unknown", description: "", confidence: 0 }, frameStyle: "polaroid", error: message },
      { status: 500 }
    );
  }
}
