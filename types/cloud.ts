export type CloudType =
  // Real meteorological types
  | "卷云"
  | "积云"
  | "层云"
  | "积雨云"
  | "高积云"
  | "卷积云"
  | "卷层云"
  | "高层云"
  | "雨层云"
  | "层积云"
  // Fantasy cloud types
  | "梦境积云"
  | "彩霞幻云"
  | "星织云"
  | "画境云"
  | "糖棉云"
  | "水墨幻云"
  | "童话云"
  // Fallback
  | "未知"
  | (string & Record<never, never>);

export type FrameStyle = "polaroid" | "film" | "instant";

export interface CloudIdentifyResult {
  cloudType: CloudType;
  cloudTypeEn: string;
  description: string;
  season?: string;
  confidence: number;
}

export interface GenerateCardRequest {
  imageUrl?: string;
  imageData?: string; // base64 data URL for uploaded files
  frameStyle?: FrameStyle;
}

export interface GenerateCardResponse {
  result: CloudIdentifyResult;
  frameStyle: FrameStyle;
  error?: string;
}
