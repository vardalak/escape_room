import React from 'react';
import { G, Rect } from 'react-native-svg';

interface BrickProps {
  transform?: string;
}

export default function Brick({ transform }: BrickProps) {
  return (
    <G transform={transform}>
      {/* Main brick body */}
      <Rect
        x="96"
        y="96"
        width="64"
        height="64"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="2"
      />

      {/* Mortar lines to show it's a brick */}
      <Rect
        x="96"
        y="112"
        width="64"
        height="2"
        fill="#A0A0A0"
      />
      <Rect
        x="96"
        y="144"
        width="64"
        height="2"
        fill="#A0A0A0"
      />

      {/* Shadow/depth */}
      <Rect
        x="158"
        y="100"
        width="4"
        height="60"
        fill="#654321"
        opacity="0.5"
      />
      <Rect
        x="100"
        y="158"
        width="60"
        height="4"
        fill="#654321"
        opacity="0.5"
      />
    </G>
  );
}
