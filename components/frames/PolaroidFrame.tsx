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
      className="flex flex-col bg-white shadow-2xl"
      style={{
        width: 384,
        maxWidth: "calc(100vw - 32px)",
        padding: "24px 24px 72px 24px",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Photo area */}
      <div
        className="relative overflow-hidden bg-gray-100"
        style={{ width: "100%", aspectRatio: "1" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="cloud"
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.18) 100%)",
          }}
        />
      </div>

      {/* Bottom text area */}
      <div className="mt-5 flex flex-col gap-1.5" style={{ width: "100%" }}>
        <div className="flex justify-between items-baseline">
          <span
            className="text-gray-800 font-semibold tracking-widest"
            style={{ fontSize: 16, letterSpacing: "0.12em" }}
          >
            {result.cloudType}
          </span>
          <span className="text-gray-400" style={{ fontSize: 12 }}>
            {result.cloudTypeEn.toUpperCase()}
          </span>
        </div>
        <p
          className="text-gray-600 leading-relaxed mt-1"
          style={{ fontSize: 13, lineHeight: 1.8 }}
        >
          {result.description}
        </p>
        <div className="flex justify-between mt-4">
          <span className="text-gray-300" style={{ fontSize: 11 }}>
            {result.season && result.season !== "未知" ? `${result.season}日` : ""}
          </span>
          <span className="text-gray-300" style={{ fontSize: 11 }}>
            {dateStr}
          </span>
        </div>
      </div>
    </div>
  );
}
