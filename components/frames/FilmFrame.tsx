"use client";

import React from "react";
import { CloudIdentifyResult } from "@/types/cloud";

interface Props {
  imageUrl: string;
  result: CloudIdentifyResult;
}

function SprocketHoles({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute top-0 bottom-0 flex flex-col justify-around items-center py-3"
      style={{ [side]: 5, width: 17 }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-sm"
          style={{ width: 10, height: 7 }}
        />
      ))}
    </div>
  );
}

export default function FilmFrame({ imageUrl, result }: Props) {
  const now = new Date();
  const dateStr = `'${String(now.getFullYear()).slice(2)} ${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div
      className="relative flex flex-col bg-black"
      style={{ width: 384, padding: "29px 34px" }}
    >
      <SprocketHoles side="left" />
      <SprocketHoles side="right" />

      {/* Frame number */}
      <div
        className="absolute top-2 left-10 text-gray-500 font-mono"
        style={{ fontSize: 11, letterSpacing: "0.2em" }}
      >
        36 ▶ 35 ▶ 34
      </div>

      {/* Photo */}
      <div
        className="relative overflow-hidden"
        style={{ width: 316, height: 316 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="cloud"
          className="w-full h-full object-cover"
          style={{ filter: "sepia(20%) contrast(1.05)" }}
          crossOrigin="anonymous"
        />
        {/* Date stamp */}
        <div
          className="absolute bottom-2 right-2 font-mono text-amber-400"
          style={{ fontSize: 12, textShadow: "0 0 4px rgba(255,160,0,0.8)" }}
        >
          {dateStr}
        </div>
      </div>

      {/* Text strip */}
      <div
        className="mt-4 border-t border-gray-700 pt-4"
        style={{ width: 316 }}
      >
        <div className="flex justify-between items-center mb-2">
          <span
            className="text-amber-400 font-mono tracking-widest"
            style={{ fontSize: 13 }}
          >
            {result.cloudTypeEn.toUpperCase()}
          </span>
          <span className="text-gray-500 font-mono" style={{ fontSize: 11 }}>
            ISO 400
          </span>
        </div>
        <p
          className="text-gray-300 leading-relaxed"
          style={{ fontSize: 12, lineHeight: 1.9 }}
        >
          {result.cloudType} · {result.description}
        </p>
      </div>
    </div>
  );
}
