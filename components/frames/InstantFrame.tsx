"use client";

import React from "react";
import { CloudIdentifyResult } from "@/types/cloud";

interface Props {
  imageUrl: string;
  result: CloudIdentifyResult;
}

export default function InstantFrame({ imageUrl, result }: Props) {
  const now = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  return (
    <div
      className="flex flex-col shadow-xl"
      style={{
        width: 360,
        background: "#f5f0e8",
        borderRadius: 19,
        padding: "22px 22px 62px 22px",
        fontFamily: "'Georgia', serif",
        position: "relative",
      }}
    >
      {/* Photo */}
      <div
        className="relative overflow-hidden"
        style={{ width: 316, height: 316, borderRadius: 10 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="cloud"
          className="w-full h-full object-cover"
          style={{ filter: "saturate(0.85) brightness(0.97)" }}
          crossOrigin="anonymous"
        />
        {/* Warm light leak */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,200,100,0.12) 0%, transparent 50%, rgba(180,100,255,0.06) 100%)",
          }}
        />
      </div>

      {/* Handwritten-style text */}
      <div
        className="mt-5 flex flex-col gap-1"
        style={{ width: 316 }}
      >
        <div className="flex justify-between items-end">
          <span
            style={{
              fontSize: 19,
              color: "#5a4a3a",
              fontStyle: "italic",
              letterSpacing: "0.04em",
            }}
          >
            {result.cloudType}
          </span>
          <span style={{ fontSize: 11, color: "#b0a090" }}>{dateStr}</span>
        </div>
        <div
          className="mt-1"
          style={{
            width: "100%",
            borderBottom: "1px solid #d4c9b4",
          }}
        />
        <p
          className="mt-2"
          style={{
            fontSize: 13,
            color: "#7a6a5a",
            lineHeight: 2.0,
            fontStyle: "italic",
          }}
        >
          {result.description}
        </p>
      </div>

      {/* Corner stamp */}
      <div
        className="absolute bottom-5 right-6 text-center"
        style={{
          fontSize: 10,
          color: "#c0b0a0",
          letterSpacing: "0.15em",
          lineHeight: 1.4,
        }}
      >
        <div>CLOUDENIZE</div>
        <div>{result.cloudTypeEn.toUpperCase()}</div>
      </div>
    </div>
  );
}
