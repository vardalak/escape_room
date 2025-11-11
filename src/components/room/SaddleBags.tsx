import React from 'react';
import { G, Rect, Path, Circle } from 'react-native-svg';

interface SaddleBagsProps {
  transform?: string;
}

export default function SaddleBags({ transform }: SaddleBagsProps) {
  return (
    <G transform={transform}>
      {/* Left bag */}
      <Rect
        x="64"
        y="96"
        width="56"
        height="72"
        fill="#654321"
        stroke="#4A3010"
        strokeWidth="3"
        rx="4"
      />

      {/* Left bag flap */}
      <Rect
        x="68"
        y="96"
        width="48"
        height="24"
        fill="#8B4513"
        stroke="#4A3010"
        strokeWidth="2"
        rx="2"
      />

      {/* Left bag buckle */}
      <Circle cx="92" cy="108" r="4" fill="#B8860B" stroke="#8B7500" strokeWidth="1" />

      {/* Right bag */}
      <Rect
        x="136"
        y="96"
        width="56"
        height="72"
        fill="#654321"
        stroke="#4A3010"
        strokeWidth="3"
        rx="4"
      />

      {/* Right bag flap */}
      <Rect
        x="140"
        y="96"
        width="48"
        height="24"
        fill="#8B4513"
        stroke="#4A3010"
        strokeWidth="2"
        rx="2"
      />

      {/* Right bag buckle */}
      <Circle cx="164" cy="108" r="4" fill="#B8860B" stroke="#8B7500" strokeWidth="1" />

      {/* Connecting strap */}
      <Rect
        x="118"
        y="124"
        width="20"
        height="12"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="2"
        rx="2"
      />

      {/* Stitching details on left bag */}
      <Path
        d="M 72 120 L 116 120"
        stroke="#4A3010"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.6"
      />
      <Path
        d="M 72 144 L 116 144"
        stroke="#4A3010"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.6"
      />

      {/* Stitching details on right bag */}
      <Path
        d="M 144 120 L 188 120"
        stroke="#4A3010"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.6"
      />
      <Path
        d="M 144 144 L 188 144"
        stroke="#4A3010"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.6"
      />

      {/* Shadow */}
      <Rect
        x="70"
        y="164"
        width="116"
        height="6"
        fill="#000000"
        opacity="0.3"
        rx="2"
      />
    </G>
  );
}
