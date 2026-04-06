"use client";

import React, { forwardRef } from "react";
import { CloudIdentifyResult, FrameStyle } from "@/types/cloud";
import PolaroidFrame from "./frames/PolaroidFrame";
import FilmFrame from "./frames/FilmFrame";
import InstantFrame from "./frames/InstantFrame";

interface CloudCardProps {
  imageUrl: string;
  result: CloudIdentifyResult;
  frameStyle: FrameStyle;
}

const CloudCard = forwardRef<HTMLDivElement, CloudCardProps>(
  ({ imageUrl, result, frameStyle }, ref) => {
    const frames: Record<FrameStyle, React.ReactNode> = {
      polaroid: (
        <PolaroidFrame imageUrl={imageUrl} result={result} />
      ),
      film: (
        <FilmFrame imageUrl={imageUrl} result={result} />
      ),
      instant: (
        <InstantFrame imageUrl={imageUrl} result={result} />
      ),
    };

    return (
      <div ref={ref} className="inline-block">
        {frames[frameStyle]}
      </div>
    );
  }
);

CloudCard.displayName = "CloudCard";
export default CloudCard;
