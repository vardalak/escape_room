import React from 'react';
import { G, Rect, Line, Circle } from 'react-native-svg';

interface GunRackProps {
  transform?: string;
}

export default function GunRack({ transform }: GunRackProps) {
  return (
    <G transform={transform}>
      {/* Wooden backing board */}
      <Rect
        x="48"
        y="32"
        width="160"
        height="192"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="3"
      />

      {/* Wood grain texture */}
      <Line x1="48" y1="80" x2="208" y2="80" stroke="#654321" strokeWidth="1" opacity="0.3" />
      <Line x1="48" y1="128" x2="208" y2="128" stroke="#654321" strokeWidth="1" opacity="0.3" />
      <Line x1="48" y1="176" x2="208" y2="176" stroke="#654321" strokeWidth="1" opacity="0.3" />

      {/* Horizontal support bars (darker wood) */}
      <Rect
        x="56"
        y="96"
        width="144"
        height="12"
        fill="#654321"
        stroke="#4A3010"
        strokeWidth="2"
      />
      <Rect
        x="56"
        y="160"
        width="144"
        height="12"
        fill="#654321"
        stroke="#4A3010"
        strokeWidth="2"
      />

      {/* Rifle barrels (metallic) */}
      <Rect
        x="72"
        y="64"
        width="8"
        height="120"
        fill="#505050"
        stroke="#303030"
        strokeWidth="2"
        rx="2"
      />
      <Rect
        x="104"
        y="64"
        width="8"
        height="120"
        fill="#505050"
        stroke="#303030"
        strokeWidth="2"
        rx="2"
      />
      <Rect
        x="136"
        y="64"
        width="8"
        height="120"
        fill="#505050"
        stroke="#303030"
        strokeWidth="2"
        rx="2"
      />
      <Rect
        x="168"
        y="64"
        width="8"
        height="120"
        fill="#505050"
        stroke="#303030"
        strokeWidth="2"
        rx="2"
      />

      {/* Rifle stocks (wooden handles) */}
      <Rect
        x="70"
        y="184"
        width="12"
        height="32"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="1"
      />
      <Rect
        x="102"
        y="184"
        width="12"
        height="32"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="1"
      />
      <Rect
        x="134"
        y="184"
        width="12"
        height="32"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="1"
      />
      <Rect
        x="166"
        y="184"
        width="12"
        height="32"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="1"
      />

      {/* Metal highlights on barrels */}
      <Line x1="74" y1="68" x2="74" y2="180" stroke="#808080" strokeWidth="1" opacity="0.6" />
      <Line x1="106" y1="68" x2="106" y2="180" stroke="#808080" strokeWidth="1" opacity="0.6" />
      <Line x1="138" y1="68" x2="138" y2="180" stroke="#808080" strokeWidth="1" opacity="0.6" />
      <Line x1="170" y1="68" x2="170" y2="180" stroke="#808080" strokeWidth="1" opacity="0.6" />

      {/* Mounting pegs */}
      <Circle cx="64" cy="56" r="4" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1" />
      <Circle cx="192" cy="56" r="4" fill="#2A2A2A" stroke="#1A1A1A" strokeWidth="1" />
    </G>
  );
}
