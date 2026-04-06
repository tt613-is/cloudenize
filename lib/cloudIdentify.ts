import OpenAI from "openai";
import { CloudIdentifyResult, CloudType } from "@/types/cloud";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `你是一位专业的气象观测员，同时也是一位诗人。你擅长识别云的类型，并用富有诗意的文字描述它们。`;

const USER_PROMPT = `请识别这张照片中的云类型，从以下类型中选择最匹配的一个：
- 卷云 (Cirrus)：高空纤细丝状云
- 积云 (Cumulus)：白色棉花糖状云
- 层云 (Stratus)：均匀低层灰色云
- 积雨云 (Cumulonimbus)：巨型雷暴云柱
- 高积云 (Altocumulus)：中层灰白块状云
- 卷积云 (Cirrocumulus)：高层鱼鳞状云
- 卷层云 (Cirrostratus)：产生日晕的薄云幕
- 高层云 (Altostratus)：中层灰蓝均匀云层
- 雨层云 (Nimbostratus)：深灰色厚雨云
- 层积云 (Stratocumulus)：低层成排云块

然后生成一段诗意的中文描述（40-60字），融合：
1. 这种云的典型特征和形成原因
2. 从照片光线推测的时间或季节感
3. 一句令人心动的浪漫感受或哲思

返回严格的JSON格式（不要有其他文字）：
{
  "cloudType": "云类型中文名",
  "cloudTypeEn": "英文名",
  "description": "诗意描述文字",
  "season": "春/夏/秋/冬/未知",
  "confidence": 0.0到1.0之间的数字
}`;

export async function identifyCloud(
  imageSource: string // either a URL or a base64 data URL (data:image/...;base64,...)
): Promise<CloudIdentifyResult> {
  const isBase64 = imageSource.startsWith("data:");
  const imagePayload = isBase64
    ? { url: imageSource, detail: "high" as const }
    : { url: imageSource, detail: "high" as const };

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: USER_PROMPT },
          {
            type: "image_url",
            image_url: imagePayload,
          },
        ],
      },
    ],
    max_tokens: 400,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("GPT 没有返回内容");
  }

  const parsed = JSON.parse(content);

  return {
    cloudType: (parsed.cloudType as CloudType) ?? "未知",
    cloudTypeEn: parsed.cloudTypeEn ?? "Unknown",
    description: parsed.description ?? "",
    season: parsed.season,
    confidence: parsed.confidence ?? 0,
  };
}
