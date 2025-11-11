import React from 'react';
import { G, Rect, Line } from 'react-native-svg';

interface CellBarsProps {
  transform?: string;
}

export default function CellBars({ transform }: CellBarsProps) {
  return (
    <G transform={transform}>
      {/* Vertical bars */}
      <Rect
        x="64"
        y="32"
        width="12"
        height="192"
        fill="#4A4A4A"
        stroke="#2A2A2A"
        strokeWidth="2"
      />
      <Rect
        x="96"
        y="32"
        width="12"
        height="192"
        fill="#4A4A4A"
        stroke="#2A2A2A"
        strokeWidth="2"
      />
      <Rect
        x="128"
        y="32"
        width="12"
        height="192"
        fill="#4A4A4A"
        stroke="#2A2A2A"
        strokeWidth="2"
      />
      <Rect
        x="160"
        y="32"
        width="12"
        height="192"
        fill="#4A4A4A"
        stroke="#2A2A2A"
        strokeWidth="2"
      />
      <Rect
        x="192"
        y="32"
        width="12"
        height="192"
        fill="#4A4A4A"
        stroke="#2A2A2A"
        strokeWidth="2"
      />

      {/* Horizontal top bar */}
      <Rect
        x="56"
        y="32"
        width="156"
        height="16"
        fill="#3A3A3A"
        stroke="#2A2A2A"
        strokeWidth="2"
      />

      {/* Horizontal bottom bar */}
      <Rect
        x="56"
        y="208"
        width="156"
        height="16"
        fill="#3A3A3A"
        stroke="#2A2A2A"
        strokeWidth="2"
      />

      {/* Highlights on bars to show metallic shine */}
      <Line x1="68" y1="36" x2="68" y2="220" stroke="#666666" strokeWidth="2" opacity="0.6" />
      <Line x1="100" y1="36" x2="100" y2="220" stroke="#666666" strokeWidth="2" opacity="0.6" />
      <Line x1="132" y1="36" x2="132" y2="220" stroke="#666666" strokeWidth="2" opacity="0.6" />
      <Line x1="164" y1="36" x2="164" y2="220" stroke="#666666" strokeWidth="2" opacity="0.6" />
      <Line x1="196" y1="36" x2="196" y2="220" stroke="#666666" strokeWidth="2" opacity="0.6" />

      {/* Shadows on bars */}
      <Line x1="74" y1="36" x2="74" y2="220" stroke="#1A1A1A" strokeWidth="1" opacity="0.4" />
      <Line x1="106" y1="36" x2="106" y2="220" stroke="#1A1A1A" strokeWidth="1" opacity="0.4" />
      <Line x1="138" y1="36" x2="138" y2="220" stroke="#1A1A1A" strokeWidth="1" opacity="0.4" />
      <Line x1="170" y1="36" x2="170" y2="220" stroke="#1A1A1A" strokeWidth="1" opacity="0.4" />
      <Line x1="202" y1="36" x2="202" y2="220" stroke="#1A1A1A" strokeWidth="1" opacity="0.4" />
    </G>
  );
}
