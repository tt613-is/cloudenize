"use client";

import React, { useEffect, useRef, useState } from "react";
import CloudCard from "@/components/CloudCard";
import { FrameStyle, GenerateCardResponse } from "@/types/cloud";

export default function Home() {
  const frameStyle: FrameStyle = "polaroid";
  const [url, setUrl] = useState("");
  const [imageData, setImageData] = useState<string | null>(null); // base64 for uploaded files
  const [previewSrc, setPreviewSrc] = useState<string | null>(null); // display src
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateCardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsDebugMode(new URLSearchParams(window.location.search).get("debug") === "1");
  }, []);

  const hasImage = !!imageData || !!url.trim();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUrl(""); // clear URL when file selected
    const reader = new FileReader();
    reader.onload = (ev) => {
      const raw = ev.target?.result as string;
      // Resize to max 1024px before sending — mobile photos can be 4-8MB and
      // exceed Vercel's 4.5MB request body limit when base64-encoded.
      const img = new Image();
      img.onload = () => {
        const MAX = 1024;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/jpeg", 0.85);
        setImageData(compressed);
        setPreviewSrc(compressed);
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  }

  function handleClearFile() {
    setImageData(null);
    setPreviewSrc(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!hasImage) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = imageData
        ? { imageData, frameStyle }
        : { imageUrl: url.trim(), frameStyle };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: GenerateCardResponse = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "生成失败，请重试");
      } else {
        setResult(data);
        // set previewSrc for URL mode
        if (!imageData && url.trim()) setPreviewSrc(url.trim());
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!cardRef.current || !result) return;
    const { default: html2canvas } = await import("html2canvas-pro");
    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      scale: 3,
      backgroundColor: "#f8f8f8",
      imageTimeout: 0,
      onclone: (_, el) => {
        // Remove the ::after specular rim — it renders as a visible stripe in html2canvas
        const style = document.createElement("style");
        style.textContent = ".polaroid-card::after { display: none !important; }";
        el.ownerDocument.head.appendChild(style);
      },
    });
    const link = document.createElement("a");
    link.download = `cloud-${result.result.cloudTypeEn.toLowerCase()}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function handleTryAnother() {
    setResult(null);
    setError(null);
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10"
      style={{ background: "radial-gradient(ellipse at 60% 20%, #ede5d8 0%, #e0d5c4 40%, #d4c9b6 100%)" }}>
      {/* Header */}
      <header className="mb-12 text-center">
        <h1
          className="tracking-widest text-3xl font-light"
          style={{ color: "#3d2f1e", letterSpacing: "0.45em", fontFamily: "Georgia, serif" }}
        >
          CLOUDENIZE
        </h1>
        <p className="mt-3 text-sm italic" style={{ color: "#8a7560", letterSpacing: "0.18em" }}>
          给你的云一次生命
        </p>
      </header>

      {/* Input form — shown when no result */}
      {!result && (
        <form
          onSubmit={handleGenerate}
          className="w-full max-w-md flex flex-col gap-5"
        >
          {/* Upload area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {imageData ? (
            /* Preview of uploaded file */
            <div
              className="relative rounded-xl overflow-hidden"
              style={{ border: "1px solid #ddd8d0" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc!}
                alt="preview"
                className="w-full object-cover"
                style={{ maxHeight: 220 }}
              />
              <div
                className="absolute inset-0 flex items-end"
                style={{ background: "linear-gradient(transparent 50%, rgba(0,0,0,0.45) 100%)" }}
              >
                <div className="flex justify-between items-center w-full px-4 py-3">
                  <span className="text-white text-sm truncate" style={{ maxWidth: "70%" }}>
                    {fileName}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="text-white text-sm underline"
                    style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.8 }}
                  >
                    重新选择
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload button */
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl py-8 flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
              style={{
                background: "rgba(255,252,248,0.7)",
                border: "1.5px dashed #b8a892",
                cursor: "pointer",
                color: "#5a4a36",
                boxShadow: "0 4px 24px rgba(90,60,30,0.08)",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a09080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span className="text-base" style={{ letterSpacing: "0.06em" }}>上传云照片</span>
              <span className="text-sm" style={{ color: "#9a8878" }}>支持 JPG、PNG、HEIC</span>
            </button>
          )}

          {/* URL input (debug mode only — add ?debug=1 to URL) */}
          {isDebugMode && !imageData && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "#ddd8d0" }} />
                <span className="text-sm" style={{ color: "#b0a090" }}>或输入图片链接</span>
                <div className="flex-1 h-px" style={{ background: "#ddd8d0" }} />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl px-5 py-4 text-base outline-none"
                style={{
                  background: "#fff",
                  border: "1px solid #ddd8d0",
                  color: "#2c2416",
                  fontFamily: "Georgia, serif",
                }}
              />
            </div>
          )}

          {/* Generate button */}
          <button
            type="submit"
            disabled={loading || !hasImage}
            className="w-full rounded-xl py-4 text-base tracking-widest transition-opacity"
            style={{
              background: loading ? "#c0b0a0" : "#4a3828",
              color: "#f0ead8",
              letterSpacing: "0.22em",
              opacity: loading || !hasImage ? 0.6 : 1,
              cursor: loading ? "wait" : "pointer",
              border: "none",
            }}
          >
            {loading ? "识别中..." : "生成记忆卡片"}
          </button>

          {/* Loading indicator */}
          {loading && (
            <div className="flex flex-col items-center gap-3 mt-2">
              <div
                className="animate-spin-slow"
                style={{
                  width: 38, height: 38,
                  border: "3px solid #ddd8d0",
                  borderTopColor: "#4a3828",
                  borderRadius: "50%",
                }}
              />
              <p className="text-sm" style={{ color: "#a09080" }}>
                正在识别云的类型，生成诗意文字...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="rounded-xl px-5 py-4 text-base text-center"
              style={{ background: "#fdf0ec", color: "#c0503a", border: "1px solid #f0d0c8" }}
            >
              {error}
            </div>
          )}
        </form>
      )}

      {/* Card result */}
      {result && !loading && (
        <div className="flex flex-col items-center gap-6 card-enter">
          {/* The card */}
          <CloudCard
            ref={cardRef}
            imageUrl={previewSrc ?? url}
            result={result.result}
            frameStyle={result.frameStyle}
          />

          {/* Action buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleDownload}
              className="px-6 py-3 rounded-full text-base tracking-wider"
              style={{
                background: "#4a3828",
                color: "#f8f6f2",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.1em",
              }}
            >
              保存卡片
            </button>
            <button
              onClick={handleTryAnother}
              className="px-6 py-3 rounded-full text-base tracking-wider"
              style={{
                background: "#ede8e0",
                color: "#7a6a5a",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.1em",
              }}
            >
              换一张
            </button>
          </div>

        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center italic" style={{ color: "#a09070", fontSize: 12, letterSpacing: "0.1em" }}>
        <p>每一朵云，都值得被记住。</p>
      </footer>
    </main>
  );
}
