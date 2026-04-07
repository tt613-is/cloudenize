"use client";

import React from "react";
import { CloudIdentifyResult } from "@/types/cloud";

interface Props {
  imageUrl: string;
  result: CloudIdentifyResult;
}

export default function PolaroidFrame({ imageUrl, result }: Props) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div
      className="polaroid-card flex flex-col"
      style={{
        width: 384,
        maxWidth: "calc(100vw - 32px)",
        padding: "22px 22px 68px 22px",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Plastic edge highlights */}
      <div className="absolute inset-y-0 left-0 w-0.5 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.1) 100%)", zIndex: 1 }} />
      <div className="absolute inset-y-0 right-0 w-px pointer-events-none" style={{ background: "rgba(0,0,0,0.06)", zIndex: 1 }} />
      <div className="absolute inset-x-0 bottom-0 h-px pointer-events-none" style={{ background: "rgba(0,0,0,0.08)", zIndex: 1 }} />

      {/* Photo area */}
      <div
        className="relative overflow-hidden bg-gray-200"
        style={{ width: "100%", aspectRatio: "1" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="cloud"
          className="w-full h-full object-cover"
          style={{ filter: "contrast(1.06) saturate(1.10) brightness(1.01)" }}
        />
        {/* Chemical film iridescent sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(200,220,255,0.04) 0%, transparent 40%, rgba(255,200,180,0.03) 100%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.18) 100%)",
          }}
        />
        {/* Hard frame border */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1.5px rgba(0,0,0,0.15)" }}
        />
      </div>

      {/* Bottom text area */}
      <div className="mt-5 flex flex-col gap-1.5" style={{ width: "100%" }}>
        <div className="flex justify-between items-baseline">
          <span
            className="font-semibold tracking-widest"
            style={{ fontSize: 15, letterSpacing: "0.12em", color: "#181818" }}
          >
            {result.cloudType}
          </span>
          <span style={{ fontSize: 11, color: "#989898", letterSpacing: "0.08em" }}>
            {result.cloudTypeEn.toUpperCase()}
          </span>
        </div>
        <p
          className="leading-relaxed mt-1"
          style={{ fontSize: 12.5, lineHeight: 1.85, color: "#444040" }}
        >
          {result.description}
        </p>
        <div className="flex justify-between mt-4">
          <span style={{ fontSize: 10, color: "#b4b0ac", letterSpacing: "0.06em" }}>
            {result.season && result.season !== "未知" ? `${result.season}日` : ""}
          </span>
          <span style={{ fontSize: 10, color: "#b4b0ac", letterSpacing: "0.06em" }}>
            {dateStr}
          </span>
        </div>
      </div>
    </div>
  );
}
