import React from 'react';
import { G, Rect, Line } from 'react-native-svg';

interface CotProps {
  transform?: string;
}

export default function Cot({ transform }: CotProps) {
  return (
    <G transform={transform}>
      {/* Mattress */}
      <Rect
        x="64"
        y="128"
        width="192"
        height="96"
        fill="#6B8E23"
        stroke="#556B2F"
        strokeWidth="3"
        rx="4"
      />

      {/* Mattress texture lines */}
      <Line x1="64" y1="160" x2="256" y2="160" stroke="#556B2F" strokeWidth="1" opacity="0.4" />
      <Line x1="64" y1="192" x2="256" y2="192" stroke="#556B2F" strokeWidth="1" opacity="0.4" />

      {/* Frame - left side */}
      <Rect
        x="56"
        y="224"
        width="8"
        height="32"
        fill="#4A4A4A"
        stroke="#333333"
        strokeWidth="2"
      />

      {/* Frame - right side */}
      <Rect
        x="248"
        y="224"
        width="8"
        height="32"
        fill="#4A4A4A"
        stroke="#333333"
        strokeWidth="2"
      />

      {/* Frame legs - left front */}
      <Rect
        x="60"
        y="256"
        width="4"
        height="20"
        fill="#2A2A2A"
      />

      {/* Frame legs - right front */}
      <Rect
        x="248"
        y="256"
        width="4"
        height="20"
        fill="#2A2A2A"
      />

      {/* Shadow under mattress */}
      <Rect
        x="70"
        y="224"
        width="180"
        height="4"
        fill="#000000"
        opacity="0.3"
      />
    </G>
  );
}
