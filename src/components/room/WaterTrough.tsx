import React from 'react';
import { G, Rect, Path, Ellipse } from 'react-native-svg';

interface WaterTroughProps {
  transform?: string;
}

export default function WaterTrough({ transform }: WaterTroughProps) {
  return (
    <G transform={transform}>
      {/* Main trough body */}
      <Path
        d="M 64 128 L 64 180 Q 64 192 76 192 L 436 192 Q 448 192 448 180 L 448 128 Z"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="3"
      />

      {/* Inner walls */}
      <Path
        d="M 72 132 L 72 184 Q 72 188 78 188 L 434 188 Q 440 188 440 184 L 440 132"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Water */}
      <Ellipse
        cx="256"
        cy="160"
        rx="178"
        ry="20"
        fill="#4682B4"
        opacity="0.6"
      />

      {/* Water ripples */}
      <Path
        d="M 100 160 Q 120 155 140 160 Q 160 165 180 160"
        stroke="#5A9BD4"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      <Path
        d="M 220 158 Q 240 153 260 158 Q 280 163 300 158"
        stroke="#5A9BD4"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      <Path
        d="M 340 160 Q 360 155 380 160 Q 400 165 420 160"
        stroke="#5A9BD4"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />

      {/* Water highlights */}
      <Ellipse
        cx="200"
        cy="158"
        rx="30"
        ry="8"
        fill="#87CEEB"
        opacity="0.4"
      />
      <Ellipse
        cx="320"
        cy="162"
        rx="25"
        ry="6"
        fill="#87CEEB"
        opacity="0.4"
      />

      {/* Wood grain texture */}
      <Path
        d="M 68 140 Q 150 138 256 140 Q 362 142 444 140"
        stroke="#654321"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <Path
        d="M 68 160 Q 150 158 256 160 Q 362 162 444 160"
        stroke="#654321"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />

      {/* Support legs - left */}
      <Rect
        x="88"
        y="192"
        width="16"
        height="32"
        fill="#654321"
        stroke="#4A3010"
        strokeWidth="2"
      />

      {/* Support legs - center left */}
      <Rect
        x="192"
        y="192"
        width="16"
        height="32"
        fill="#654321"
        stroke="#4A3010"
        strokeWidth="2"
      />

      {/* Support legs - center right */}
      <Rect
        x="304"
        y="192"
        width="16"
        height="32"
        fill="#654321"
        stroke="#4A3010"
        strokeWidth="2"
      />

      {/* Support legs - right */}
      <Rect
        x="408"
        y="192"
        width="16"
        height="32"
        fill="#654321"
        stroke="#4A3010"
        strokeWidth="2"
      />

      {/* Shadow */}
      <Ellipse
        cx="256"
        cy="226"
        rx="190"
        ry="10"
        fill="#000000"
        opacity="0.2"
      />
    </G>
  );
}
